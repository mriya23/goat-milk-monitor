# 🔧 Troubleshooting & Common Errors

## 📋 Daftar Error Umum

---

## ❌ Error 1: "Cannot 'set' properties of null (setting 'valueAsNumber')"

### 🔍 Gejala
```
Error handling response: TypeError: Cannot 'set' properties of null (setting 'valueAsNumber')
at chrome-extension://[extension-id]/js/popup.js:20:57
```

### 📌 Penyebab
Error ini **BUKAN** dari aplikasi Goat Milk Monitor, tetapi dari **Browser Extension** yang terinstall di Chrome/Edge Anda. Extension tersebut mencoba mengakses elemen DOM yang tidak ada di halaman aplikasi.

### ✅ Solusi

#### Opsi 1: Abaikan Error (Recommended)
Error ini **tidak mempengaruhi** aplikasi Anda. Data tetap terload dengan baik:
- ✅ Firebase connection: OK
- ✅ Data processing: OK
- ✅ Charts rendering: OK
- ✅ Decision tree classifier: OK

**Aplikasi berjalan normal meskipun error muncul.**

#### Opsi 2: Disable Extension (Untuk Development)
1. Buka `chrome://extensions/` (atau `edge://extensions/`)
2. Cari extension yang menyebabkan error
3. Disable sementara saat development
4. Refresh halaman aplikasi

#### Opsi 3: Error Handler (Sudah Ditambahkan)
Kode sudah dilengkapi dengan global error handler yang mengabaikan error dari extension:

```javascript
window.addEventListener("error", (event) => {
    if (event.filename && event.filename.includes("chrome-extension://")) {
        console.warn("Ignored error from browser extension:", event.message);
        event.preventDefault();
        return;
    }
});
```

---

## ❌ Error 2: "Failed to fetch" / "NetworkError"

### 🔍 Gejala
```
Error fetching data: Error: Failed to fetch
Status: Error: Failed to fetch
```

### 📌 Penyebab
- Firebase URL salah atau tidak accessible
- Network connection terputus
- CORS policy blocking request
- Firebase Realtime Database rules restrict access

### ✅ Solusi

#### 1. Cek Firebase URL
Pastikan URL di `index.astro` benar:
```javascript
const FIREBASE_URL = "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app";
```

#### 2. Cek Firebase Rules
Buka Firebase Console → Realtime Database → Rules:
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

#### 3. Cek Network Connection
```bash
# Test connectivity
ping asia-southeast1.firebasedatabase.app

# Test with curl
curl https://your-project.firebasedatabase.app/readings.json
```

#### 4. Cek Browser Console
Lihat detail error di Network tab (F12 → Network)

---

## ❌ Error 3: "No data in Firebase"

### 🔍 Gejala
```
Status: No data in Firebase
Processed readings: Array(0)
```

### 📌 Penyebab
- Firebase database kosong (belum ada data readings)
- Data ada tapi path salah
- Data structure tidak sesuai

### ✅ Solusi

#### 1. Cek Data di Firebase Console
Buka Firebase Console → Realtime Database → Data tab
Pastikan ada node `readings` dengan data seperti:
```json
{
  "readings": {
    "-Nabc123xyz01": {
      "pH": 6.6,
      "mq135": 65,
      "rgb": "250,252,250",
      "color": "Putih",
      "timestamp": 1234567890000
    }
  }
}
```

#### 2. Tambah Sample Data
Jalankan script untuk menambah data:
```bash
node add-sample-data.js
```

Atau manual di Firebase Console:
1. Klik tanda "+"
2. Name: `readings`
3. Tambah child dengan data di atas

#### 3. Cek Path di Code
Pastikan fetch menggunakan path yang benar:
```javascript
await fetch(`${FIREBASE_URL}/readings.json`);
```

---

## ❌ Error 4: Sensor Reading Invalid / NaN

### 🔍 Gejala
```
pH: NaN
MQ135: NaN
RGB: undefined
Quality: Buruk
```

### 📌 Penyebab
- Sensor tidak terhubung dengan baik
- Data dari Arduino/ESP tidak valid
- Parsing error di code

### ✅ Solusi

#### 1. Cek Hardware Connection
- ✅ MQ135: VCC, GND, A0 terhubung?
- ✅ pH Sensor: Power, GND, Signal terhubung?
- ✅ TCS3200: S0-S3, OUT terhubung?

#### 2. Cek Serial Monitor Arduino
```arduino
// Pastikan format data benar:
pH: 6.60, MQ135: 65, RGB: 250,252,250
```

#### 3. Cek Data di Firebase
Pastikan data tersimpan dengan benar (tidak null/undefined):
```json
{
  "pH": 6.6,        // HARUS number, bukan string
  "mq135": 65,      // HARUS number
  "rgb": "250,252,250"  // HARUS string format "R,G,B"
}
```

#### 4. Kalibrasi Sensor
- **MQ135**: Preheat 24-48 jam
- **pH**: Gunakan buffer solution pH 4.0, 7.0, 10.0
- **TCS3200**: Gunakan white reference card

---

## ❌ Error 5: Chart Not Rendering

### 🔍 Gejala
Chart area kosong atau tidak muncul

### 📌 Penyebab
- Chart.js tidak terload
- Canvas element tidak ada
- Data tidak sufficient untuk chart

### ✅ Solusi

