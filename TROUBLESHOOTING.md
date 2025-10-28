# 🔧 Troubleshooting Guide - Goat Milk Monitor

Panduan cepat untuk mengatasi masalah yang mungkin terjadi.

---

## ⚠️ Data Tidak Muncul di Dashboard

### Gejala:
- Stats menunjukkan 0
- Chart kosong
- "Belum ada data" muncul di semua chart

### Solusi:

#### 1. Periksa Data di Firebase Console

```
1. Buka: https://console.firebase.google.com/
2. Pilih project: goat-milk-monitor
3. Sidebar → Realtime Database
4. Check apakah ada data di node "readings"
```

**Jika TIDAK ada data:**
- Tambahkan data manual via Firebase Console
- Atau kirim data dari IoT device

**Jika ADA data:**
- Lanjut ke langkah 2

#### 2. Periksa Struktur Data

Data harus mengikuti struktur ini:

```json
{
  "readings": {
    "-Nabc123xyz": {
      "color": "Putih Kekuningan",
      "mq135": 65,
      "pH": 6.5,
      "rgb": "255,245,238",
      "timestamp": 1730000000000
    }
  }
}
```

**Field yang WAJIB:**
- `color` (string)
- `mq135` (number)
- `pH` (number)
- `rgb` (string dengan format "r,g,b")
- `timestamp` (number dalam milliseconds)

#### 3. Gunakan Debug Page

```
1. Jalankan: npm run dev
2. Buka: http://localhost:4321/debug
3. Lihat console logs dan Firebase data
```

Debug page akan menunjukkan:
- ✅ Connection status
- 📡 Raw Firebase data
- 🔄 Processed readings
- 📊 Calculated stats

#### 4. Check Browser Console

```
1. Tekan F12 (Developer Tools)
2. Tab Console
3. Cari error messages berwarna merah
```

**Common errors:**
- `Permission denied` → Firebase Security Rules issue
- `Failed to fetch` → Network/Firebase connection issue
- `undefined` → Data structure mismatch

---

## 🔒 Permission Denied Error

### Gejala:
```
Error: Permission denied
```

### Solusi:

**Update Firebase Security Rules:**

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

**Cara update:**
1. Firebase Console → Realtime Database
2. Tab "Rules"
3. Paste rules di atas
4. Click "Publish"

⚠️ **Note:** Rules ini untuk development. Di production, gunakan rules yang lebih ketat.

---

## 📊 Chart Tidak Muncul

### Gejala:
- Stats muncul
- Tapi chart kosong atau tidak render

### Solusi:

#### 1. Check Data Array Length

Chart membutuhkan minimal 1 data point:
- pH Chart: Minimal 1 reading
- MQ135 Chart: Minimal 1 reading
- Quality Distribution: Minimal 1 reading dengan kualitas tertentu

#### 2. Periksa Console Logs

```javascript
// Should see logs like:
"Fetched X readings from Firebase"
"pH Chart: Y labels, Y data points"
"MQ135 Chart: Z labels, Z data points"
```

#### 3. Refresh Page

```
Ctrl + Shift + R (hard refresh)
atau
Ctrl + F5
```

---

## ⏰ Timestamp Issues

### Gejala:
- Data muncul tapi urutan tidak benar
- "Kesegaran" tidak akurat

### Solusi:

Timestamp harus dalam **milliseconds**, bukan seconds:

```javascript
// ✅ BENAR
timestamp: Date.now()  
// Contoh: 1730000000000 (13 digits)

// ❌ SALAH
timestamp: Math.floor(Date.now() / 1000)
// Contoh: 1730000000 (10 digits)
```

**Cara fix:**
1. Kalikan timestamp dengan 1000 jika dalam seconds
2. Atau gunakan `Date.now()` langsung

---

## 🔄 Real-time Updates Tidak Bekerja

### Gejala:
- Data awal muncul
- Tapi tidak update saat ada data baru

### Solusi:

#### 1. Check Listener Status

```javascript
// Should see in console:
"🔄 Real-time stats update: {...}"
"🔔 Real-time update: X readings"
```

#### 2. Restart Browser

Kadang WebSocket connection perlu di-restart:
1. Close semua tab browser
2. Buka lagi
3. Navigate ke dashboard

#### 3. Check Firebase Quota

