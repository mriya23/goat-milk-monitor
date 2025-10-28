# 🔌 Arduino IoT Code - Goat Milk Monitor

## 📁 File Structure

```
arduino/
├── esp8266_milk_monitor.ino    # Code untuk ESP8266 NodeMCU
├── esp32_milk_monitor.ino      # Code untuk ESP32 DevKit
├── IOT_SETUP_GUIDE.md          # Panduan lengkap setup IoT
└── README.md                   # File ini
```

---

## 🎯 Quick Start

### 1️⃣ Pilih Board Anda

| Board | File Code | Recommended |
|-------|-----------|-------------|
| ESP8266 NodeMCU | `esp8266_milk_monitor.ino` | ✅ Lebih murah |
| ESP32 DevKit | `esp32_milk_monitor.ino` | ✅ Multiple ADC |

### 2️⃣ Hardware Yang Dibutuhkan

- ✅ ESP8266/ESP32 (pilih salah satu)
- ✅ MQ135 Gas Sensor
- ✅ pH Sensor Module (pH-4502C)
- ✅ TCS3200 Color Sensor
- ✅ Breadboard & Jumper Wires
- ✅ USB Cable & Power Supply

### 3️⃣ Instalasi Library

Buka Arduino IDE → Tools → Manage Libraries, install:

**Untuk ESP8266:**
- `FirebaseESP8266` by Mobizt
- `ArduinoJson` by Benoit Blanchon

**Untuk ESP32:**
- `Firebase Arduino Client Library for ESP8266 and ESP32` by Mobizt
- `ArduinoJson` by Benoit Blanchon

### 4️⃣ Edit Konfigurasi

```cpp
// WiFi Credentials
const char* WIFI_SSID = "YOUR_WIFI_SSID";          // ← Ganti ini
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";  // ← Ganti ini

// Firebase Configuration
#define FIREBASE_AUTH "YOUR_FIREBASE_SECRET"        // ← Ganti ini
```

### 5️⃣ Upload & Test

```
1. Connect ESP to USB
2. Select Board & Port in Arduino IDE
3. Verify code (Ctrl+R)
4. Upload (Ctrl+U)
5. Open Serial Monitor (115200 baud)
6. Watch for "✅ System Ready!"
```

---

## 🔌 Wiring Quick Reference

### ESP8266 NodeMCU

| Sensor | Pin | ESP8266 |
|--------|-----|---------|
| MQ135 | VCC | 3V3 |
| MQ135 | GND | GND |
| MQ135 | A0 | A0 |
| pH Sensor | VCC | 3V3 |
| pH Sensor | GND | GND |
| pH Sensor | OUT | A0* |
| TCS3200 | VCC | 3V3 |
| TCS3200 | GND | GND |
| TCS3200 | S0 | D1 |
| TCS3200 | S1 | D2 |
| TCS3200 | S2 | D3 |
| TCS3200 | S3 | D4 |
| TCS3200 | OUT | D5 |

**⚠️ NOTE**: ESP8266 hanya punya 1 ADC. Gunakan multiplexer atau baca bergantian.

### ESP32 DevKit

| Sensor | Pin | ESP32 |
|--------|-----|-------|
| MQ135 | VCC | 3V3 |
| MQ135 | GND | GND |
| MQ135 | A0 | GPIO34 |
| pH Sensor | VCC | 3V3 |
| pH Sensor | GND | GND |
| pH Sensor | OUT | GPIO35 |
| TCS3200 | VCC | 3V3 |
| TCS3200 | GND | GND |
| TCS3200 | S0 | GPIO19 |
| TCS3200 | S1 | GPIO18 |
| TCS3200 | S2 | GPIO5 |
| TCS3200 | S3 | GPIO17 |
| TCS3200 | OUT | GPIO16 |

**✅ ADVANTAGE**: ESP32 punya multiple ADC pins!

---

## 📊 Data Format

Data yang dikirim ke Firebase:

```json
{
  "readings": {
    "reading_1234567890": {
      "pH": 6.6,
      "mq135": 65,
      "rgb": "250,252,250",
      "color": "Putih",
      "timestamp": 1234567890
    }
  }
}
```

