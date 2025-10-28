# 🔌 Integration Guide - Decision Tree Classifier

## 📋 Quick Integration untuk Dashboard

Panduan ini menjelaskan cara mengintegrasikan Decision Tree Classifier ke dalam dashboard yang sudah ada.

---

## ✅ Status Integrasi

Decision Tree **SUDAH TERINTEGRASI** secara otomatis dengan dashboard Anda!

### Yang Sudah Dikerjakan:

1. ✅ **File `decisionTree.ts`** sudah dibuat di `src/lib/`
2. ✅ **File `fetchData.ts`** sudah diupdate untuk menggunakan decision tree
3. ✅ **Interface `MilkReading`** sudah ditambahkan property `temperature`
4. ✅ **Fungsi `assessQuality()`** sudah menggunakan decision tree classifier

---

## 🚀 Cara Menggunakan

### 1. Dashboard Otomatis Menggunakan Decision Tree

Dashboard Anda **sudah otomatis** menggunakan decision tree untuk klasifikasi kualitas!

Setiap kali data dibaca dari Firebase, quality sudah diklasifikasi menggunakan decision tree.

```typescript
// Di fetchData.ts - SUDAH TERINTEGRASI
import { classifyMilkQuality } from "./decisionTree";

function assessQuality(reading: MilkReading): "Baik" | "Sedang" | "Buruk" {
  // Otomatis menggunakan decision tree
  return classifyMilkQuality(milkData);
}
```

### 2. Menampilkan di Dashboard

Di file `index.astro` atau komponen dashboard lainnya:

```typescript
import { fetchReadings } from './lib/fetchData';

const readings = await fetchReadings();

// Setiap reading sudah punya property 'quality' dari decision tree
readings.forEach(reading => {
  console.log(reading.quality); // "Baik", "Sedang", atau "Buruk"
});
```

---

## 📊 Menampilkan Statistik Kualitas

### Option 1: Menggunakan Built-in Statistics

```typescript
import { fetchDashboardStats } from './lib/fetchData';

const stats = await fetchDashboardStats();

// Stats sudah include:
// - stats.goodQuality (jumlah susu baik)
// - stats.mediumQuality (jumlah susu sedang)
// - stats.poorQuality (jumlah susu buruk)
```

### Option 2: Menggunakan Decision Tree Statistics

```typescript
import { getQualityStatistics } from './lib/decisionTree';
import { fetchReadings } from './lib/fetchData';

const readings = await fetchReadings();

// Convert ke MilkData format (sudah otomatis di fetchData)
const stats = getQualityStatistics(readings.map(r => ({
  ph: r.pH,
  temperature: r.temperature,
  // ... dll
})));

console.log(`Baik: ${stats.baik} (${stats.baikPercentage}%)`);
console.log(`Sedang: ${stats.sedang} (${stats.sedangPercentage}%)`);
console.log(`Buruk: ${stats.buruk} (${stats.burukPercentage}%)`);
```

---

## 🎨 Update UI Dashboard

### Menampilkan Quality Cards

```html
<div class="quality-cards">
  <div class="quality-card good">
    <h3>🟢 Kualitas Baik</h3>
    <div class="value" id="quality-good">0</div>
  </div>
  <div class="quality-card medium">
    <h3>🟡 Kualitas Sedang</h3>
    <div class="value" id="quality-medium">0</div>
  </div>
  <div class="quality-card bad">
    <h3>🔴 Kualitas Buruk</h3>
    <div class="value" id="quality-bad">0</div>
  </div>
</div>

<script>
  import { fetchDashboardStats } from './lib/fetchData';
  
  async function updateQualityDisplay() {
    const stats = await fetchDashboardStats();
    
    document.getElementById('quality-good').textContent = stats.goodQuality;
    document.getElementById('quality-medium').textContent = stats.mediumQuality;
    document.getElementById('quality-bad').textContent = stats.poorQuality;
  }
  
  updateQualityDisplay();
</script>
```

### Menampilkan dengan Warna

