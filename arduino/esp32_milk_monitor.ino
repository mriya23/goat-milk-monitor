/*
 * ====================================================================
 * GOAT MILK MONITOR - IoT System with ESP32
 * ====================================================================
 * 
 * Hardware Requirements:
 * - ESP32 DevKit v1 or similar
 * - MQ135 Gas Sensor (analog)
 * - pH Sensor Module (pH-4502C or similar)
 * - TCS3200 Color Sensor (digital)
 * - 5V Power Supply
 * 
 * Libraries Required:
 * - WiFi (built-in)
 * - Firebase_ESP_Client (by Mobizt)
 * - ArduinoJson (by Benoit Blanchon)
 * 
 * Author: Goat Milk Monitor Team
 * Version: 1.0
 * Last Updated: 2025
 * ====================================================================
 */

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ArduinoJson.h>

// Provide the token generation process info
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions
#include "addons/RTDBHelper.h"

// ====================================================================
// CONFIGURATION - EDIT THESE VALUES
// ====================================================================

// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // Ganti dengan nama WiFi Anda
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Ganti dengan password WiFi

// Firebase Configuration
#define FIREBASE_HOST "goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "YOUR_FIREBASE_SECRET_OR_AUTH_TOKEN"  // Database secret atau auth token

// Pin Configuration (ESP32)
#define MQ135_PIN 34        // MQ135 analog pin (GPIO34 - ADC1_CH6)
#define PH_PIN 35           // pH sensor analog pin (GPIO35 - ADC1_CH7)

// TCS3200 Color Sensor Pins
#define S0 19               // TCS3200 S0
#define S1 18               // TCS3200 S1
#define S2 5                // TCS3200 S2
#define S3 17               // TCS3200 S3
#define OUT 16              // TCS3200 OUT

// LED Indicator (optional)
#define LED_PIN 2           // Built-in LED on most ESP32 boards

// Timing Configuration
#define READING_INTERVAL 10000    // Baca sensor setiap 10 detik (10000 ms)
#define CALIBRATION_SAMPLES 10    // Jumlah sample untuk kalibrasi

// ====================================================================
// GLOBAL VARIABLES
// ====================================================================

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastReadingTime = 0;
int readingCount = 0;
bool firebaseReady = false;

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
void blinkLED(int times);

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
  Serial.println("  Platform: ESP32");
  Serial.println("====================================");
  Serial.println();

  // Setup LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Setup WiFi
  setupWiFi();

  // Setup Firebase
  setupFirebase();

  // Setup Sensors
  setupSensors();

  Serial.println("✅ System Ready!");
  Serial.println("Starting sensor readings...");
  Serial.println();
  
  // Blink LED 3 times to indicate ready
  blinkLED(3);
}

// ====================================================================
// MAIN LOOP
// ====================================================================

void loop() {
  // Check if it's time to read sensors
  if (millis() - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = millis();
    readingCount++;

    // Turn on LED during reading
    digitalWrite(LED_PIN, HIGH);

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
    if (firebaseReady) {
      sendToFirebase(pH, mq135, r, g, b, colorName);
    } else {
      Serial.println("⚠️  Firebase not ready, skipping upload");
    }

    Serial.println("------------------------------------");
    Serial.println();

    // Turn off LED after reading
    digitalWrite(LED_PIN, LOW);
  }

  // Keep WiFi connection alive
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

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi Connected!");
    Serial.print("📍 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("📶 Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
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

  // Assign the api key (required for token generation)
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Assign the callback function for the long running token generation task
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Initialize Firebase
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Set database read timeout
  fbdo.setBSSLBufferSize(4096, 1024);
  fbdo.setResponseSize(2048);

  Serial.println("✅ Firebase Configured!");
  firebaseReady = true;
}

// ====================================================================
// SENSORS SETUP
// ====================================================================

void setupSensors() {
  Serial.println("🔧 Setting up sensors...");

  // MQ135 setup (analog input)
  pinMode(MQ135_PIN, INPUT);
  
  // pH sensor setup (analog input)
  pinMode(PH_PIN, INPUT);
  
  // TCS3200 setup (digital pins)
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(OUT, INPUT);

  // Set TCS3200 frequency scaling to 20%
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);

  // Configure ADC for better accuracy
  analogReadResolution(12);  // ESP32 has 12-bit ADC (0-4095)
  analogSetAttenuation(ADC_11db);  // Full range: 0-3.3V

  // Preheat MQ135 sensor
  Serial.println("🔥 Preheating MQ135 sensor (2 seconds)...");
  delay(2000);

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
  
  // Convert analog reading to voltage (ESP32: 0-4095 = 0-3.3V with 12-bit ADC)
  float voltage = average * (3.3 / 4095.0);
  
  // Convert voltage to pH
  // Formula for pH-4502C module (adjust for your sensor)
  // pH = 7 + [(2.5 - voltage) / 0.18]
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
  
  // Convert to 0-200 scale (adjust based on your calibration)
  // ESP32 ADC: 0-4095 with 12-bit resolution
  // Higher value = worse air quality (more gas detected)
  int mq135Value = map(average, 0, 4095, 0, 200);
  
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
  json.set("rgb", rgbString.c_str());
  json.set("color", colorName.c_str());
  json.set("timestamp", millis());

  // Generate unique ID for this reading
  String readingID = "reading_" + String(millis());

  // Push to Firebase
  String path = "/readings/" + readingID;
  
  if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
    Serial.println("✅ Data sent successfully!");
    Serial.print("📍 Path: ");
    Serial.println(path);
    blinkLED(1);  // Quick blink on success
  } else {
    Serial.println("❌ Failed to send data");
    Serial.print("⚠️  Error: ");
    Serial.println(fbdo.errorReason());
    blinkLED(5);  // Fast blinks on error
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
// LED BLINK HELPER
// ====================================================================

void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}

// ====================================================================
// END OF CODE
// ====================================================================