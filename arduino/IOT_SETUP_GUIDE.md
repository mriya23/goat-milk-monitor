# 🔧 IoT Setup Guide - Goat Milk Monitor

## 📋 Table of Contents
1. [Hardware Requirements](#hardware-requirements)
2. [Software Requirements](#software-requirements)
3. [Wiring Diagram](#wiring-diagram)
4. [Arduino IDE Setup](#arduino-ide-setup)
5. [Code Configuration](#code-configuration)
6. [Sensor Calibration](#sensor-calibration)
7. [Upload & Testing](#upload--testing)
8. [Troubleshooting](#troubleshooting)

---

## 🛒 Hardware Requirements

### Essential Components

| No | Component | Quantity | Specifications | Purpose |
|----|-----------|----------|----------------|---------|
| 1 | **ESP8266 / ESP32** | 1 | NodeMCU v3 / ESP32 DevKit | WiFi & Processing |
| 2 | **MQ135 Gas Sensor** | 1 | Analog output | Deteksi bau/odor |
| 3 | **pH Sensor Module** | 1 | pH-4502C or analog | Deteksi keasaman |
| 4 | **TCS3200 Color Sensor** | 1 | Digital RGB output | Deteksi warna |
| 5 | **Breadboard** | 1 | 830 tie-points | Prototyping |
| 6 | **Jumper Wires** | 20+ | Male-Male, Male-Female | Connections |
| 7 | **Power Supply** | 1 | 5V 2A micro USB | Power untuk ESP |
| 8 | **USB Cable** | 1 | Micro USB | Upload & Power |

### Optional Components

| Component | Purpose |
|-----------|---------|
| LED (3mm/5mm) | Visual indicator |
| Resistor 220Ω | LED current limiting |
| Push Button | Manual trigger reading |
| LCD Display 16x2 | Local display readings |

---

## 💻 Software Requirements

### 1. Arduino IDE
- **Download**: https://www.arduino.cc/en/software
- **Version**: 1.8.19+ atau Arduino IDE 2.0+
- **OS**: Windows, Mac, atau Linux

### 2. Required Libraries

Install via **Arduino IDE → Tools → Manage Libraries**:

```
1. ESP8266WiFi (built-in for ESP8266)
   atau WiFi.h (built-in for ESP32)

2. FirebaseESP8266 (by Mobizt) - untuk ESP8266
   atau Firebase_ESP_Client (by Mobizt) - untuk ESP32
   
3. ArduinoJson (by Benoit Blanchon)
   Version: 6.x.x (terbaru)
```

### 3. Board Manager

**Untuk ESP8266:**
- File → Preferences → Additional Board Manager URLs
- Add: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
- Tools → Board → Boards Manager → Install "esp8266"

**Untuk ESP32:**
- File → Preferences → Additional Board Manager URLs
- Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
- Tools → Board → Boards Manager → Install "esp32"

---

## 🔌 Wiring Diagram

### ESP8266 NodeMCU Wiring

```
┌─────────────────────────────────────────────────────────────────┐
│                         ESP8266 NodeMCU                         │
│                                                                 │
│   3V3  ●─────────────────┬────────────────┬──────────────────  │
│                          │                │                     │
│   GND  ●─────────────────┼────────────────┼──────────┬──────── │
│                          │                │          │         │
│   A0   ●─────────────────┼────────────────┼──────────┼──────── │
│                          │                │          │         │
│   D1   ●─────────────────┼────────────────┼──────────┼──────── │
│   D2   ●─────────────────┼────────────────┼──────────┼──────── │
│   D3   ●─────────────────┼────────────────┼──────────┼──────── │
│   D4   ●─────────────────┼────────────────┼──────────┼──────── │
│   D5   ●─────────────────┼────────────────┼──────────┼──────── │
│                          │                │          │         │
└──────────────────────────┼────────────────┼──────────┼─────────┘
                           │                │          │
                           │                │          │
        ┌──────────────────┘                │          │
        │                                   │          │
    ┌───▼───┐                           ┌───▼───┐  ┌───▼────┐
    │ MQ135 │                           │pH Mod │  │TCS3200 │
    │       │                           │       │  │        │
    │ VCC ──┼── 3V3                     │ VCC ──┼──┼─ 3V3   │
    │ GND ──┼── GND                     │ GND ──┼──┼─ GND   │
    │ A0  ──┼── A0                      │ OUT ──┼──┼─ A0    │
    └───────┘                           └───────┘  │        │
                                                   │ S0  ───┼── D1
                                                   │ S1  ───┼── D2
                                                   │ S2  ───┼── D3
                                                   │ S3  ───┼── D4
                                                   │ OUT ───┼── D5
                                                   └────────┘
```

### Pin Connections Table - ESP8266

| Sensor | Sensor Pin | ESP8266 Pin | Notes |
|--------|------------|-------------|-------|
| **MQ135** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | A0 | A0 | Analog output |
| **pH Sensor** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | PO/OUT | A0* | Analog output |
| **TCS3200** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | S0 | D1 (GPIO5) | Frequency scale |
| | S1 | D2 (GPIO4) | Frequency scale |
| | S2 | D3 (GPIO0) | Color select |
| | S3 | D4 (GPIO2) | Color select |
| | OUT | D5 (GPIO14) | Frequency output |

**⚠️ NOTE**: ESP8266 hanya punya 1 ADC pin (A0). Jika pH dan MQ135 butuh dibaca bersamaan, gunakan **Analog Multiplexer (CD4051)** atau baca bergantian dengan relay.

### ESP32 Wiring

```
┌─────────────────────────────────────────────────────────────────┐
│                            ESP32 DevKit                          │
│                                                                  │
│   3V3  ●─────────────────┬────────────────┬──────────────────── │
│                          │                │                     │
│   GND  ●─────────────────┼────────────────┼──────────┬───────── │
│                          │                │          │          │
│   GPIO34 ●───────────────┼────────────────┼──────────┼───────── │
│   GPIO35 ●───────────────┼────────────────┼──────────┼───────── │
│                          │                │          │          │
│   GPIO19 ●───────────────┼────────────────┼──────────┼───────── │
│   GPIO18 ●───────────────┼────────────────┼──────────┼───────── │
│   GPIO5  ●───────────────┼────────────────┼──────────┼───────── │
│   GPIO17 ●───────────────┼────────────────┼──────────┼───────── │
│   GPIO16 ●───────────────┼────────────────┼──────────┼───────── │
│                          │                │          │          │
└──────────────────────────┼────────────────┼──────────┼──────────┘
                           │                │          │
        ┌──────────────────┘                │          │
        │                                   │          │
    ┌───▼───┐                           ┌───▼───┐  ┌───▼────┐
    │ MQ135 │                           │pH Mod │  │TCS3200 │
    │       │                           │       │  │        │
    │ VCC ──┼── 3V3                     │ VCC ──┼──┼─ 3V3   │
    │ GND ──┼── GND                     │ GND ──┼──┼─ GND   │
    │ A0  ──┼── GPIO34                  │ OUT ──┼── GPIO35  │
    └───────┘                           └───────┘  │        │
                                                   │ S0  ───┼── GPIO19
                                                   │ S1  ───┼── GPIO18
                                                   │ S2  ───┼── GPIO5
                                                   │ S3  ───┼── GPIO17
                                                   │ OUT ───┼── GPIO16
                                                   └────────┘
```

### Pin Connections Table - ESP32

| Sensor | Sensor Pin | ESP32 Pin | Notes |
|--------|------------|-----------|-------|
| **MQ135** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | A0 | GPIO34 (ADC1_CH6) | Analog input |
| **pH Sensor** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | PO/OUT | GPIO35 (ADC1_CH7) | Analog input |
| **TCS3200** | VCC | 3V3 | Power |
| | GND | GND | Ground |
| | S0 | GPIO19 | Frequency scale |
| | S1 | GPIO18 | Frequency scale |
| | S2 | GPIO5 | Color select |
| | S3 | GPIO17 | Color select |
| | OUT | GPIO16 | Frequency output |

**✅ KEUNTUNGAN ESP32**: Multiple ADC pins! Bisa baca MQ135 dan pH bersamaan.

---

## ⚙️ Arduino IDE Setup

### Step 1: Install Arduino IDE
1. Download dari https://www.arduino.cc/en/software
2. Install sesuai OS Anda
3. Buka Arduino IDE

### Step 2: Install Board Support

**Untuk ESP8266:**
```
1. File → Preferences
2. Additional Board Manager URLs:
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
3. Tools → Board → Boards Manager
4. Search "esp8266"
5. Install "esp8266 by ESP8266 Community"
6. Wait until finish
```

**Untuk ESP32:**
```
1. File → Preferences
2. Additional Board Manager URLs:
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
3. Tools → Board → Boards Manager
4. Search "esp32"
5. Install "esp32 by Espressif Systems"
6. Wait until finish
```

### Step 3: Install Libraries

```
1. Sketch → Include Library → Manage Libraries
2. Search & Install:
   
   Untuk ESP8266:
   - "Firebase ESP8266 Client" by Mobizt
   - "ArduinoJson" by Benoit Blanchon (v6.x)
   
   Untuk ESP32:
   - "Firebase Arduino Client Library for ESP8266 and ESP32" by Mobizt
   - "ArduinoJson" by Benoit Blanchon (v6.x)
   
3. Wait until installation complete
```

### Step 4: Select Board & Port

**Untuk ESP8266:**
```
Tools → Board → ESP8266 Boards → NodeMCU 1.0 (ESP-12E Module)
Tools → Upload Speed → 115200
Tools → CPU Frequency → 80 MHz
Tools → Flash Size → 4MB (FS:2MB OTA:~1019KB)
Tools → Port → [Select your COM port]
```

**Untuk ESP32:**
```
Tools → Board → ESP32 Arduino → ESP32 Dev Module
Tools → Upload Speed → 115200
Tools → CPU Frequency → 240MHz (WiFi/BT)
Tools → Flash Frequency → 80MHz
Tools → Flash Size → 4MB
Tools → Port → [Select your COM port]
```

---

## 🔧 Code Configuration

### Step 1: Open Arduino Sketch

1. Buka file `esp8266_milk_monitor.ino` atau `esp32_milk_monitor.ino`
2. Atau copy code dari file tersebut ke Arduino IDE

### Step 2: Edit WiFi Credentials

```cpp
// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // ← Ganti ini
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // ← Ganti ini
```

**Contoh:**
```cpp
const char* WIFI_SSID = "IndihomeABCD";
const char* WIFI_PASSWORD = "password123";
```

### Step 3: Edit Firebase Configuration

```cpp
// Firebase Configuration
#define FIREBASE_HOST "goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "YOUR_FIREBASE_SECRET_OR_AUTH_TOKEN"  // ← Ganti ini
```

**Cara Mendapatkan Firebase Auth:**

1. **Buka Firebase Console**: https://console.firebase.google.com
2. Pilih project "goat-milk-monitor"
3. **Settings (⚙️) → Project settings**
4. Tab **"Service accounts"**
5. Klik **"Database secrets"**
6. Copy secret key
7. Paste ke `FIREBASE_AUTH`

**ATAU gunakan Database URL tanpa auth (jika rules public):**
```cpp
#define FIREBASE_AUTH ""  // Kosongkan jika rules sudah public
```

### Step 4: Adjust Pin Configuration (Optional)

Jika wiring Anda berbeda, edit pin configuration:

```cpp
// Pin Configuration
#define MQ135_PIN A0        // Pin untuk MQ135
#define PH_PIN A0           // Pin untuk pH sensor

// TCS3200 Color Sensor Pins
#define S0 D1               // Sesuaikan dengan wiring
#define S1 D2
#define S2 D3
#define S3 D4
#define OUT D5
```

### Step 5: Set Reading Interval (Optional)

```cpp
// Timing Configuration
#define READING_INTERVAL 10000    // 10 detik (10000 ms)
```

Ubah sesuai kebutuhan:
- `5000` = 5 detik (testing)
- `30000` = 30 detik (normal)
- `60000` = 1 menit (production)

---

## 🎛️ Sensor Calibration

### 1. MQ135 Gas Sensor Calibration

#### Preheat (PENTING!)
```
1. Hubungkan MQ135 ke power
2. Biarkan preheat 24-48 jam untuk hasil optimal
3. Minimal preheat: 2-3 jam
```

#### Baseline Calibration
```cpp
// Di clean air (udara bersih)
1. Upload code
2. Buka Serial Monitor (115200 baud)
3. Lihat nilai MQ135 di udara bersih
4. Catat nilai baseline (misal: 50)
5. Update di code:

int mq135BaselineValue = 50;  // ← Update dengan nilai Anda
```

#### Testing
```
Test 1: Udara bersih → MQ135 < 70
Test 2: Dekat ammonia/alkohol → MQ135 > 100
Test 3: Susu segar → MQ135 50-70
Test 4: Susu basi → MQ135 > 100
```

---

### 2. pH Sensor Calibration

#### Equipment Needed
- Buffer solution pH 4.0
- Buffer solution pH 7.0
- Buffer solution pH 10.0 (optional)
- Clean water untuk bilas

#### Calibration Steps

**Step 1: pH 7.0 (Neutral)**
```
1. Bilas sensor dengan clean water
2. Celup ke buffer solution pH 7.0
3. Tunggu 1-2 menit stabil
4. Baca nilai di Serial Monitor
5. Jika tidak 7.0, adjust offset:

float phCalibrationOffset = 0.0;  // Adjust ini

Contoh:
- Baca 7.5, harusnya 7.0 → offset = -0.5
- Baca 6.5, harusnya 7.0 → offset = +0.5
```

**Step 2: pH 4.0 (Acid)**
```
1. Bilas sensor
2. Celup ke buffer pH 4.0
3. Verifikasi pembacaan ≈ 4.0
4. Jika jauh berbeda, cek formula konversi voltage-to-pH
```

**Step 3: pH 10.0 (Base)**
```
1. Bilas sensor
2. Celup ke buffer pH 10.0
3. Verifikasi pembacaan ≈ 10.0
```

#### Testing
```
Test 1: Clean water → pH 6.5-7.5
Test 2: Lemon juice → pH 2-3
Test 3: Baking soda solution → pH 8-9
Test 4: Susu segar → pH 6.5-6.8
```

---

### 3. TCS3200 Color Sensor Calibration

#### Equipment Needed
- White reference card (kertas putih bersih)
- Black reference card (kertas hitam)
- Consistent lighting (cahaya stabil)

#### Calibration Steps

**Step 1: White Calibration**
```
1. Letakkan white card di depan sensor (jarak 2-3cm)
2. Baca nilai RGB di Serial Monitor
3. Harusnya mendekati: R=250-255, G=250-255, B=250-255
4. Jika tidak, adjust map() function:

// Di code, section readTCS3200():
r = map(r, 25, 72, 255, 0);  // ← Adjust 25 & 72
g = map(g, 30, 90, 255, 0);  // ← Adjust 30 & 90
b = map(b, 25, 70, 255, 0);  // ← Adjust 25 & 70
```

**Step 2: Black Calibration**
```
1. Letakkan black card di depan sensor
2. Baca nilai RGB
3. Harusnya mendekati: R=0-10, G=0-10, B=0-10
4. Adjust map() min values jika perlu
```

**Step 3: Lighting Consistency**
```
⚠️ PENTING:
- Gunakan lighting yang konsisten
- Hindari cahaya matahari langsung
- Jarak sensor ke objek: 2-3cm
- Gunakan light box untuk hasil terbaik
```

#### Testing
```
Test 1: White paper → RGB (250, 250, 250)
Test 2: Red paper → RGB (255, 0, 0)
Test 3: Green paper → RGB (0, 255, 0)
Test 4: Blue paper → RGB (0, 0, 255)
Test 5: Susu putih segar → RGB (245-255, 245-255, 245-255)
```

---

## 📤 Upload & Testing

### Step 1: Connect Hardware
```
1. ✅ Semua sensor terhubung sesuai wiring diagram
2. ✅ ESP8266/ESP32 terhubung ke USB
3. ✅ Power supply cukup (5V 2A recommended)
```

### Step 2: Upload Code
```
1. Verify code: Ctrl+R (check for errors)
2. Upload code: Ctrl+U
3. Wait for "Done uploading"
4. Jangan cabut USB saat uploading!
```

### Step 3: Open Serial Monitor
```
1. Tools → Serial Monitor
2. Set baud rate: 115200
3. Tunggu ESP boot up
4. Lihat output:
```

**Expected Output:**
```
====================================
  GOAT MILK MONITOR - IoT System
====================================

🌐 Connecting to WiFi: YourWiFiName
.....
✅ WiFi Connected!
📍 IP Address: 192.168.1.100
🔥 Setting up Firebase...
✅ Firebase Configured!
🔧 Setting up sensors...
🔥 Preheating MQ135 sensor...
✅ Sensors Ready!
✅ System Ready!
Starting sensor readings...

------------------------------------
📊 Reading #1
------------------------------------
📊 Sensor Readings:
   ┌─────────────────────────────┐
   │ pH Level    : 6.60 ✅ OPTIMAL
   │ MQ135       : 65 ✅ SEGAR
   │ RGB         : 250, 252, 250
   │ RGB Average : 250 ✅ PUTIH BERSIH
   └─────────────────────────────┘
   🎯 Predicted Quality: BAIK ✅

📤 Sending to Firebase...
✅ Data sent successfully!
📍 Path: /readings/reading_1234567890
------------------------------------
```

### Step 4: Verify in Firebase
```
1. Buka Firebase Console
2. Realtime Database → Data
3. Cek node "readings"
4. Harusnya ada data baru dengan format:
   {
     "pH": 6.6,
     "mq135": 65,
     "rgb": "250,252,250",
     "color": "Putih",
     "timestamp": 1234567890
   }
```

### Step 5: Check Dashboard
```
1. Buka web dashboard: http://localhost:4321
2. Klik "🔄 Refresh"
3. Data sensor harusnya muncul di "Pembacaan Terakhir"
4. Chart akan update otomatis
5. Quality akan di-classify oleh decision tree
```

---

## 🔍 Troubleshooting

### Problem 1: WiFi Not Connecting

**Symptoms:**
```
🌐 Connecting to WiFi: YourWiFi
..................
❌ WiFi Connection Failed!
```

**Solutions:**
```
✅ Cek SSID & password (case-sensitive!)
✅ WiFi 2.4GHz (ESP tidak support 5GHz)
✅ WiFi not hidden (broadcast SSID)
✅ ESP dekat dengan router
✅ Restart router jika perlu
✅ Coba WiFi lain (hotspot HP)
```

---

### Problem 2: Firebase Upload Failed

**Symptoms:**
```
❌ Failed to send data
⚠️  Error: Firebase authentication failed
```

**Solutions:**
```
✅ Cek FIREBASE_AUTH token
✅ Cek Firebase Database Rules (harus allow read/write)
✅ Cek Firebase URL (tanpa https:// dan trailing /)
✅ Cek koneksi internet
✅ Pastikan Firebase project aktif
```

**Firebase Rules untuk Testing:**
```json
{
  "rules": {
    "readings": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

### Problem 3: Sensor Reading = 0 atau NaN

**Symptoms:**
```
│ pH Level    : 0.00 ❌
│ MQ135       : 0 ❌
│ RGB         : 0, 0, 0
```

**Solutions:**
```
✅ Cek wiring (VCC, GND, Signal)
✅ Cek pin configuration di code
✅ Cek sensor dengan multimeter (voltage check)
✅ MQ135: Pastikan sudah preheat
✅ pH: Pastikan sensor tercelup di liquid
✅ TCS3200: Cek cahaya & jarak
```

---

### Problem 4: Sensor Reading Tidak Stabil

**Symptoms:**
```
pH: 6.5 → 7.2 → 6.8 → 7.5 (fluctuating)
```

**Solutions:**
```
✅ Tambah CALIBRATION_SAMPLES (dari 10 ke 20)
✅ Tambah capacitor 100uF di VCC sensor
✅ Gunakan power supply terpisah untuk sensor
✅ Jauhkan dari sumber noise (motor, relay)
✅ Preheat sensor lebih lama
✅ Stabilkan suhu & cahaya lingkungan
```

---

### Problem 5: Upload Error

**Symptoms:**
```
error: espcomm_open failed
error: espcomm_upload_mem failed
```

**Solutions:**
```
✅ Pilih COM port yang benar
✅ Install CH340/CP2102 USB driver
✅ Cabut-pasang USB cable
✅ Tekan tombol BOOT/FLASH saat upload
✅ Close Serial Monitor sebelum upload
✅ Coba kabel USB lain
✅ Restart Arduino IDE
```

---

### Problem 6: Out of Memory

**Symptoms:**
```
Sketch too big; see https://arduino.cc/...
```

**Solutions:**
```
✅ Pilih Flash Size lebih besar (4MB)
✅ Hapus Serial.println() yang tidak perlu
✅ Reduce CALIBRATION_SAMPLES
✅ Gunakan F() macro untuk strings:
   Serial.println(F("Text here"));
```

---

## 📊 Testing Checklist

### Hardware Test
```
[ ] ESP8266/ESP32 menyala (LED power on)
[ ] MQ135 heating (sensor hangat)
[ ] pH sensor tercelup di liquid
[ ] TCS3200 LED menyala (jika ada)
[ ] Semua koneksi kencang (tidak loose)
[ ] Power supply stabil (voltase check)
```

### Software Test
```
[ ] Code verify tanpa error
[ ] Upload success
[ ] Serial Monitor menampilkan output
[ ] WiFi connected (IP address shown)
[ ] Firebase configured
[ ] Sensor readings muncul di Serial
[ ] Data terkirim ke Firebase
[ ] Data muncul di Firebase Console
```

### Sensor Test
```
[ ] MQ135: Clean air < 70, Ammonia > 100
[ ] pH: Buffer 7.0 ≈ 7.0, Buffer 4.0 ≈ 4.0
[ ] TCS3200: White paper ≈ RGB(250,250,250)
[ ] Readings stabil (tidak fluctuate)
[ ] Kalibrasi sesuai expected values
```

### Integration Test
```
[ ] Dashboard menerima data baru
[ ] Chart update dengan data sensor
[ ] Decision tree classify correctly
[ ] Quality card update (Baik/Sedang/Buruk)
[ ] Timestamp display benar
[ ] Auto-refresh working (30 detik)
```

---

## 🎯 Next Steps

### After Successful Setup:

1. **Testing dengan Sampel Real**
   ```
   - Susu segar → Expect: Baik
   - Susu 1 hari → Expect: Sedang
   - Susu basi → Expect: Buruk
   ```

2. **Fine-tune Thresholds**
   ```
   Adjust di dashboard (index.astro):
   - MQ135 thresholds: 70, 100
   - pH ranges: 6.5-6.8
   - RGB average: 245
   ```

3. **Long-term Testing**
   ```
   - Run 24/7 selama 1 minggu
   - Monitor stability
   - Collect data untuk validasi
   - Adjust calibration jika perlu
   ```

4. **Optimization**
   ```
   - Deep sleep untuk battery saving
   - Add local storage (SPIFFS)
   - Add LCD display
   - Add buzzer untuk alert
   ```

---

## 📚 Additional Resources

### Documentation
- ESP8266: https://arduino-esp8266.readthedocs.io
- ESP32: https://docs.espressif.com/projects/arduino-esp32
- Firebase: https://firebase.google.com/docs/database

### Sensor Datasheets
- MQ135: [Search "MQ135 datasheet" online]
- pH-4502C: [Search "pH-4502C manual" online]
- TCS3200: [Search "TCS3200 datasheet" online]

### Community
- Arduino Forum: https://forum.arduino.cc
- ESP8266 Community: https://www.esp8266.com
- Reddit r/arduino: https://reddit.com/r/arduino

---

## ✅ Summary

### Kode Dashboard ✅ TIDAK PERLU DIUBAH!
```
Dashboard sudah siap menerima data dari sensor.
Yang Anda buat adalah kode Arduino untuk kirim data.
```

### Yang Sudah Disiapkan:
```
✅ Kode ESP8266 (esp8266_milk_monitor.ino)
✅ Kode ESP32 (esp32_milk_monitor.ino)
✅ Wiring diagram lengkap
✅ Setup guide step-by-step
✅ Calibration procedure
✅ Troubleshooting guide
```

### Yang Perlu Anda Lakukan:
```
1. ✅ Rakit hardware sesuai wiring diagram
2. ✅ Install library di Arduino IDE
3. ✅ Edit WiFi & Firebase credentials
4. ✅ Upload code ke ESP
5. ✅ Kalibrasi sensor
6. ✅ Test dengan sampel real
7. ✅ Monitor di dashboard
```

---

**Good Luck! 🚀**

Jika ada pertanyaan atau masalah, cek **Troubleshooting** section atau dokumentasi lainnya.

**Status**: ✅ **READY FOR IoT IMPLEMENTATION**

🥛 **Happy Making!** 🐐