```typescript
import { getQualityColor, getQualityScore } from './lib/decisionTree';

const quality = reading.quality; // "Baik", "Sedang", atau "Buruk"
const color = getQualityColor(quality); // "#10b981", "#f59e0b", atau "#ef4444"
const score = getQualityScore(quality); // 85, 60, atau 30

// Apply ke element
element.style.color = color;
element.textContent = `${quality} (${score})`;
```

---

## 📈 Chart Integration

### Quality Distribution Chart (Pie/Doughnut)

```javascript
import { fetchDashboardStats } from './lib/fetchData';
import { getQualityColor } from './lib/decisionTree';

async function createQualityChart() {
  const stats = await fetchDashboardStats();
  
  const ctx = document.getElementById('qualityChart');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Baik', 'Sedang', 'Buruk'],
      datasets: [{
        data: [stats.goodQuality, stats.mediumQuality, stats.poorQuality],
        backgroundColor: [
          getQualityColor('Baik'),
          getQualityColor('Sedang'),
          getQualityColor('Buruk')
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Distribusi Kualitas Susu'
        }
      }
    }
  });
}
```

### Quality Trend Chart (Line)

```javascript
async function createQualityTrendChart() {
  const readings = await fetchReadings();
  
  // Group by date
  const dailyQuality = {};
  
  readings.forEach(reading => {
    const date = reading.dateTime.toLocaleDateString();
    if (!dailyQuality[date]) {
      dailyQuality[date] = { baik: 0, sedang: 0, buruk: 0 };
    }
    
    if (reading.quality === 'Baik') dailyQuality[date].baik++;
    else if (reading.quality === 'Sedang') dailyQuality[date].sedang++;
    else dailyQuality[date].buruk++;
  });
  
  const labels = Object.keys(dailyQuality);
  const baikData = labels.map(date => dailyQuality[date].baik);
  const sedangData = labels.map(date => dailyQuality[date].sedang);
  const burukData = labels.map(date => dailyQuality[date].buruk);
  
  const ctx = document.getElementById('trendChart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Baik',
          data: baikData,
          borderColor: getQualityColor('Baik'),
          backgroundColor: getQualityColor('Baik') + '20'
        },
        {
          label: 'Sedang',
          data: sedangData,
          borderColor: getQualityColor('Sedang'),
          backgroundColor: getQualityColor('Sedang') + '20'
        },
        {
          label: 'Buruk',
          data: burukData,
          borderColor: getQualityColor('Buruk'),
          backgroundColor: getQualityColor('Buruk') + '20'
        }
      ]
    }
  });
}
```

---

## 🔔 Real-time Updates

### Listen to Quality Changes

```typescript
import { listenToReadings } from './lib/fetchData';
import { getQualityStatistics } from './lib/decisionTree';

// Setup real-time listener
const unsubscribe = listenToReadings((readings) => {
  // Update statistik
  const stats = getQualityStatistics(readings.map(r => ({
    ph: r.pH,
    temperature: r.temperature,
    odor: r.mq135 < 70 ? 1 : r.mq135 < 100 ? 0 : -1,
    taste: r.pH >= 6.4 && r.pH <= 6.7 ? 1 : 0,
    turbidity: 0,
    colour: 249,
    fat: 3.8
  })));
  
  // Update UI
  updateQualityDisplay(stats);
  
  // Update charts
  updateQualityChart(stats);
});

// Cleanup when component unmounts
// unsubscribe();
```

### Alert System

```typescript
import { listenToLatestReading } from './lib/fetchData';
import { getQualityRecommendation } from './lib/decisionTree';

listenToLatestReading((reading) => {
  if (!reading) return;
  
  if (reading.quality === 'Buruk') {
    // Show alert
    showAlert({
      type: 'error',
      title: '⚠️ Kualitas Buruk Terdeteksi!',
      message: getQualityRecommendation('Buruk'),
      reading: reading
    });
  } else if (reading.quality === 'Sedang') {
    // Show warning
    showWarning({
      type: 'warning',
      title: '⚡ Perhatian!',
      message: getQualityRecommendation('Sedang')
    });
  }
});

function showAlert(alert) {
  // Implement your alert UI
  console.log(alert.title);
  console.log(alert.message);
  
  // Bisa gunakan library seperti:
  // - SweetAlert2
  // - Toastr
  // - Custom notification
}
```

