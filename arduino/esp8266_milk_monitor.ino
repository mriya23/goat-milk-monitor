/*
 * ====================================================================
 * GOAT MILK MONITOR - IoT System with ESP8266
 * ====================================================================
 * 
 * Hardware Requirements:
 * - ESP8266 (NodeMCU v3 recommended)
 * - MQ135 Gas Sensor (analog)
 * - pH Sensor Module (pH-4502C or similar)
 * - TCS3200 Color Sensor (digital)
 * - 5V Power Supply
 * 
 * Libraries Required:
 * - ESP8266WiFi (built-in)
 * - FirebaseESP8266 (by Mobizt)
 * - ArduinoJson (by Benoit Blanchon)
 * 
 * Author: Goat Milk Monitor Team
 * Version: 1.0
 * Last Updated: 2025
 * ====================================================================
 */

#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ArduinoJson.h>

// ====================================================================
// CONFIGURATION - EDIT THESE VALUES
// ====================================================================

// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // Ganti dengan nama WiFi Anda
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Ganti dengan password WiFi

// Firebase Configuration
#define FIREBASE_HOST "goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app"  // Tanpa https:// dan /
#define FIREBASE_AUTH "YOUR_FIREBASE_SECRET_OR_AUTH_TOKEN"  // Database secret atau auth token

// Pin Configuration
#define MQ135_PIN A0        // MQ135 analog pin
#define PH_PIN A0           // pH sensor analog pin (use analog multiplexer if same as MQ135)

// TCS3200 Color Sensor Pins
#define S0 D1               // TCS3200 S0
#define S1 D2               // TCS3200 S1
#define S2 D3               // TCS3200 S2
#define S3 D4               // TCS3200 S3
#define OUT D5              // TCS3200 OUT

// Timing Configuration
#define READING_INTERVAL 10000    // Baca sensor setiap 10 detik (10000 ms)
#define CALIBRATION_SAMPLES 10    // Jumlah sample untuk kalibrasi

// ====================================================================
// GLOBAL VARIABLES
// ====================================================================

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastReadingTime = 0;
int readingCount = 0;

// Calibration values (adjust based on your sensor calibration)
float phCalibrationOffset = 0.0;      // pH offset calibration
int mq135BaselineValue = 50;           // MQ135 baseline in clean air

// ====================================================================
// FUNCTION PROTOTYPES
// ====================================================================

void setupWiFi();
void setupFirebase();
void setupSensors();
float readPH();
int readMQ135();
void readTCS3200(int &r, int &g, int &b);
String getColorName(int r, int g, int b);
void sendToFirebase(float pH, int mq135, int r, int g, int b, String colorName);
void printSensorData(float pH, int mq135, int r, int g, int b);

// ====================================================================
// SETUP
// ====================================================================

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);
  Serial.println();
  Serial.println("====================================");
  Serial.println("  GOAT MILK MONITOR - IoT System");
  Serial.println("====================================");
  Serial.println();

  // Setup WiFi
  setupWiFi();

  // Setup Firebase
  setupFirebase();

  // Setup Sensors
  setupSensors();

  Serial.println("✅ System Ready!");
  Serial.println("Starting sensor readings...");
  Serial.println();
}

// ====================================================================
// MAIN LOOP
// ====================================================================

void loop() {
  // Check if it's time to read sensors
  if (millis() - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = millis();
    readingCount++;

    Serial.println("------------------------------------");
    Serial.print("📊 Reading #");
    Serial.println(readingCount);
    Serial.println("------------------------------------");

    // Read all sensors
    float pH = readPH();
    int mq135 = readMQ135();
    int r, g, b;
    readTCS3200(r, g, b);
    String colorName = getColorName(r, g, b);

    // Print to Serial Monitor
    printSensorData(pH, mq135, r, g, b);

    // Send to Firebase
    sendToFirebase(pH, mq135, r, g, b, colorName);

    Serial.println("------------------------------------");
    Serial.println();
  }

  // Keep Firebase connection alive
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi disconnected! Reconnecting...");
    setupWiFi();
  }
}

// ====================================================================
// WiFi SETUP
// ====================================================================

void setupWiFi() {
  Serial.print("🌐 Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi Connected!");
    Serial.print("📍 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("❌ WiFi Connection Failed!");
    Serial.println("Please check SSID and Password");
  }
}

// ====================================================================
// FIREBASE SETUP
// ====================================================================

void setupFirebase() {
  Serial.println("🔥 Setting up Firebase...");

  // Configure Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Set timeout
  firebaseData.setBSSLBufferSize(1024, 1024);
  firebaseData.setResponseSize(1024);

  Serial.println("✅ Firebase Configured!");
}

// ====================================================================
// SENSORS SETUP
// ====================================================================

void setupSensors() {
  Serial.println("🔧 Setting up sensors...");

  // MQ135 setup
  pinMode(MQ135_PIN, INPUT);
  
  // TCS3200 setup
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(OUT, INPUT);

  // Set TCS3200 frequency scaling to 20%
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);

  // Preheat MQ135 (optional - can be done before first reading)
  Serial.println("🔥 Preheating MQ135 sensor...");
  delay(2000);  // Wait 2 seconds

  Serial.println("✅ Sensors Ready!");
}

// ====================================================================
// READ pH SENSOR
// ====================================================================

float readPH() {
  // Read multiple samples for stability
  long sum = 0;
  for (int i = 0; i < CALIBRATION_SAMPLES; i++) {
    sum += analogRead(PH_PIN);
    delay(10);
  }
  
  float average = sum / CALIBRATION_SAMPLES;
  
  // Convert analog reading to voltage (ESP8266: 0-1023 = 0-3.3V)
  float voltage = average * (3.3 / 1023.0);
  
  // Convert voltage to pH
  // Formula depends on your pH sensor module
  // This is for pH-4502C module (adjust for your sensor)
  float pH = 7.0 + ((2.5 - voltage) / 0.18) + phCalibrationOffset;
  
  // Constrain pH to realistic range
  pH = constrain(pH, 0.0, 14.0);
  
  return pH;
}

