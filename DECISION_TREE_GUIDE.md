# 🌳 Decision Tree Classifier - Panduan Lengkap

## 📋 Daftar Isi
- [Pengenalan](#pengenalan)
- [Cara Kerja Decision Tree](#cara-kerja-decision-tree)
- [Parameter Kualitas Susu](#parameter-kualitas-susu)
- [Struktur File](#struktur-file)
- [Cara Penggunaan](#cara-penggunaan)
- [Contoh Implementasi](#contoh-implementasi)
- [API Reference](#api-reference)
- [Visualisasi Tree](#visualisasi-tree)
- [FAQ](#faq)

---

## 🎯 Pengenalan

Decision Tree Classifier adalah algoritma machine learning yang digunakan untuk mengklasifikasikan kualitas susu kambing menjadi **tiga kategori**:

### Kategori Kualitas

| Kualitas | Skor | Warna | Deskripsi |
|----------|------|-------|-----------|
| 🟢 **Baik** | 85 | `#10b981` (hijau) | Susu dalam kondisi optimal, layak konsumsi |
| 🟡 **Sedang** | 60 | `#f59e0b` (orange) | Susu masih layak tapi perlu segera digunakan |
| 🔴 **Buruk** | 30 | `#ef4444` (merah) | Susu tidak layak konsumsi, harus dibuang |

### Keunggulan Decision Tree

✅ **Mudah Dipahami** - Proses keputusan dapat dijelaskan dengan jelas  
✅ **Transparan** - Tidak seperti "black box" neural networks  
✅ **Cepat** - Klasifikasi sangat cepat, cocok untuk real-time  
✅ **Multi-Parameter** - Mempertimbangkan banyak faktor sekaligus  
✅ **Tidak Perlu Normalisasi** - Bekerja dengan data mentah  
✅ **Handle Missing Data** - Dapat menangani data yang tidak lengkap  

---

## 🧠 Cara Kerja Decision Tree

Decision Tree bekerja seperti diagram alur (flowchart) yang membuat keputusan berdasarkan serangkaian pertanyaan tentang data:

```
                    [Odor < 0?]
                    /         \
                  YES          NO
                  /              \
            [Taste < -0.5?]   [Taste < 0.5?]
              /      \           /         \
           YES       NO        YES          NO
            |         |         |            |
         BURUK    [pH < 6.0?] SEDANG    [pH < 6.5?]
                    /    \                /       \
                 YES     NO             YES        NO
                  |       |              |          |
               BURUK   SEDANG        SEDANG    [pH < 6.9?]
                                                 /      \
                                               YES      NO
                                                |        |
                                           [Temp...]  SEDANG
                                              / \
                                           BAIK SEDANG
```

### Alur Keputusan

1. **Akar (Root)**: Dimulai dari parameter paling penting (biasanya **odor**)
2. **Cabang (Branches)**: Setiap cabang merepresentasikan hasil dari kondisi
3. **Node Internal**: Titik keputusan yang memeriksa parameter tertentu
4. **Daun (Leaves)**: Hasil akhir klasifikasi (Baik/Sedang/Buruk)

### Contoh Klasifikasi

**Input Data:**
```javascript
{
  ph: 6.6,
  temperature: 6,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
}
```

**Proses:**
1. ✅ Odor ≥ 0 (bau segar) → Ke kanan
2. ✅ Taste ≥ 0.5 (rasa segar) → Ke kanan
3. ✅ pH ≥ 6.5 (baik) → Ke kanan
4. ✅ pH < 6.9 (optimal) → Ke kiri
5. ✅ Temp ≥ 4 (tidak terlalu dingin) → Ke kanan
6. ✅ Temp < 8 (suhu optimal) → Ke kiri
7. ✅ Fat ≥ 3.5 (lemak baik) → Ke kanan
8. ✅ Turbidity < 0.5 (jernih) → Ke kiri
9. ✅ Colour ≥ 245 (putih bersih) → Ke kanan

**Output:** 🟢 **BAIK**

---

## 📊 Parameter Kualitas Susu

### 1. 🧪 pH (Tingkat Keasaman)

| Range | Kualitas | Penjelasan |
|-------|----------|------------|
| 6.5 - 6.8 | 🟢 Baik | pH optimal untuk susu kambing segar |
| 6.2 - 6.4 atau 6.8 - 6.9 | 🟡 Sedang | Masih acceptable tapi mulai asam/basa |
| < 6.0 atau > 7.2 | 🔴 Buruk | Terlalu asam (fermentasi) atau basa |

**Penjelasan:**
- Susu segar memiliki pH sekitar 6.6
- pH turun karena bakteri asam laktat mengubah laktosa menjadi asam laktat
- pH < 6.0 menandakan susu sudah fermentasi

### 2. 🌡️ Temperature (Suhu)

| Range | Kualitas | Penjelasan |
|-------|----------|------------|
| 4°C - 8°C | 🟢 Baik | Suhu penyimpanan optimal (cold chain) |
| 8°C - 15°C | 🟡 Sedang | Kurang dingin, bakteri mulai aktif |
| > 15°C | 🔴 Buruk | Terlalu hangat, bakteri berkembang cepat |

**Penjelasan:**
- Suhu rendah memperlambat pertumbuhan bakteri
- Pada suhu > 10°C, bakteri berkembang 2x lipat setiap 20 menit
- Susu harus disimpan < 8°C untuk menjaga kualitas

### 3. 👅 Taste (Rasa)

| Nilai | Kualitas | Penjelasan |
|-------|----------|------------|
| 1 | 🟢 Baik | Rasa segar, manis sedikit |
| 0 | 🟡 Sedang | Rasa agak asam atau kurang segar |
| -1 | 🔴 Buruk | Rasa sangat asam, pahit, atau busuk |

**Penjelasan:**
- Susu segar memiliki rasa manis alami dari laktosa
- Rasa asam menandakan fermentasi
- Rasa pahit menandakan protein mulai rusak

### 4. 👃 Odor (Bau)

| Nilai | Kualitas | Penjelasan |
|-------|----------|------------|
| 1 | 🟢 Baik | Bau segar khas susu kambing |
| 0 | 🟡 Sedang | Bau kurang segar atau sedikit apek |
| -1 | 🔴 Buruk | Bau tengik, busuk, atau sangat menyengat |

**Penjelasan:**
- Bau segar menandakan tidak ada kontaminasi bakteri
- Bau tengik dari oksidasi lemak
- Bau busuk dari protein yang terdekomposisi

### 5. 🥛 Fat (Kandungan Lemak)

| Range | Kualitas | Penjelasan |
|-------|----------|------------|
| ≥ 3.5% | 🟢 Baik | Kandungan lemak optimal |
| 2.5% - 3.5% | 🟡 Sedang | Kandungan lemak sedang |
| < 2.5% | 🔴 Buruk | Kandungan lemak rendah atau tercampur air |

**Penjelasan:**
- Susu kambing normal: 3.5% - 4.5% lemak
- Lemak tinggi = nutrisi baik
- Lemak rendah bisa menandakan pemalsuan (dicampur air)

### 6. 🌫️ Turbidity (Kekeruhan)

| Nilai | Kualitas | Penjelasan |
|-------|----------|------------|
| 0 | 🟢 Baik | Jernih, tidak ada partikel asing |
| 1 | 🟡 Sedang | Sedikit keruh |
| ≥ 2 | 🔴 Buruk | Sangat keruh, ada kontaminan |

**Penjelasan:**
- Susu murni seharusnya relatif jernih (opaque tapi bukan cloudy)
- Kekeruhan bisa dari kontaminasi kotoran atau bakteri
- Kekeruhan ekstrem menandakan pembusukan

### 7. 🎨 Colour (Warna)

| Range | Kualitas | Penjelasan |
|-------|----------|------------|
| 245 - 255 | 🟢 Baik | Putih bersih khas susu kambing |
| 240 - 244 | 🟡 Sedang | Agak kekuningan |
| < 240 | 🔴 Buruk | Kekuningan atau kotor |

**Penjelasan:**
- Susu kambing lebih putih dari susu sapi (kurang karotenoid)
- Warna kekuningan bisa dari kolostrum atau kontaminasi
- Perubahan warna menandakan oksidasi atau pembusukan

---

## 📁 Struktur File

```
src/lib/
├── decisionTree.ts           # File utama - Decision Tree classifier
├── decisionTreeExample.ts    # Contoh penggunaan lengkap
└── fetchData.ts              # Integrasi dengan Firebase (updated)
```

### File Utama: `decisionTree.ts`

```typescript
// Interface & Types
export interface MilkData { ... }
export type QualityClass = 'Baik' | 'Sedang' | 'Buruk';

// Fungsi Utama
export function classifyMilkQuality(data: MilkData): QualityClass
export function getQualityScore(quality: QualityClass): number
export function getQualityColor(quality: QualityClass): string
export function getQualityRecommendation(quality: QualityClass): string
export function classifyBatch(dataArray: MilkData[]): Array<...>
export function getQualityStatistics(dataArray: MilkData[]): {...}
```

---

## 🚀 Cara Penggunaan

### 1. Import Module

```typescript
import { 
  classifyMilkQuality, 
  getQualityScore,
  getQualityColor,
  getQualityRecommendation,
  type MilkData 
} from './lib/decisionTree';
```

### 2. Siapkan Data

```typescript
const milkData: MilkData = {
  ph: 6.6,
  temperature: 6,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
};
```

### 3. Klasifikasi

```typescript
const quality = classifyMilkQuality(milkData);
console.log('Kualitas:', quality); // Output: "Baik"
```

### 4. Dapatkan Informasi Lengkap

```typescript
const score = getQualityScore(quality);
const color = getQualityColor(quality);
const recommendation = getQualityRecommendation(quality);

console.log('Skor:', score);              // 85
console.log('Warna:', color);             // "#10b981"
console.log('Rekomendasi:', recommendation);
```

---

## 💡 Contoh Implementasi

### Contoh 1: Klasifikasi Single Data

```typescript
import { classifyMilkQuality, type MilkData } from './lib/decisionTree';

// Data dari sensor
const sensorReading: MilkData = {
  ph: 6.6,
  temperature: 6.5,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
};

// Klasifikasi
const quality = classifyMilkQuality(sensorReading);

if (quality === 'Baik') {
  console.log('✅ Susu berkualitas baik, layak konsumsi!');
} else if (quality === 'Sedang') {
  console.log('⚠️ Susu kualitas sedang, segera gunakan!');
} else {
  console.log('❌ Susu buruk, jangan dikonsumsi!');
}
```

### Contoh 2: Klasifikasi Batch Data

```typescript
import { classifyBatch, type MilkData } from './lib/decisionTree';

const batchData: MilkData[] = [
  { ph: 6.6, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 },
  { ph: 6.3, temperature: 10, taste: 0, odor: 0, fat: 3.0, turbidity: 1, colour: 245 },
  { ph: 5.8, temperature: 18, taste: -1, odor: -1, fat: 2.0, turbidity: 2, colour: 230 }
];

const results = classifyBatch(batchData);

results.forEach((result, index) => {
  console.log(`Sampel ${index + 1}:`);
  console.log(`  Kualitas: ${result.quality}`);
  console.log(`  Skor: ${result.score}`);
  console.log(`  Rekomendasi: ${result.recommendation}`);
});
```

### Contoh 3: Statistik Kualitas

```typescript
import { getQualityStatistics, type MilkData } from './lib/decisionTree';

const weeklyData: MilkData[] = [
  // ... data 1 minggu
];

const stats = getQualityStatistics(weeklyData);

console.log(`Total Sampel: ${stats.total}`);
console.log(`Kualitas Baik: ${stats.baik} (${stats.baikPercentage.toFixed(1)}%)`);
console.log(`Kualitas Sedang: ${stats.sedang} (${stats.sedangPercentage.toFixed(1)}%)`);
console.log(`Kualitas Buruk: ${stats.buruk} (${stats.burukPercentage.toFixed(1)}%)`);
```

### Contoh 4: Integrasi dengan Sensor (Real-time)

```typescript
import { classifyMilkQuality, type MilkData } from './lib/decisionTree';

// Fungsi untuk convert data sensor ke MilkData
function convertSensorData(sensorData: any): MilkData {
  // Parse RGB
  const rgbValues = sensorData.rgb.split(',').map((v: string) => parseInt(v.trim()));
  const avgColour = Math.round((rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3);

  // Map MQ135 to odor
  const odor = sensorData.mq135 < 70 ? 1 : sensorData.mq135 < 100 ? 0 : -1;

  // Map pH to taste
  const taste = sensorData.pH >= 6.4 && sensorData.pH <= 6.7 ? 1 :
                sensorData.pH >= 6.2 && sensorData.pH <= 6.9 ? 0 : -1;

  return {
    ph: sensorData.pH,
    temperature: sensorData.temperature,
    odor: odor,
    taste: taste,
    turbidity: 0, // Default atau dari sensor
    colour: avgColour,
    fat: 3.8 // Default atau dari sensor
  };
}

// Real-time monitoring
function monitorMilkQuality(sensorData: any) {
  const milkData = convertSensorData(sensorData);
  const quality = classifyMilkQuality(milkData);
  
  // Update dashboard
  updateDashboard(quality);
  
  // Alert jika buruk
  if (quality === 'Buruk') {
    sendAlert('⚠️ Kualitas susu buruk terdeteksi!');
  }
  
  return quality;
}
```

### Contoh 5: Dashboard Integration

```typescript
import { 
  classifyMilkQuality, 
  getQualityColor,
  getQualityStatistics,
  type MilkData 
} from './lib/decisionTree';

// Update dashboard dengan data terbaru
function updateDashboard(readings: any[]) {
  // Convert ke MilkData
  const milkDataArray: MilkData[] = readings.map(convertSensorData);
  
  // Dapatkan statistik
  const stats = getQualityStatistics(milkDataArray);
  
  // Update UI
  document.getElementById('quality-good')!.textContent = stats.baik.toString();
  document.getElementById('quality-medium')!.textContent = stats.sedang.toString();
  document.getElementById('quality-poor')!.textContent = stats.buruk.toString();
  
  // Update progress bars
  document.getElementById('good-bar')!.style.width = `${stats.baikPercentage}%`;
  document.getElementById('medium-bar')!.style.width = `${stats.sedangPercentage}%`;
  document.getElementById('poor-bar')!.style.width = `${stats.burukPercentage}%`;
  
  // Update chart
  updateQualityChart(stats);
}

// Update chart dengan distribusi kualitas
function updateQualityChart(stats: any) {
  const ctx = document.getElementById('qualityChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Baik', 'Sedang', 'Buruk'],
      datasets: [{
        data: [stats.baik, stats.sedang, stats.buruk],
        backgroundColor: [
          getQualityColor('Baik'),
          getQualityColor('Sedang'),
          getQualityColor('Buruk')
        ]
      }]
    }
  });
}
```

---

## 📖 API Reference

### `classifyMilkQuality(data: MilkData): QualityClass`

Fungsi utama untuk mengklasifikasikan kualitas susu.

**Parameters:**
- `data` (MilkData): Object berisi parameter susu

**Returns:**
- `QualityClass`: 'Baik', 'Sedang', atau 'Buruk'

**Example:**
```typescript
const quality = classifyMilkQuality({
  ph: 6.6,
  temperature: 6,
  taste: 1,
  odor: 1,
  fat: 3.8,
  turbidity: 0,
  colour: 250
});
// Returns: 'Baik'
```

---

### `getQualityScore(quality: QualityClass): number`

Mendapatkan skor numerik (0-100) dari kualitas.

**Parameters:**
- `quality` (QualityClass): 'Baik', 'Sedang', atau 'Buruk'

**Returns:**
- `number`: Skor 0-100 (Baik=85, Sedang=60, Buruk=30)

**Example:**
```typescript
const score = getQualityScore('Baik');
// Returns: 85
```

---

### `getQualityColor(quality: QualityClass): string`

Mendapatkan kode warna hex untuk kualitas.

**Parameters:**
- `quality` (QualityClass): 'Baik', 'Sedang', atau 'Buruk'

**Returns:**
- `string`: Kode warna hex

**Example:**
```typescript
const color = getQualityColor('Baik');
// Returns: '#10b981' (green)
```

---

### `getQualityRecommendation(quality: QualityClass): string`

Mendapatkan rekomendasi berdasarkan kualitas.

**Parameters:**
- `quality` (QualityClass): 'Baik', 'Sedang', atau 'Buruk'

**Returns:**
- `string`: Pesan rekomendasi

**Example:**
```typescript
const recommendation = getQualityRecommendation('Sedang');
// Returns: 'Susu masih layak konsumsi namun perlu segera digunakan...'
```

---

### `classifyBatch(dataArray: MilkData[]): Array<Object>`

Klasifikasi banyak data sekaligus.

**Parameters:**
- `dataArray` (MilkData[]): Array data susu

**Returns:**
- `Array<Object>`: Array hasil klasifikasi dengan detail lengkap

**Example:**
```typescript
const results = classifyBatch([data1, data2, data3]);
// Returns: [
//   { data: {...}, quality: 'Baik', score: 85, color: '#10b981', recommendation: '...' },
//   { data: {...}, quality: 'Sedang', score: 60, color: '#f59e0b', recommendation: '...' },
//   ...
// ]
```

---

### `getQualityStatistics(dataArray: MilkData[]): Object`

Mendapatkan statistik kualitas dari batch data.

**Parameters:**
- `dataArray` (MilkData[]): Array data susu

**Returns:**
- `Object`: Statistik lengkap

**Example:**
```typescript
const stats = getQualityStatistics([data1, data2, data3]);
// Returns: {
//   total: 3,
//   baik: 1,
//   sedang: 1,
//   buruk: 1,
//   baikPercentage: 33.33,
//   sedangPercentage: 33.33,
//   burukPercentage: 33.33
// }
```

---

## 🌲 Visualisasi Tree

### Struktur Lengkap Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                       ROOT: odor < 0?                        │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
         ┌──────▼──────┐               ┌──────▼──────┐
         │  taste < -0.5?│               │ taste < 0.5? │
         └──────┬──────┘               └──────┬──────┘
          YES   │   NO                   YES   │   NO
         ┌──────▼──────┐               ┌──────▼──────┐
         │    BURUK     │               │  ph < 6.3?  │
         └──────────────┘               └──────┬──────┘
                │                         YES   │   NO
         ┌──────▼──────┐               ┌──────▼──────┐
         │  ph < 6.0?  │               │   SEDANG    │
         └──────┬──────┘               └─────────────┘
          YES   │   NO
         ┌──────▼──────┐
         │    BURUK     │
         └──────────────┘
                │
         ┌──────▼──────┐
         │  temp < 15? │
         └──────┬──────┘
          YES   │   NO
         ┌──────▼──────┐
         │   SEDANG    │
         └──────────────┘

... (dan seterusnya untuk cabang kanan)
```

### Path ke Kualitas BAIK

Untuk mendapatkan klasifikasi **"Baik"**, data harus memenuhi semua kondisi ini:

```
✅ odor ≥ 0        (bau segar)
✅ taste ≥ 0.5     (rasa segar)
✅ pH ≥ 6.5        (pH baik)
✅ pH < 6.9        (pH optimal)
✅ temp ≥ 4        (tidak terlalu dingin)
✅ temp < 8        (suhu optimal)
✅ fat ≥ 3.5       (lemak baik)
✅ turbidity < 0.5 (jernih)
✅ colour ≥ 245    (putih bersih)
```

---

## ❓ FAQ

### Q: Mengapa menggunakan Decision Tree?

**A:** Decision Tree dipilih karena:
- ✅ Mudah dipahami dan dijelaskan ke stakeholder
- ✅ Tidak memerlukan data training yang banyak
- ✅ Dapat di-customize sesuai standar industri susu
- ✅ Transparan - bisa lihat alasan klasifikasi
- ✅ Cepat - cocok untuk real-time monitoring

### Q: Apakah bisa mengubah threshold/kriteria?

**A:** Ya! Anda bisa memodifikasi tree di file `decisionTree.ts`:

```typescript
const decisionTree: DecisionTreeNode = {
  feature: 'odor',
  threshold: 0,  // ← Ubah threshold ini
  left: { ... },
  right: { ... }
};
```

### Q: Bagaimana jika ada parameter yang missing?

**A:** Decision tree akan menggunakan default value 'Sedang' jika ada parameter yang tidak tersedia.

### Q: Apakah akurasi classifier sudah divalidasi?

**A:** Tree ini dibangun berdasarkan standar industri susu kambing. Untuk produksi, disarankan untuk:
1. Validasi dengan data historis
2. Kalibrasi dengan tes laboratorium
3. Fine-tuning threshold berdasarkan feedback

### Q: Bisakah menambah parameter baru?

**A:** Ya! Tambahkan di interface `MilkData` dan update tree structure:

```typescript
export interface MilkData {
  ph?: number;
  temperature?: number;
  // ... parameter lain
  conductivity?: number;  // ← Parameter baru
}
```

### Q: Bagaimana cara testing classifier?

**A:** Gunakan file `decisionTreeExample.ts`:

```bash
# Import dan jalankan contoh
import { decisionTreeExamples } from './lib/decisionTreeExample';

decisionTreeExamples.contohSusuBaik();
decisionTreeExamples.contohStatistikKualitas();
```

### Q: Apakah bisa export tree ke format lain?

**A:** Ya, Anda bisa export ke:
- JSON untuk visualisasi
- Python scikit-learn format
- PMML (Predictive Model Markup Language)
- GraphViz DOT format

---

## 📚 Referensi

### Standar Kualitas Susu Kambing
- SNI 01-3141-2011 (Standar Nasional Indonesia untuk Susu Segar)
- FAO Dairy Quality Standards
- Codex Alimentarius - Milk and Milk Products

### Parameter Monitoring
- pH: AOAC Official Method 981.12
- Temperature: Cold Chain Management Guidelines
- Fat Content: Gerber Method / Rose-Gottlieb Method

### Machine Learning
- Decision Trees: Classification and Regression Trees (CART)
- Scikit-learn Documentation
- Pattern Recognition and Machine Learning (Bishop, 2006)

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Baca dokumentasi lengkap di file ini
2. Lihat contoh di `decisionTreeExample.ts`
3. Check file `TROUBLESHOOTING.md`
4. Contact: [your-email@example.com]

---

## 📝 Changelog

### Version 1.0.0 (2024)
- ✨ Initial release
- ✅ 7 parameter kualitas susu
- ✅ 3 kategori klasifikasi
- ✅ Batch processing support
- ✅ Statistics calculation
- ✅ Real-time integration ready

---

## 📄 License

Copyright (c) 2024 Goat Milk Monitor Project

---

**Happy Monitoring! 🥛🐐**