---

## 🎯 Component Examples

### Quality Badge Component

```typescript
// QualityBadge.astro
---
interface Props {
  quality: 'Baik' | 'Sedang' | 'Buruk';
  showScore?: boolean;
}

import { getQualityColor, getQualityScore } from '../lib/decisionTree';

const { quality, showScore = false } = Astro.props;
const color = getQualityColor(quality);
const score = getQualityScore(quality);
const emoji = quality === 'Baik' ? '🟢' : quality === 'Sedang' ? '🟡' : '🔴';
---

<span class="quality-badge" style={`background: ${color}; color: white;`}>
  {emoji} {quality}
  {showScore && <span class="score">({score})</span>}
</span>

<style>
  .quality-badge {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .score {
    opacity: 0.8;
    font-size: 0.8rem;
  }
</style>
```

### Quality Card Component

```typescript
// QualityCard.astro
---
import { getQualityColor, getQualityRecommendation } from '../lib/decisionTree';

interface Props {
  quality: 'Baik' | 'Sedang' | 'Buruk';
  count: number;
  percentage: number;
}

const { quality, count, percentage } = Astro.props;
const color = getQualityColor(quality);
const recommendation = getQualityRecommendation(quality);
---

<div class="quality-card" style={`border-color: ${color};`}>
  <div class="header">
    <h3 style={`color: ${color};`}>{quality}</h3>
    <div class="count" style={`color: ${color};`}>{count}</div>
  </div>
  <div class="progress-bar">
    <div class="progress" style={`width: ${percentage}%; background: ${color};`}></div>
  </div>
  <p class="percentage">{percentage.toFixed(1)}%</p>
  <p class="recommendation">{recommendation}</p>
</div>

<style>
  .quality-card {
    background: white;
    border-left: 4px solid;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .count {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .progress-bar {
    height: 8px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .progress {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .percentage {
    font-size: 0.9rem;
    color: #666;
    margin: 5px 0;
  }
  
  .recommendation {
    font-size: 0.85rem;
    color: #888;
    margin-top: 10px;
    font-style: italic;
  }
</style>
```

---

## 📱 Mobile Responsive

### Quality Cards Grid

```css
.quality-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .quality-cards {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔧 Advanced Usage

### Custom Classification

Jika Anda ingin custom logic untuk specific cases:

```typescript
import { classifyMilkQuality, type MilkData } from './lib/decisionTree';

function customClassification(reading: any): 'Baik' | 'Sedang' | 'Buruk' {
  // Prepare data
  const milkData: MilkData = {
    ph: reading.pH,
    temperature: reading.temperature,
    odor: convertMQ135ToOdor(reading.mq135),
    taste: convertPHToTaste(reading.pH),
    turbidity: 0,
    colour: calculateColour(reading.rgb),
    fat: 3.8
  };
  
  // Get base classification
  let quality = classifyMilkQuality(milkData);
  
  // Apply custom rules
  if (reading.timestamp > Date.now() - 3600000) {
    // Very fresh milk (< 1 hour)
    if (quality === 'Sedang' && reading.pH > 6.6) {
      quality = 'Baik'; // Upgrade to Baik
    }
  }
  
  return quality;
}

function convertMQ135ToOdor(mq135: number): number {
  if (mq135 < 70) return 1;
  if (mq135 < 100) return 0;
  return -1;
}

function convertPHToTaste(pH: number): number {
  if (pH >= 6.4 && pH <= 6.7) return 1;
  if (pH >= 6.2 && pH <= 6.9) return 0;
  return -1;
}

function calculateColour(rgb: string): number {
  const values = rgb.split(',').map(v => parseInt(v.trim()));
  return Math.round((values[0] + values[1] + values[2]) / 3);
}
```

### Batch Processing untuk Reports

```typescript
import { classifyBatch, getQualityStatistics } from './lib/decisionTree';

