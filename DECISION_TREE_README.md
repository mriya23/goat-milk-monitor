# 🌳 Decision Tree Classifier - Quick Start

## 📌 Ringkasan

Decision Tree Classifier untuk mengklasifikasikan kualitas susu kambing menjadi **3 kategori**:
- 🟢 **Baik** (85 poin) - Layak konsumsi
- 🟡 **Sedang** (60 poin) - Segera gunakan
- 🔴 **Buruk** (30 poin) - Buang!

---

## 🚀 Quick Start

### 1. Import
```typescript
import { classifyMilkQuality, type MilkData } from './lib/decisionTree';
```

### 2. Gunakan
```typescript
const data: MilkData = {
  ph: 6.6,
  temperature: 6,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
};

const quality = classifyMilkQuality(data);
console.log(quality); // Output: "Baik"
```

---

## 📊 Parameter Input

| Parameter | Type | Range | Penjelasan |
|-----------|------|-------|------------|
| `ph` | number | 6.5-6.8 (optimal) | Tingkat keasaman |
| `temperature` | number | 4-8°C (optimal) | Suhu penyimpanan |
| `taste` | number | 1=segar, 0=sedang, -1=buruk | Rasa susu |
| `odor` | number | 1=segar, 0=sedang, -1=tengik | Bau susu |
| `fat` | number | >3.5% (baik) | Kandungan lemak |
| `turbidity` | number | 0=jernih, 1=keruh, 2+=sangat keruh | Kekeruhan |
| `colour` | number | 245-255 (baik) | Warna (RGB average) |

---

## 🔧 Fungsi Tersedia

### `classifyMilkQuality(data: MilkData): QualityClass`
Klasifikasi utama - return 'Baik', 'Sedang', atau 'Buruk'

### `getQualityScore(quality: QualityClass): number`
Dapatkan skor numerik (85/60/30)