**Compatible dengan Dashboard**: ✅ Tidak perlu ubah kode dashboard!

---

## 🎛️ Sensor Calibration

### MQ135 (Gas Sensor)
```
1. Preheat 24-48 jam (minimal 2 jam)
2. Test di udara bersih → Value < 70
3. Test dengan ammonia → Value > 100
4. Adjust baseline di code jika perlu
```

### pH Sensor
```
1. Gunakan buffer solution pH 4.0, 7.0
2. Celup sensor, tunggu stabil
3. Adjust offset di code:
   float phCalibrationOffset = 0.0;
```

### TCS3200 (Color Sensor)
```
1. Kalibrasi dengan white reference card
2. Pastikan lighting konsisten
3. Jarak sensor ke objek: 2-3cm
4. Adjust map() values jika perlu
```

---

## 🔍 Serial Monitor Output

Expected output saat running:

```
====================================
  GOAT MILK MONITOR - IoT System
====================================

🌐 Connecting to WiFi: YourWiFi
.....
✅ WiFi Connected!
📍 IP Address: 192.168.1.100
🔥 Setting up Firebase...
✅ Firebase Configured!
🔧 Setting up sensors...
✅ Sensors Ready!
✅ System Ready!

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
------------------------------------
```

---

## ⚙️ Configuration Options

### Reading Interval
```cpp
#define READING_INTERVAL 10000    // Default: 10 detik

// Options:
// 5000   = 5 detik (testing)
// 10000  = 10 detik (default)
// 30000  = 30 detik (normal)
// 60000  = 1 menit (production)
```

### Calibration Samples
```cpp
#define CALIBRATION_SAMPLES 10    // Default: 10 samples

// Lebih banyak = lebih stabil tapi lebih lambat
// Recommended: 10-20
```

### LED Indicator (ESP32 only)
```cpp
#define LED_PIN 2                 // Built-in LED

// LED akan blink:
// - 3x saat startup success
// - 1x saat data sent success
// - 5x saat error
```

---

## 🐛 Troubleshooting

### WiFi Not Connecting
```
❌ WiFi Connection Failed!

Solutions:
✅ Check SSID & password (case-sensitive)
✅ Use 2.4GHz WiFi (not 5GHz)
✅ ESP near router
✅ Try phone hotspot
```

### Firebase Upload Failed
```
❌ Failed to send data

Solutions:
✅ Check FIREBASE_AUTH token
✅ Check Firebase Rules (allow read/write)
✅ Check internet connection
✅ Check Firebase URL format
```

### Sensor Reading = 0
```
│ pH Level    : 0.00 ❌

Solutions:
✅ Check wiring (VCC, GND, Signal)
✅ Check pin configuration in code
✅ MQ135: Ensure preheated
✅ pH: Ensure sensor in liquid
✅ TCS3200: Check lighting
```

### Upload Error
```
error: espcomm_upload_mem failed

Solutions:
✅ Select correct COM port
✅ Install CH340 driver
✅ Close Serial Monitor before upload
✅ Try different USB cable
```

---

## 📚 Full Documentation

Untuk panduan lengkap, baca:

📖 **IOT_SETUP_GUIDE.md** - Complete setup guide dengan:
- Detailed wiring diagram
- Step-by-step installation
- Sensor calibration procedures
- Troubleshooting lengkap
- Testing checklist

---

## 🔗 Integration

### Dengan Dashboard

1. ✅ Upload code Arduino
2. ✅ Data otomatis masuk Firebase
3. ✅ Dashboard otomatis baca dari Firebase
4. ✅ Decision tree classify data sensor
5. ✅ Display di web interface

**NO CODE CHANGES NEEDED** di dashboard! 🎉

### Data Flow

```
Sensor → ESP → Firebase → Dashboard → Decision Tree → Display
  │       │       │          │             │            │
  pH    WiFi    Cloud      Fetch        Classify     Quality
 MQ135                     Data         (3 sensors)   Cards
TCS3200                                              & Charts
```

---

## 🎯 Testing Guide