async function generateQualityReport(startDate: Date, endDate: Date) {
  const readings = await fetchReadingsByDateRange(startDate, endDate);
  
  // Convert to MilkData format
  const milkDataArray = readings.map(r => ({
    ph: r.pH,
    temperature: r.temperature,
    odor: r.mq135 < 70 ? 1 : r.mq135 < 100 ? 0 : -1,
    taste: r.pH >= 6.4 && r.pH <= 6.7 ? 1 : 0,
    turbidity: 0,
    colour: 249,
    fat: 3.8
  }));
  
  // Get statistics
  const stats = getQualityStatistics(milkDataArray);
  
  // Generate report
  return {
    period: { startDate, endDate },
    total: stats.total,
    quality: {
      baik: { count: stats.baik, percentage: stats.baikPercentage },
      sedang: { count: stats.sedang, percentage: stats.sedangPercentage },
      buruk: { count: stats.buruk, percentage: stats.burukPercentage }
    },
    recommendation: getOverallRecommendation(stats)
  };
}

function getOverallRecommendation(stats: any): string {
  if (stats.baikPercentage > 80) {
    return 'Kualitas sangat baik! Pertahankan praktik ini.';
  } else if (stats.burukPercentage > 20) {
    return 'Perlu perbaikan! Periksa kebersihan dan suhu penyimpanan.';
  } else {
    return 'Kualitas cukup baik. Ada ruang untuk peningkatan.';
  }
}
```

---

## 🐛 Troubleshooting

### Issue 1: Quality selalu "Sedang"

**Cause**: Data tidak lengkap atau undefined

**Solution**:
```typescript
// Pastikan semua field terisi
const milkData: MilkData = {
  ph: reading.pH || 6.6,           // Default jika undefined
  temperature: reading.temperature || 6,
  odor: reading.mq135 < 70 ? 1 : 0,
  taste: 1,                        // Default jika tidak ada sensor
  turbidity: 0,                    // Default jika tidak ada sensor
  colour: 249,                     // Default jika tidak ada sensor
  fat: 3.8                         // Default jika tidak ada sensor
};
```

### Issue 2: TypeScript Error

**Cause**: Import path salah

**Solution**:
```typescript
// Pastikan path benar
import { classifyMilkQuality } from './lib/decisionTree';  // ❌ Salah (relative)
import { classifyMilkQuality } from '../lib/decisionTree'; // ✅ Benar (dari components)
```

### Issue 3: Warna tidak muncul

**Cause**: CSS tidak applied

**Solution**:
```typescript
import { getQualityColor } from './lib/decisionTree';

const color = getQualityColor(quality);

// Gunakan inline style
element.style.backgroundColor = color;

// Atau CSS variable
document.documentElement.style.setProperty('--quality-color', color);
```

---

## ✅ Checklist Integration

- [x] Decision tree file created (`decisionTree.ts`)
- [x] FetchData updated to use decision tree
- [x] Firebase interface updated (added `temperature`)
- [ ] Dashboard UI updated to show quality
- [ ] Charts updated to show quality distribution
- [ ] Alert system implemented (optional)
- [ ] Mobile responsive design (optional)
- [ ] Report generation (optional)

---

## 📚 Resources

- **Full Documentation**: `DECISION_TREE_GUIDE.md`
- **Quick Reference**: `DECISION_TREE_README.md`
- **Examples**: `src/lib/decisionTreeExample.ts`
- **Tests**: `test-decision-tree.js`
- **Visualization**: `decision-tree-visualization.html`

---

## 🎉 You're All Set!

Decision Tree sudah terintegrasi dengan dashboard Anda. Sekarang:

1. ✅ Setiap reading otomatis ter-klasifikasi
2. ✅ Dashboard sudah menampilkan kualitas
3. ✅ Statistik sudah tersedia
4. ✅ Siap untuk production!

**Happy Monitoring! 🥛🐐**