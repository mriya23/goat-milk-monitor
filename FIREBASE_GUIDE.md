# 🔥 Firebase Setup & Usage Guide

Panduan lengkap untuk menggunakan Firebase Realtime Database pada Goat Milk Monitor.

---

## 📋 Table of Contents

1. [Firebase Configuration](#firebase-configuration)
2. [Data Structure](#data-structure)
3. [Adding Test Data](#adding-test-data)
4. [Real-time Updates](#real-time-updates)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Firebase Configuration

### Current Configuration

Firebase sudah dikonfigurasi dan siap digunakan:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAKTn5zBzy0w5iaiedXq150vK5eESW4dJc",
  authDomain: "goat-milk-monitor.firebaseapp.com",
  databaseURL: "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goat-milk-monitor",
  storageBucket: "goat-milk-monitor.appspot.com",
  messagingSenderId: "782450512071",
  appId: "1:782450512071:web:02f757a206ac3cc3d6aee2",
  measurementId: "G-VYWBXL2GY0"
};
```

**File Location:** `src/lib/firebase.ts`

### Security Note

⚠️ Firebase API keys are safe to expose in client-side code. However, make sure to configure Firebase Security Rules properly to protect your data.

---

## 📊 Data Structure

### Firebase Realtime Database Structure

```json
{
  "readings": {
    "-Nabc123xyz": {
      "color": "Putih Kekuningan",
      "mq135": 65,
      "pH": 6.5,
      "rgb": "255,245,238",
      "timestamp": 1730000000000
    },
    "-Nabc124xyz": {
      "color": "Putih",
      "mq135": 55,
      "pH": 6.6,
      "rgb": "255,255,255",
      "timestamp": 1730003600000
    }
  }
}
```

### Data Fields Explanation

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `color` | string | Warna visual susu | "Putih Kekuningan", "Putih", "Kekuningan" |
| `mq135` | number | Nilai sensor MQ135 (kualitas udara/gas) | 65 (lower is better) |
| `pH` | number | Tingkat keasaman susu | 6.5 (ideal: 6.4-6.7) |
| `rgb` | string | Nilai RGB warna (comma-separated) | "255,245,238" |
| `timestamp` | number | Unix timestamp dalam milliseconds | 1730000000000 |

### Quality Assessment

Sistem secara otomatis menilai kualitas berdasarkan pH dan MQ135:

#### pH Level
- **Baik**: 6.4 - 6.7 (ideal untuk susu kambing)
- **Sedang**: 6.2 - 6.9
- **Buruk**: < 6.2 atau > 6.9

#### MQ135 (Air Quality)
- **Baik**: < 70 (udara bersih)
- **Sedang**: 70 - 100
- **Buruk**: > 100

#### Overall Quality
- **Baik**: pH dalam range ideal DAN MQ135 < 70
- **Sedang**: pH 6.2-6.9 DAN MQ135 < 100
- **Buruk**: Di luar range di atas

---

## 📝 Adding Test Data

### Via Firebase Console

1. **Buka Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Pilih project: `goat-milk-monitor`

2. **Navigate to Realtime Database**
   - Sidebar → Build → Realtime Database
   - Klik tab "Data"

3. **Add Data Manually**
   - Klik `readings` node (atau buat jika belum ada)
   - Klik "+" button
   - Add child dengan struktur di atas

### Sample Data (Copy-Paste Ready)

```json
{
  "readings": {
    "-Reading001": {
      "color": "Putih",
      "mq135": 45,
      "pH": 6.5,
      "rgb": "255,255,255",
      "timestamp": 1730000000000
    },
    "-Reading002": {
      "color": "Putih Kekuningan",
      "mq135": 65,
      "pH": 6.6,
      "rgb": "255,245,238",
      "timestamp": 1730003600000
    },
    "-Reading003": {
      "color": "Putih",
      "mq135": 55,
      "pH": 6.4,
      "rgb": "255,250,245",
      "timestamp": 1730007200000
    },
    "-Reading004": {
      "color": "Kekuningan",
      "mq135": 75,
      "pH": 6.7,
      "rgb": "255,240,220",
      "timestamp": 1730010800000
    },
    "-Reading005": {
      "color": "Putih",
      "mq135": 50,
      "pH": 6.5,
      "rgb": "255,255,250",
      "timestamp": 1730014400000
    },
    "-Reading006": {
      "color": "Putih Kekuningan",
      "mq135": 60,
      "pH": 6.6,
      "rgb": "255,248,240",
      "timestamp": 1730018000000
    },
    "-Reading007": {
      "color": "Putih",
      "mq135": 48,
      "pH": 6.5,
      "rgb": "255,255,255",
      "timestamp": 1730021600000
    },
    "-Reading008": {
      "color": "Kekuningan",
      "mq135": 85,
      "pH": 6.8,
      "rgb": "255,235,210",
      "timestamp": 1730025200000
    },
    "-Reading009": {
      "color": "Putih",
      "mq135": 52,
      "pH": 6.4,
      "rgb": "255,252,248",
      "timestamp": 1730028800000
    },
    "-Reading010": {
      "color": "Putih Kekuningan",
      "mq135": 58,
      "pH": 6.6,
      "rgb": "255,245,235",
      "timestamp": 1730032400000
    }
  }
}
```

### Generate Current Timestamp (JavaScript)

```javascript
// In browser console or Node.js
Date.now()  // Returns current timestamp in milliseconds

// Example: December 25, 2024, 10:00 AM
new Date('2024-12-25T10:00:00').getTime()  // 1735117200000
```

### Via REST API

You can also add data via Firebase REST API:

```bash
curl -X POST \
  'https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json' \
  -H 'Content-Type: application/json' \
  -d '{
    "color": "Putih",
    "mq135": 55,
    "pH": 6.5,
    "rgb": "255,255,255",
    "timestamp": 1730000000000
  }'
```

---

## 🔄 Real-time Updates

### How It Works

Dashboard menggunakan Firebase Realtime Database listeners untuk update otomatis:

1. **Initial Load**: Data di-fetch saat halaman pertama kali dibuka
2. **Real-time Sync**: Listener aktif mendengarkan perubahan di Firebase
3. **Auto Update**: UI ter-update otomatis saat ada data baru
4. **No Refresh Needed**: Tidak perlu reload halaman

### Features

- ✅ **Live Stats Updates**: Dashboard statistics update secara real-time
- ✅ **Chart Auto-Refresh**: Grafik ter-update otomatis dengan data terbaru
- ✅ **Latest Reading Alert**: Notifikasi muncul saat ada data baru
- ✅ **Connection Status**: Indicator menunjukkan status koneksi Firebase

---

## 📖 API Reference

### Fetch Functions

#### `fetchReadings()`
Fetch semua readings dari Firebase.

```typescript
import { fetchReadings } from '../lib/fetchData';

const readings = await fetchReadings();
// Returns: ProcessedReading[]
```

#### `fetchLatestReading()`
Fetch reading terakhir saja.

```typescript
import { fetchLatestReading } from '../lib/fetchData';

const latest = await fetchLatestReading();
// Returns: ProcessedReading | null
```

#### `fetchDashboardStats()`
Fetch statistik dashboard (calculated).

```typescript
import { fetchDashboardStats } from '../lib/fetchData';

const stats = await fetchDashboardStats();
// Returns: DashboardStats
```

#### `fetchPHChart(limit?)`
Fetch data pH untuk chart (default: 10 terakhir).

```typescript
import { fetchPHChart } from '../lib/fetchData';

const data = await fetchPHChart(15);
// Returns: { labels: string[], data: number[] }
```

#### `fetchMQ135Chart(limit?)`
Fetch data MQ135 untuk chart.

```typescript
import { fetchMQ135Chart } from '../lib/fetchData';

const data = await fetchMQ135Chart(10);
// Returns: { labels: string[], data: number[] }
```

#### `fetchQualityDistribution()`
Fetch distribusi kualitas untuk pie/doughnut chart.

```typescript
import { fetchQualityDistribution } from '../lib/fetchData';

const dist = await fetchQualityDistribution();
// Returns: { labels: string[], data: number[] }
```

### Real-time Listeners

#### `listenToReadings(callback)`
Listen ke semua readings real-time.

```typescript
import { listenToReadings } from '../lib/fetchData';

const unsubscribe = listenToReadings((readings) => {
  console.log('Readings updated:', readings);
});

// Cleanup
unsubscribe();
```

#### `listenToDashboardStats(callback)`
Listen ke dashboard stats real-time.

```typescript
import { listenToDashboardStats } from '../lib/fetchData';

const unsubscribe = listenToDashboardStats((stats) => {
  console.log('Stats updated:', stats);
});

// Cleanup
unsubscribe();
```

#### `listenToLatestReading(callback)`
Listen hanya ke reading terakhir.

```typescript
import { listenToLatestReading } from '../lib/fetchData';

const unsubscribe = listenToLatestReading((reading) => {
  if (reading) {
    console.log('New reading:', reading);
  }
});

// Cleanup
unsubscribe();
```

---

## 🔒 Firebase Security Rules

### Recommended Security Rules

**Important**: Set up proper security rules untuk melindungi database Anda.

```json
{
  "rules": {
    "readings": {
      ".read": true,
      ".write": "auth != null",
      "$readingId": {
        ".validate": "newData.hasChildren(['color', 'mq135', 'pH', 'rgb', 'timestamp'])"
      }
    }
  }
}
```

### Rules Explanation

- **Read**: Public (siapa saja bisa membaca)
- **Write**: Authenticated users only
- **Validation**: Semua field required harus ada

### For Development (Less Secure)

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

⚠️ **Warning**: Jangan gunakan rules ini di production!

---

## 🐛 Troubleshooting

### Problem: Data tidak muncul di dashboard

**Solutions:**

1. **Check Firebase Console**
   - Pastikan ada data di `readings` node
   - Verifikasi struktur data sesuai format

2. **Check Browser Console**
   - Buka DevTools (F12)
   - Look for Firebase errors
   - Check network tab untuk request ke Firebase

3. **Check Security Rules**
   - Pastikan read permission set ke `true`
   - Test rules di Firebase Console

4. **Clear Cache & Reload**
   ```bash
   # Stop dev server
   Ctrl+C
   
   # Clear Astro cache
   rm -rf .astro dist
   
   # Restart
   npm run dev
   ```

### Problem: "Permission Denied" Error

**Solution:**
Update Firebase Security Rules untuk allow read access:

```json
{
  "rules": {
    "readings": {
      ".read": true
    }
  }
}
```

### Problem: Charts tidak update real-time

**Checks:**

1. Pastikan listener aktif (check console logs)
2. Verifikasi internet connection
3. Check Firebase quota (free tier limits)
4. Restart browser/clear cache

### Problem: Timestamp tidak benar

**Solution:**
Pastikan timestamp dalam **milliseconds**, bukan seconds:

```javascript
// ✅ Correct (milliseconds)
timestamp: Date.now()  // 1730000000000

// ❌ Wrong (seconds)
timestamp: Math.floor(Date.now() / 1000)  // 1730000000
```

### Problem: Build error "Module not found"

**Solution:**
```bash
# Reinstall Firebase
npm uninstall firebase
npm install firebase --legacy-peer-deps

# Rebuild
npm run build
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│   ESP32/IoT     │
│   Device        │
│  (Milk Sensor)  │
└────────┬────────┘
         │
         │ HTTP POST/PUT
         │
         ▼
┌─────────────────────────────┐
│   Firebase Realtime DB      │
│   (/readings)               │
│                             │
│   - Stores sensor data      │
│   - Triggers real-time      │
│     updates                 │
└────────┬────────────────────┘
         │
         │ Real-time Listeners
         │
         ▼
┌─────────────────────────────┐
│   Goat Milk Monitor         │
│   (Astro Web App)           │
│                             │
│   - Displays data           │
│   - Shows charts            │
│   - Calculates stats        │
└─────────────────────────────┘
```

---

## 🎯 Best Practices

### 1. Data Management

- **Limit Data**: Delete old readings periodically
- **Indexing**: Use Firebase indexes for large datasets
- **Pagination**: Limit queries dengan `.limitToLast(n)`

### 2. Performance

- **Lazy Loading**: Load charts data on demand
- **Debouncing**: Prevent too many updates
- **Caching**: Cache frequently accessed data

### 3. Security

- **Authentication**: Implement user auth untuk write operations
- **Validation**: Validate data before saving
- **Rate Limiting**: Prevent abuse dengan Cloud Functions

### 4. Monitoring

- **Firebase Console**: Monitor usage regularly
- **Error Logging**: Log errors untuk debugging
- **Analytics**: Track user interactions

---

## 📱 Integration with IoT Device

### ESP32/Arduino Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* firebaseUrl = "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json";

void sendToFirebase(float pH, int mq135, String color, String rgb) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(firebaseUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON
    StaticJsonDocument<256> doc;
    doc["pH"] = pH;
    doc["mq135"] = mq135;
    doc["color"] = color;
    doc["rgb"] = rgb;
    doc["timestamp"] = millis();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully!");
    } else {
      Serial.println("Error sending data");
    }
    
    http.end();
  }
}

void loop() {
  // Read sensors
  float pH = readPH();
  int mq135 = readMQ135();
  String color = detectColor();
  String rgb = getRGBValues();
  
  // Send to Firebase
  sendToFirebase(pH, mq135, color, rgb);
  
  delay(60000); // Send every 1 minute
}
```

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase REST API](https://firebase.google.com/docs/reference/rest/database)

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Check dokumentasi ini terlebih dahulu
2. Look for errors di browser console
3. Check Firebase Console untuk data dan logs
4. Review code di `src/lib/firebase.ts` dan `src/lib/fetchData.ts`

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Firebase SDK:** v10.x

Made with ❤️ for Goat Milk Quality Monitoring