#### 1. Cek Chart.js CDN
Pastikan script tag ada di `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

#### 2. Cek Canvas Elements
```html
<canvas id="phChart"></canvas>
<canvas id="mq135Chart"></canvas>
<canvas id="qualityChart"></canvas>
<canvas id="combinedChart"></canvas>
```

#### 3. Cek Console Errors
Buka DevTools (F12) → Console
Lihat error terkait Chart.js

#### 4. Verify Data
Minimal harus ada 1 reading untuk chart:
```javascript
console.log("Readings:", readings.length); // Harus > 0
```

---

## ❌ Error 6: Selalu Kualitas "Sedang" atau "Buruk"

### 🔍 Gejala
Tidak pernah mendapat kualitas "Baik" meskipun susu segar

### 📌 Penyebab
- Sensor belum dikalibrasi dengan baik
- Threshold terlalu ketat
- Environment kondisi tidak ideal

### ✅ Solusi

#### 1. Cek Kriteria Kualitas "Baik"
SEMUA kondisi harus terpenuhi:
```
✅ MQ135 < 70 (bau segar)
✅ pH 6.5-6.8 (optimal)
✅ pH untuk taste 6.4-6.7 (segar)
✅ RGB Average ≥ 245 (putih bersih)
```

#### 2. Debug dengan Console
```javascript
// Paste di browser console:
assessQuality(6.6, 65, "250,252,250");  // Test dengan nilai ideal
```

#### 3. Monitoring Real Values
Tambahkan log untuk lihat nilai sensor real:
```javascript
console.log("pH:", reading.pH);
console.log("MQ135:", reading.mq135);
console.log("RGB:", reading.rgb);
console.log("Quality:", reading.quality);
```

#### 4. Adjust Threshold (Jika Perlu)
Edit di `index.astro`:
```javascript
// Buat lebih toleran:
const odor = mq135 < 80 ? 1 : mq135 < 110 ? 0 : -1;  // Dari 70 ke 80
```

---

## ❌ Error 7: Auto Refresh Tidak Jalan

### 🔍 Gejala
Data tidak update otomatis setiap 30 detik

### 📌 Penyebab
- Browser tab tidak active
- Console error menghentikan script
- Network connection issue

### ✅ Solusi

#### 1. Cek Console Log
Seharusnya muncul setiap 30 detik:
```
Auto refresh... (every 30 seconds)
Loading data from Firebase...
```

#### 2. Keep Tab Active
Browser memprioritize active tabs. Keep tab tetap aktif untuk refresh.

#### 3. Manual Refresh
Klik tombol "🔄 Refresh" untuk manual update.

#### 4. Adjust Interval (Jika Perlu)
Edit di `index.astro`:
```javascript
// Ganti 30 detik jadi 10 detik:
setInterval(() => {
    loadData();
}, 10000);  // 10000ms = 10 detik
```

---

## 🛠️ Debugging Tools

### 1. Browser DevTools (F12)
- **Console**: Lihat error messages & logs
- **Network**: Monitor Firebase requests
- **Elements**: Inspect DOM elements
- **Application**: Check storage & cache

### 2. Firebase Console
- **Realtime Database**: Lihat data structure
- **Rules**: Cek access permissions
- **Usage**: Monitor reads/writes

### 3. Test Commands
Copy-paste di browser console:

```javascript
// Test Firebase connection
fetchFirebaseData().then(data => console.log(data));

// Test decision tree
assessQuality(6.6, 65, "250,252,250");

// Test individual sensor mapping
const mq135 = 65;
const odor = mq135 < 70 ? 1 : mq135 < 100 ? 0 : -1;
console.log("Odor:", odor);

// Force reload data
loadData();
```

---

## 📊 Health Check Checklist

```
[ ] Firebase URL configured correctly
[ ] Firebase rules allow read access
[ ] Data exists in Firebase (readings node)
[ ] Chart.js CDN loaded
[ ] All canvas elements present
[ ] Network connection stable
[ ] Sensors calibrated
[ ] No console errors (except extension errors - OK to ignore)
[ ] Data refreshing every 30 seconds
[ ] Quality classification working
```

---

## 🆘 Still Having Issues?

### 1. Check Documentation
- `README.md` - Setup guide
- `DECISION_TREE_SIMPLIFIED.md` - Decision tree logic
- `SENSOR_MAPPING_CARD.md` - Sensor reference

### 2. Verify Setup
```bash
# Check dependencies
npm list

# Rebuild
npm run build

# Run dev server
npm run dev
```

### 3. Reset & Restart
```bash
# Clear cache
rm -rf node_modules .astro
npm install
npm run dev
```

### 4. Test with Known Good Data
```javascript
// Paste di Firebase Console - Test Data
{
  "readings": {
    "test001": {
      "pH": 6.6,
      "mq135": 65,
      "rgb": "250,252,250",
      "color": "Putih",
      "timestamp": 1234567890000
    }
  }
}
```

---

## 💡 Pro Tips

1. **Always check Console first** - Most errors logged there
2. **Use browser DevTools Network tab** - See Firebase requests
3. **Test with manual data** - Verify logic without hardware
4. **One change at a time** - Easier to identify issues
5. **Keep documentation handy** - Reference sensor mappings

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: ✅ Production Ready

🥛 Happy Troubleshooting! 🐐