### Test 1: Hardware Check
```
[ ] ESP menyala (LED power on)
[ ] MQ135 hangat (heating element on)
[ ] pH sensor tercelup
[ ] TCS3200 LED on (jika ada)
[ ] Semua kabel terpasang kencang
```

### Test 2: Software Check
```
[ ] Code upload success
[ ] Serial Monitor show output
[ ] WiFi connected
[ ] Firebase configured
[ ] Sensor readings muncul
[ ] Data terkirim ke Firebase
```

### Test 3: Sensor Check
```
[ ] MQ135: Clean air < 70
[ ] pH: Buffer 7.0 ≈ 7.0
[ ] TCS3200: White ≈ RGB(250,250,250)
[ ] Readings stabil
```

### Test 4: Integration Check
```
[ ] Dashboard menerima data
[ ] Chart update otomatis
[ ] Quality classification correct
[ ] Timestamp display benar
```

---

## 📝 Notes

### ESP8266 vs ESP32

| Feature | ESP8266 | ESP32 |
|---------|---------|-------|
| **Price** | ✅ Cheaper | More expensive |
| **ADC Pins** | ❌ 1 pin only | ✅ Multiple pins |
| **Processing** | Good | ✅ Better |
| **WiFi** | 2.4GHz | 2.4GHz + BT |
| **Memory** | Less | ✅ More |
| **Power** | Lower | Higher |

**Recommendation**: 
- Budget project → ESP8266
- Production/Multiple sensors → ESP32

### Sensor Notes

**MQ135**:
- Preheat WAJIB (minimal 2 jam)
- Value 0-200 (higher = worse)
- Clean air baseline: 30-50
- Spoiled milk: 100+

**pH Sensor**:
- Must be in liquid for reading
- Calibration recommended
- Fresh milk: pH 6.5-6.8
- Spoiled milk: pH < 6.0

**TCS3200**:
- Sensitive to lighting
- Consistent distance needed
- White calibration important
- Fresh milk: RGB avg 245+

---

## ✅ Checklist Sebelum Testing

```
Hardware:
[ ] ESP8266/ESP32 ready
[ ] All sensors connected
[ ] Power supply adequate
[ ] USB cable good quality

Software:
[ ] Arduino IDE installed
[ ] Libraries installed
[ ] Board package installed
[ ] Code edited (WiFi, Firebase)

Configuration:
[ ] WiFi credentials correct
[ ] Firebase auth token correct
[ ] Pin configuration match wiring
[ ] Calibration values adjusted

Testing:
[ ] Serial Monitor working
[ ] WiFi connecting
[ ] Firebase uploading
[ ] Sensors reading correctly
```

---

## 🆘 Need Help?

1. **Read IOT_SETUP_GUIDE.md** - Lengkap & detail
2. **Check Serial Monitor** - Error messages helpful
3. **Test sensors individually** - Isolate problems
4. **Check wiring** - Most common issue
5. **Google error messages** - Community helpful

---

## 📞 Resources

### Documentation
- **IOT_SETUP_GUIDE.md** - Full setup guide
- **DECISION_TREE_SIMPLIFIED.md** - Decision tree logic
- **SENSOR_MAPPING_CARD.md** - Sensor reference

### Links
- ESP8266: https://arduino-esp8266.readthedocs.io
- ESP32: https://docs.espressif.com/projects/arduino-esp32
- Firebase: https://firebase.google.com/docs/database

### Community
- Arduino Forum: https://forum.arduino.cc
- ESP8266: https://www.esp8266.com
- Reddit: r/arduino, r/esp8266, r/esp32

---

## 🎉 Success Indicators

You know it's working when:

✅ **Serial Monitor shows**:
```
✅ WiFi Connected!
✅ Firebase Configured!
✅ Data sent successfully!
```

✅ **Firebase Console shows**:
- New data in `/readings/` node
- Correct format (pH, mq135, rgb, color)

✅ **Dashboard shows**:
- Latest reading updated
- Quality classified (Baik/Sedang/Buruk)
- Charts displaying sensor data

---

**Version**: 1.0  
**Last Updated**: 2025  
**Status**: ✅ **PRODUCTION READY**

🥛 **Happy IoT-ing!** 🐐