// ====================================================================
// READ MQ135 SENSOR
// ====================================================================

int readMQ135() {
  // Read multiple samples for stability
  long sum = 0;
  for (int i = 0; i < CALIBRATION_SAMPLES; i++) {
    sum += analogRead(MQ135_PIN);
    delay(10);
  }
  
  float average = sum / CALIBRATION_SAMPLES;
  
  // Convert to 0-1000 scale (adjust based on your calibration)
  // Higher value = worse air quality (more gas detected)
  int mq135Value = map(average, 0, 1023, 0, 200);
  
  return mq135Value;
}

// ====================================================================
// READ TCS3200 COLOR SENSOR
// ====================================================================

void readTCS3200(int &r, int &g, int &b) {
  // Read RED
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  delay(100);
  r = pulseIn(OUT, LOW);
  r = map(r, 25, 72, 255, 0);  // Adjust these values based on calibration
  
  // Read GREEN
  digitalWrite(S2, HIGH);
  digitalWrite(S3, HIGH);
  delay(100);
  g = pulseIn(OUT, LOW);
  g = map(g, 30, 90, 255, 0);  // Adjust these values based on calibration
  
  // Read BLUE
  digitalWrite(S2, LOW);
  digitalWrite(S3, HIGH);
  delay(100);
  b = pulseIn(OUT, LOW);
  b = map(b, 25, 70, 255, 0);  // Adjust these values based on calibration
  
  // Constrain to valid RGB range
  r = constrain(r, 0, 255);
  g = constrain(g, 0, 255);
  b = constrain(b, 0, 255);
}

// ====================================================================
// GET COLOR NAME
// ====================================================================

String getColorName(int r, int g, int b) {
  // Calculate average RGB (brightness)
  int avg = (r + g + b) / 3;
  
  // Determine color based on RGB values and average
  if (avg >= 245) {
    return "Putih";           // White - Very clean milk
  } else if (avg >= 240) {
    return "Putih Kekuningan"; // Off-white - Slightly aged
  } else if (avg >= 200) {
    return "Kekuningan";      // Yellowish - Aged milk
  } else {
    return "Kuning";          // Yellow - Spoiled
  }
}

// ====================================================================
// SEND DATA TO FIREBASE
// ====================================================================

void sendToFirebase(float pH, int mq135, int r, int g, int b, String colorName) {
  Serial.println("📤 Sending to Firebase...");

  // Create RGB string in format "R,G,B"
  String rgbString = String(r) + "," + String(g) + "," + String(b);

  // Create JSON object
  FirebaseJson json;
  json.set("pH", pH);
  json.set("mq135", mq135);
  json.set("rgb", rgbString);
  json.set("color", colorName);
  json.set("timestamp", millis());  // Use millis() or get from NTP server

  // Generate unique ID for this reading
  String readingID = "reading_" + String(millis());

  // Push to Firebase
  String path = "/readings/" + readingID;
  
  if (Firebase.setJSON(firebaseData, path, json)) {
    Serial.println("✅ Data sent successfully!");
    Serial.print("📍 Path: ");
    Serial.println(path);
  } else {
    Serial.println("❌ Failed to send data");
    Serial.print("⚠️  Error: ");
    Serial.println(firebaseData.errorReason());
  }
}

// ====================================================================
// PRINT SENSOR DATA TO SERIAL
// ====================================================================

void printSensorData(float pH, int mq135, int r, int g, int b) {
  Serial.println("📊 Sensor Readings:");
  Serial.println("   ┌─────────────────────────────┐");
  Serial.print("   │ pH Level    : ");
  Serial.print(pH, 2);
  
  // Determine pH quality
  if (pH >= 6.5 && pH <= 6.8) {
    Serial.println(" ✅ OPTIMAL");
  } else if (pH >= 6.2 && pH <= 6.9) {
    Serial.println(" ⚠️  SEDANG");
  } else {
    Serial.println(" ❌ BURUK");
  }
  
  Serial.print("   │ MQ135       : ");
  Serial.print(mq135);
  
  // Determine MQ135 quality
  if (mq135 < 70) {
    Serial.println(" ✅ SEGAR");
  } else if (mq135 < 100) {
    Serial.println(" ⚠️  SEDANG");
  } else {
    Serial.println(" ❌ BURUK");
  }
  
  Serial.print("   │ RGB         : ");
  Serial.print(r);
  Serial.print(", ");
  Serial.print(g);
  Serial.print(", ");
  Serial.println(b);
  
  int avg = (r + g + b) / 3;
  Serial.print("   │ RGB Average : ");
  Serial.print(avg);
  
  // Determine color quality
  if (avg >= 245) {
    Serial.println(" ✅ PUTIH BERSIH");
  } else if (avg >= 240) {
    Serial.println(" ⚠️  KEKUNINGAN");
  } else {
    Serial.println(" ❌ KUNING");
  }
  
  Serial.println("   └─────────────────────────────┘");
  
  // Overall quality prediction
  Serial.print("   🎯 Predicted Quality: ");
  if (pH >= 6.5 && pH <= 6.8 && mq135 < 70 && avg >= 245) {
    Serial.println("BAIK ✅");
  } else if (mq135 > 100 || pH < 6.0 || pH > 7.0) {
    Serial.println("BURUK ❌");
  } else {
    Serial.println("SEDANG ⚠️");
  }
}

// ====================================================================
// END OF CODE
// ====================================================================