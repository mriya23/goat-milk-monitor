# 🎯 Sensor Mapping Quick Reference Card

## 📌 Overview
Sistem monitoring susu kambing menggunakan **3 sensor** untuk decision tree classifier.

---

## 🟢 SENSOR 1: MQ135 Gas Sensor

**Fungsi**: Deteksi bau/odor susu

### Mapping Table
| MQ135 Value | Odor Score | Kategori | Status |
|-------------|------------|----------|--------|
| **< 70**    | `1`        | Segar    | 🟢 BAIK |
| **70-100**  | `0`        | Sedang   | 🟡 MEDIUM |
| **> 100**   | `-1`       | Buruk    | 🔴 BAD |

### Code
```javascript
const odor = mq135 < 70 ? 1 : mq135 < 100 ? 0 : -1;
```

### Interpretasi
- **< 70**: Udara bersih, tidak ada fermentasi
- **70-100**: Mulai ada perubahan bau, perlu monitoring
- **> 100**: Bau tengik/asam, kemungkinan rusak

---

## 🔵 SENSOR 2: pH Sensor

**Fungsi**: Deteksi rasa/taste (keasaman)

### Mapping Table
| pH Range     | Taste Score | Kategori | Status |
|--------------|-------------|----------|--------|
| **6.4-6.7**  | `1`         | Segar    | 🟢 OPTIMAL |
| **6.2-6.9**  | `0`         | Sedang   | 🟡 ACCEPTABLE |
| **< 6.2 atau > 6.9** | `-1` | Buruk | 🔴 EXTREME |

### Code
```javascript
const taste = pH >= 6.4 && pH <= 6.7 ? 1
            : pH >= 6.2 && pH <= 6.9 ? 0
            : -1;
```

### Interpretasi
- **6.4-6.7**: pH optimal susu kambing segar
- **6.2-6.9**: Masih OK tapi tidak optimal
- **< 6.2**: Terlalu asam (fermentasi)
- **> 6.9**: Terlalu basa (kontaminasi)

### Reference
📚 pH normal susu kambing: **6.5 - 6.8**

---

## 🟡 SENSOR 3: TCS3200 Color Sensor

**Fungsi**: Deteksi warna susu (RGB)

### Mapping Table
| RGB Average  | Colour Value | Warna Visual     | Status |
|--------------|--------------|------------------|--------|
| **≥ 245**    | `≥ 245`      | Putih bersih     | 🟢 BAIK |
| **240-244**  | `240-244`    | Putih kekuningan | 🟡 SEDANG |
| **< 240**    | `< 240`      | Kekuningan       | 🔴 BURUK |

### Code
```javascript
const rgbValues = rgb.split(",").map(v => parseInt(v.trim()));
const colour = Math.round((rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3);
```

### Contoh
```javascript
RGB "250,252,250" → (250+252+250)/3 = 250.67 → 🟢 BAIK
RGB "242,244,241" → (242+244+241)/3 = 242.33 → 🟡 SEDANG
RGB "230,235,228" → (230+235+228)/3 = 231.00 → 🔴 BURUK
```

---

## 🌲 Decision Tree Flow

```
INPUT: pH, MQ135, RGB

    ↓
    
1. MQ135 → odor (-1, 0, 1)
    ↓
2. pH → taste (-1, 0, 1)
    ↓
3. RGB → colour (0-255)
    ↓
4. classifyWithDecisionTree(odor, taste, pH, colour)
    ↓
    
OUTPUT: "Baik" / "Sedang" / "Buruk"
```

---

## 🎯 Path to "BAIK"

Untuk mendapatkan kualitas **"Baik"**, SEMUA kondisi harus terpenuhi:

```
✅ odor = 1       (MQ135 < 70)
✅ taste = 1      (pH 6.4-6.7)
✅ pH = 6.5-6.8   (optimal range)
✅ colour ≥ 245   (putih bersih)
```

**Jika salah satu tidak terpenuhi** → maksimal "Sedang"

---

## 📊 Quality Matrix

| Odor | Taste | pH Range | Colour | Result |
|------|-------|----------|--------|--------|
| 1    | 1     | 6.5-6.8  | ≥245   | **Baik** ✅ |
| 1    | 1     | 6.5-6.8  | 240-244| Sedang |
| 1    | 0     | any      | any    | Sedang |
| 0    | any   | any      | any    | Sedang (max) |
| -1   | -1    | any      | any    | **Buruk** ❌ |

---

## 🧪 Test Commands

Copy-paste di browser console:

```javascript
// Test 1: Perfect milk
assessQuality(6.6, 65, "250,252,250");  // → "Baik"

// Test 2: Medium quality
assessQuality(6.3, 85, "242,244,241");  // → "Sedang"

// Test 3: Bad quality
assessQuality(5.8, 120, "230,235,228"); // → "Buruk"
```

---

## 🔧 Quick Calibration

### MQ135 Calibration
1. Preheat sensor 24-48 jam
2. Test di udara bersih → should read < 50
3. Test di dekat ammonia → should read > 150

### pH Sensor Calibration
1. Use buffer solution pH 4.0 → calibrate low
2. Use buffer solution pH 7.0 → calibrate mid
3. Use buffer solution pH 10.0 → calibrate high

### TCS3200 Calibration
1. Use white reference card → should read RGB ~250,250,250
2. Use black reference → should read RGB ~10,10,10
3. Adjust frequency scaling if needed

---

## 🎨 Quality Indicator Colors

```css
Baik   → #10b981 (green)
Sedang → #f59e0b (orange)
Buruk  → #ef4444 (red)
```

---

## ⚠️ Important Notes

1. **NO Temperature Sensor**: Sistem ini TIDAK menggunakan sensor suhu
2. **All Real Data**: 100% data dari sensor (tidak ada nilai asumsi)
3. **Strict "Baik"**: Kualitas "Baik" sangat ketat untuk safety
4. **Root Node**: Odor (MQ135) paling berpengaruh dalam decision tree

---

## 📱 Troubleshooting

### Selalu "Sedang"?
- Cek MQ135: Harus < 70 untuk bisa "Baik"
- Cek pH: Harus 6.4-6.7 untuk bisa "Baik"
- Cek Colour: Harus ≥ 245 untuk bisa "Baik"

### Selalu "Buruk"?
- Kalibrasi MQ135 (mungkin baseline terlalu tinggi)
- Kalibrasi pH sensor (mungkin offset)
- Cek wiring sensor

### RGB tidak akurat?
- Kalibrasi TCS3200 dengan white card
- Cek lighting environment (harus stabil)
- Adjust sensor distance dari sampel

---

## 📚 Documentation

- **Full Guide**: `DECISION_TREE_SIMPLIFIED.md`
- **Changes**: `PERUBAHAN_DECISION_TREE.txt`
- **Implementation**: `src/pages/index.astro`

---

## ✅ Quick Checklist

```
[ ] MQ135 connected & calibrated
[ ] pH sensor connected & calibrated
[ ] TCS3200 connected & calibrated
[ ] Firebase configured
[ ] Test with known good sample
[ ] Test with known bad sample
[ ] Monitor real-time readings
```

---

**Version**: 1.0 (Simplified - 3 Sensors)  
**Last Updated**: 2024  
**Status**: ✅ Production Ready

🥛 Happy Monitoring! 🐐