Free plan Firebase punya limit:
- 100 concurrent connections
- 1GB bandwidth/month

Check di Firebase Console → Usage

---

## 🌐 CORS / Network Errors

### Gejala:
```
CORS policy: No 'Access-Control-Allow-Origin'
Failed to fetch
```

### Solusi:

#### 1. Firebase Configuration

Pastikan Firebase config benar:
```javascript
databaseURL: "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app"
```

#### 2. Internet Connection

- Check koneksi internet
- Disable VPN jika ada
- Try different network

#### 3. Firewall/Antivirus

- Whitelist Firebase domains
- Temporarily disable untuk testing

---

## 📱 Mobile / Responsive Issues

### Gejala:
- Layout broken di mobile
- Chart terpotong

### Solusi:

#### 1. Viewport Meta Tag

Pastikan ada di Layout:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

#### 2. Chart Container Width

Chart sudah responsive by default, tapi pastikan parent container tidak fixed width.

---

## 🐛 Build Errors

### Error: Module not found

```bash
npm install
npm run build
```

### Error: Firebase not installed

```bash
npm install firebase --legacy-peer-deps
```

### Error: Cache issues

```bash
# Clear cache
rm -rf .astro dist node_modules
npm install
npm run build
```

---

## 💾 Data Sample untuk Testing

### Quick Test Data

Copy-paste ke Firebase Console (`readings` node):

```json
{
  "-Test001": {
    "color": "Putih",
    "mq135": 55,
    "pH": 6.5,
    "rgb": "255,255,255",
    "timestamp": 1730000000000
  },
  "-Test002": {
    "color": "Putih Kekuningan",
    "mq135": 65,
    "pH": 6.6,
    "rgb": "255,245,238",
    "timestamp": 1730003600000
  },
  "-Test003": {
    "color": "Kekuningan",
    "mq135": 85,
    "pH": 6.8,
    "rgb": "255,235,210",
    "timestamp": 1730007200000
  }
}
```

**Generate current timestamp:**
```javascript
// In browser console:
Date.now()
```

---

## 🔍 Debug Checklist

Sebelum report issue, check:

- [ ] Data exists di Firebase Console
- [ ] Data structure sesuai format
- [ ] Timestamp dalam milliseconds (13 digits)
- [ ] Firebase Security Rules allow read
- [ ] Browser console tidak ada error
- [ ] Internet connection working
- [ ] Debug page menunjukkan data
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Cleared cache dan rebuild

---

## 📞 Getting Help

### 1. Check Documentation
- `README.md` - Overview
- `FIREBASE_GUIDE.md` - Firebase setup
- `QUICKSTART.md` - Quick start

### 2. Debug Page
```
http://localhost:4321/debug
```

### 3. Browser Console
- F12 → Console tab
- Screenshot errors

### 4. Firebase Console
- Check data structure
- Check security rules
- Check usage/quota

---

## 🎯 Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| No data showing | Check Firebase Console, add test data |
| Permission denied | Update Firebase Security Rules |
| Charts empty | Need minimum 1 reading |
| Wrong timestamp | Use milliseconds (Date.now()) |
| Real-time not working | Restart browser |
| Build errors | `npm install && npm run build` |
| CORS errors | Check Firebase config & internet |

---

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Clear cache
rm -rf .astro dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Expected Console Logs (Normal Operation)

```
✅ Firebase connection established
📡 Fetching raw Firebase data...
✅ Raw data fetched: 3 readings
🔄 Processing readings...
✅ Processed 3 readings
📊 Calculating dashboard stats...
✅ Stats calculated: 3 total readings
   - Good: 2, Medium: 1, Poor: 0
🔄 Real-time stats update: {...}
```

---

## ⚠️ Known Limitations

1. **SSR (Server-Side Rendering)**
   - Firebase data tidak available saat build
   - Data di-fetch di client-side saat runtime
   - Normal melihat "0 readings" saat build

2. **Free Tier Limits**
   - 100 concurrent connections
   - 1GB bandwidth/month
   - 10GB storage

3. **Browser Compatibility**
   - Modern browsers only (Chrome, Firefox, Safari, Edge)
   - Requires JavaScript enabled
   - Requires internet connection

---

**Last Updated:** 2024
**Version:** 1.0.0

Need more help? Check `FIREBASE_GUIDE.md` for detailed Firebase documentation.