### `getQualityColor(quality: QualityClass): string`
Dapatkan warna hex (#10b981/#f59e0b/#ef4444)

### `getQualityRecommendation(quality: QualityClass): string`
Dapatkan rekomendasi tindakan

### `classifyBatch(dataArray: MilkData[]): Array<Object>`
Klasifikasi banyak data sekaligus

### `getQualityStatistics(dataArray: MilkData[]): Object`
Dapatkan statistik (jumlah & persentase)

---

## 💡 Contoh Penggunaan

### Contoh 1: Single Classification
```typescript
const result = classifyMilkQuality({
  ph: 6.6,
  temperature: 6,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
});

console.log(result); // "Baik"
```

### Contoh 2: Dengan Informasi Lengkap
```typescript
const quality = classifyMilkQuality(data);
const score = getQualityScore(quality);
const color = getQualityColor(quality);
const recommendation = getQualityRecommendation(quality);

console.log(`Kualitas: ${quality}`);
console.log(`Skor: ${score}`);
console.log(`Warna: ${color}`);
console.log(`Rekomendasi: ${recommendation}`);
```

### Contoh 3: Batch Processing
```typescript
const samples = [data1, data2, data3];
const results = classifyBatch(samples);

results.forEach(r => {
  console.log(`${r.quality}: ${r.recommendation}`);
});
```

### Contoh 4: Statistik
```typescript
const stats = getQualityStatistics(samples);

console.log(`Total: ${stats.total}`);
console.log(`Baik: ${stats.baik} (${stats.baikPercentage.toFixed(1)}%)`);
console.log(`Sedang: ${stats.sedang} (${stats.sedangPercentage.toFixed(1)}%)`);
console.log(`Buruk: ${stats.buruk} (${stats.burukPercentage.toFixed(1)}%)`);
```

### Contoh 5: Integrasi dengan Sensor
```typescript
// Data dari sensor
const sensorData = {
  pH: 6.6,
  temperature: 6.5,
  mq135: 65,
  rgb: "245,250,252"
};

// Convert ke MilkData
const milkData: MilkData = {
  ph: sensorData.pH,
  temperature: sensorData.temperature,
  odor: sensorData.mq135 < 70 ? 1 : sensorData.mq135 < 100 ? 0 : -1,
  taste: sensorData.pH >= 6.4 && sensorData.pH <= 6.7 ? 1 : 0,
  turbidity: 0,
  colour: 249, // Average dari RGB
  fat: 3.8
};

const quality = classifyMilkQuality(milkData);
```

---

## 📁 File Structure

```
src/lib/
├── decisionTree.ts           ← File utama classifier
├── decisionTreeExample.ts    ← Contoh lengkap
└── fetchData.ts              ← Terintegrasi dengan Firebase

docs/
├── DECISION_TREE_GUIDE.md    ← Dokumentasi lengkap
└── DECISION_TREE_README.md   ← File ini (quick reference)

test-decision-tree.js         ← Test file
```

---

## 🧪 Testing

Jalankan test:
```bash
node test-decision-tree.js
```

Output: 100% test berhasil ✅

---

## 📈 Cara Kerja

Decision Tree bekerja seperti flowchart:

```
        Odor buruk?
         /      \
       YES       NO
        |         |
    [Buruk]   Taste segar?
               /        \
             YES         NO
              |           |
          pH optimal?  [Sedang]
            /    \
          YES     NO
           |       |
        [Baik] [Sedang]
```

Setiap node memeriksa satu parameter dan memutuskan cabang mana yang diambil hingga mencapai hasil klasifikasi.

---

## 🎯 Kriteria Kualitas

### 🟢 Baik
- pH: 6.5-6.8
- Temperature: 4-8°C
- Taste: 1 (segar)
- Odor: 1 (segar)
- Fat: ≥3.5%
- Turbidity: 0 (jernih)
- Colour: ≥245

### 🟡 Sedang
- pH: 6.2-6.9 (tidak optimal)
- Temperature: 8-15°C
- Taste: 0 (agak asam)
- Odor: 0 (kurang segar)
- Fat: 2.5-3.5%
- Turbidity: 1 (sedikit keruh)
- Colour: 240-254

### 🔴 Buruk
- pH: <6.0 atau >7.2
- Temperature: >15°C
- Taste: -1 (sangat asam)
- Odor: -1 (tengik)
- Fat: <2.5%
- Turbidity: ≥2 (keruh)
- Colour: <240

---

## 🔗 Integrasi Dashboard

File `fetchData.ts` sudah terintegrasi dengan decision tree:

```typescript
// Otomatis menggunakan decision tree
import { fetchReadings } from './lib/fetchData';

const readings = await fetchReadings();
// Setiap reading sudah punya property 'quality' dari decision tree
```

---

## 📚 Dokumentasi Lengkap

Lihat `DECISION_TREE_GUIDE.md` untuk:
- Penjelasan detail cara kerja
- Visualisasi tree lengkap
- Contoh implementasi advanced
- Parameter tuning guide
- FAQ

---

## ✨ Keunggulan

✅ **Cepat** - Klasifikasi real-time  
✅ **Akurat** - Berdasarkan standar industri  
✅ **Transparan** - Dapat dijelaskan  
✅ **Fleksibel** - Mudah di-customize  
✅ **Robust** - Handle missing data  

---

## 🆘 Troubleshooting

### Q: Result selalu "Sedang"?
**A:** Pastikan semua parameter terisi. Missing parameter = default "Sedang"

### Q: Bagaimana mengubah threshold?
**A:** Edit file `decisionTree.ts` di bagian `const decisionTree: DecisionTreeNode`

### Q: Bisa tambah parameter baru?
**A:** Ya! Tambahkan di interface `MilkData` dan update tree structure

---

## 📞 Support

- 📖 Dokumentasi: `DECISION_TREE_GUIDE.md`
- 🧪 Test: `test-decision-tree.js`
- 💡 Contoh: `decisionTreeExample.ts`

---

**Happy Classifying! 🥛🐐**