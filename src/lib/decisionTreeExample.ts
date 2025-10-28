/**
 * Contoh Penggunaan Decision Tree Classifier untuk Klasifikasi Kualitas Susu
 *
 * File ini berisi contoh-contoh penggunaan dan penjelasan tentang
 * bagaimana decision tree bekerja untuk mengklasifikasikan kualitas susu
 */

import {
  classifyMilkQuality,
  getQualityScore,
  getQualityColor,
  getQualityRecommendation,
  classifyBatch,
  getQualityStatistics,
  type MilkData,
  type QualityClass
} from './decisionTree';

/**
 * CONTOH 1: Klasifikasi Susu Berkualitas BAIK
 *
 * Kriteria susu berkualitas baik:
 * - pH: 6.5-6.8 (optimal untuk susu kambing)
 * - Temperature: 4-8°C (penyimpanan dingin yang baik)
 * - Taste: 1 (rasa segar)
 * - Odor: 1 (bau segar, tidak tengik)
 * - Fat: >3.5% (kandungan lemak baik)
 * - Turbidity: 0 (jernih, tidak keruh)
 * - Colour: 255 (putih bersih)
 */
export function contohSusuBaik() {
  const susuBaik: MilkData = {
    ph: 6.6,           // pH optimal
    temperature: 6,     // Suhu penyimpanan baik (4-8°C)
    taste: 1,          // Rasa segar
    odor: 1,           // Bau segar
    fat: 3.8,          // Kandungan lemak baik
    turbidity: 0,      // Jernih
    colour: 250        // Putih bersih
  };

  const quality = classifyMilkQuality(susuBaik);
  console.log('Hasil Klasifikasi Susu Baik:');
  console.log('- Kualitas:', quality); // Output: "Baik"
  console.log('- Skor:', getQualityScore(quality)); // Output: 85
  console.log('- Warna:', getQualityColor(quality)); // Output: "#10b981"
  console.log('- Rekomendasi:', getQualityRecommendation(quality));

  return quality;
}

/**
 * CONTOH 2: Klasifikasi Susu Berkualitas SEDANG
 *
 * Kriteria susu berkualitas sedang:
 * - pH: 6.2-6.9 (masih dalam range acceptable tapi tidak optimal)
 * - Temperature: 8-15°C (kurang dingin)
 * - Taste: 0 (rasa agak asam)
 * - Odor: 0 (bau kurang segar)
 * - Fat: 2.5-3.5% (kandungan lemak sedang)
 * - Turbidity: 1 (sedikit keruh)
 * - Colour: 240-254 (agak kekuningan)
 */
export function contohSusuSedang() {
  const susuSedang: MilkData = {
    ph: 6.3,           // pH di batas bawah
    temperature: 10,    // Suhu kurang dingin
    taste: 0,          // Rasa agak asam
    odor: 0,           // Bau kurang segar
    fat: 3.0,          // Kandungan lemak sedang
    turbidity: 1,      // Sedikit keruh
    colour: 245        // Agak kekuningan
  };

  const quality = classifyMilkQuality(susuSedang);
  console.log('Hasil Klasifikasi Susu Sedang:');
  console.log('- Kualitas:', quality); // Output: "Sedang"
  console.log('- Skor:', getQualityScore(quality)); // Output: 60
  console.log('- Warna:', getQualityColor(quality)); // Output: "#f59e0b"
  console.log('- Rekomendasi:', getQualityRecommendation(quality));

  return quality;
}

/**
 * CONTOH 3: Klasifikasi Susu Berkualitas BURUK
 *
 * Kriteria susu berkualitas buruk:
 * - pH: <6.0 atau >7.2 (terlalu asam atau terlalu basa)
 * - Temperature: >15°C (terlalu hangat, bakteri berkembang)
 * - Taste: -1 (rasa sangat asam/busuk)
 * - Odor: -1 (bau tengik/busuk)
 * - Fat: <2.5% (kandungan lemak rendah)
 * - Turbidity: 2+ (sangat keruh)
 * - Colour: <240 (kekuningan/kotor)
 */
export function contohSusuBuruk() {
  const susuBuruk: MilkData = {
    ph: 5.8,           // pH terlalu asam
    temperature: 18,    // Suhu terlalu hangat
    taste: -1,         // Rasa sangat asam
    odor: -1,          // Bau tengik
    fat: 2.0,          // Kandungan lemak rendah
    turbidity: 2,      // Sangat keruh
    colour: 230        // Kekuningan
  };

  const quality = classifyMilkQuality(susuBuruk);
  console.log('Hasil Klasifikasi Susu Buruk:');
  console.log('- Kualitas:', quality); // Output: "Buruk"
  console.log('- Skor:', getQualityScore(quality)); // Output: 30
  console.log('- Warna:', getQualityColor(quality)); // Output: "#ef4444"
  console.log('- Rekomendasi:', getQualityRecommendation(quality));

  return quality;
}

/**
 * CONTOH 4: Klasifikasi Batch (Banyak Data Sekaligus)
 *
 * Mengklasifikasikan banyak sampel susu sekaligus
 */
export function contohKlasifikasiBatch() {
  const sampelSusu: MilkData[] = [
    // Susu 1 - Baik
    {
      ph: 6.6,
      temperature: 6,
      taste: 1,
      odor: 1,
      fat: 3.8,
      turbidity: 0,
      colour: 250
    },
    // Susu 2 - Sedang
    {
      ph: 6.3,
      temperature: 10,
      taste: 0,
      odor: 0,
      fat: 3.0,
      turbidity: 1,
      colour: 245
    },
    // Susu 3 - Buruk
    {
      ph: 5.8,
      temperature: 18,
      taste: -1,
      odor: -1,
      fat: 2.0,
      turbidity: 2,
      colour: 230
    },
    // Susu 4 - Baik
    {
      ph: 6.7,
      temperature: 5,
      taste: 1,
      odor: 1,
      fat: 4.0,
      turbidity: 0,
      colour: 255
    },
    // Susu 5 - Sedang
    {
      ph: 6.4,
      temperature: 12,
      taste: 0,
      odor: 0,
      fat: 2.8,
      turbidity: 1,
      colour: 240
    }
  ];

  const hasil = classifyBatch(sampelSusu);

  console.log('Hasil Klasifikasi Batch:');
  hasil.forEach((result, index) => {
    console.log(`\nSusu ${index + 1}:`);
    console.log('  Kualitas:', result.quality);
    console.log('  Skor:', result.score);
    console.log('  Warna:', result.color);
    console.log('  Rekomendasi:', result.recommendation);
  });

  return hasil;
}

/**
 * CONTOH 5: Mendapatkan Statistik Kualitas
 *
 * Menghitung statistik kualitas dari banyak sampel
 */
export function contohStatistikKualitas() {
  const sampelSusu: MilkData[] = [
    { ph: 6.6, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 },
    { ph: 6.7, temperature: 5, taste: 1, odor: 1, fat: 4.0, turbidity: 0, colour: 255 },
    { ph: 6.5, temperature: 7, taste: 1, odor: 1, fat: 3.9, turbidity: 0, colour: 252 },
    { ph: 6.3, temperature: 10, taste: 0, odor: 0, fat: 3.0, turbidity: 1, colour: 245 },
    { ph: 6.4, temperature: 12, taste: 0, odor: 0, fat: 2.8, turbidity: 1, colour: 240 },
    { ph: 5.8, temperature: 18, taste: -1, odor: -1, fat: 2.0, turbidity: 2, colour: 230 },
    { ph: 7.3, temperature: 20, taste: -1, odor: -1, fat: 1.8, turbidity: 3, colour: 220 }
  ];

  const stats = getQualityStatistics(sampelSusu);

  console.log('Statistik Kualitas Susu:');
  console.log('Total Sampel:', stats.total);
  console.log('\nJumlah:');
  console.log('  Baik:', stats.baik);
  console.log('  Sedang:', stats.sedang);
  console.log('  Buruk:', stats.buruk);
  console.log('\nPersentase:');
  console.log('  Baik:', stats.baikPercentage.toFixed(1) + '%');
  console.log('  Sedang:', stats.sedangPercentage.toFixed(1) + '%');
  console.log('  Buruk:', stats.burukPercentage.toFixed(1) + '%');

  return stats;
}

/**
 * CONTOH 6: Mengintegrasikan dengan Data dari Sensor
 *
 * Contoh konversi data dari sensor ke format MilkData
 */
export function contohDataDariSensor() {
  // Simulasi data dari sensor
  const sensorData = {
    pH: 6.6,
    temperature: 6.5,
    mq135: 65,          // Air quality sensor
    rgb: "245,250,252", // RGB color sensor
    timestamp: Date.now()
  };

  // Konversi ke format MilkData
  const rgbValues = sensorData.rgb.split(',').map(v => parseInt(v.trim()));
  const avgColour = Math.round((rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3);

  const milkData: MilkData = {
    ph: sensorData.pH,
    temperature: sensorData.temperature,
    // MQ135 mapping: <70 = fresh (1), 70-100 = sedang (0), >100 = buruk (-1)
    odor: sensorData.mq135 < 70 ? 1 : sensorData.mq135 < 100 ? 0 : -1,
    // Taste based on pH
    taste: sensorData.pH >= 6.4 && sensorData.pH <= 6.7 ? 1 :
           sensorData.pH >= 6.2 && sensorData.pH <= 6.9 ? 0 : -1,
    turbidity: 0, // Jika ada sensor turbidity, gunakan nilai sensor
    colour: avgColour,
    fat: 3.8 // Default, atau dari sensor jika ada
  };

  const quality = classifyMilkQuality(milkData);

  console.log('Data dari Sensor:');
  console.log('  pH:', sensorData.pH);
  console.log('  Temperature:', sensorData.temperature, '°C');
  console.log('  MQ135:', sensorData.mq135);
  console.log('  RGB:', sensorData.rgb);
  console.log('\nHasil Klasifikasi:', quality);
  console.log('Rekomendasi:', getQualityRecommendation(quality));

  return { milkData, quality };
}

/**
 * CONTOH 7: Penggunaan di Dashboard Real-time
 *
 * Contoh fungsi untuk update dashboard secara real-time
 */
export function updateDashboardWithQuality(readings: any[]) {
  const milkDataArray: MilkData[] = readings.map(reading => {
    const rgbValues = reading.rgb.split(',').map((v: string) => parseInt(v.trim()));
    const avgColour = Math.round((rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3);

    return {
      ph: reading.pH,
      temperature: reading.temperature,
      odor: reading.mq135 < 70 ? 1 : reading.mq135 < 100 ? 0 : -1,
      taste: reading.pH >= 6.4 && reading.pH <= 6.7 ? 1 :
             reading.pH >= 6.2 && reading.pH <= 6.9 ? 0 : -1,
      turbidity: 0,
      colour: avgColour,
      fat: 3.8
    };
  });

  // Dapatkan statistik
  const stats = getQualityStatistics(milkDataArray);

  // Update UI dashboard
  console.log('Update Dashboard:');
  console.log(`Kualitas Baik: ${stats.baik} (${stats.baikPercentage.toFixed(1)}%)`);
  console.log(`Kualitas Sedang: ${stats.sedang} (${stats.sedangPercentage.toFixed(1)}%)`);
  console.log(`Kualitas Buruk: ${stats.buruk} (${stats.burukPercentage.toFixed(1)}%)`);

  return stats;
}

/**
 * CARA PENGGUNAAN DECISION TREE:
 *
 * 1. Import fungsi yang diperlukan:
 *    import { classifyMilkQuality, getQualityScore } from './decisionTree';
 *
 * 2. Siapkan data susu:
 *    const data = { ph: 6.6, temperature: 6, taste: 1, ... };
 *
 * 3. Klasifikasi:
 *    const quality = classifyMilkQuality(data);
 *
 * 4. Dapatkan informasi tambahan:
 *    const score = getQualityScore(quality);
 *    const color = getQualityColor(quality);
 *    const recommendation = getQualityRecommendation(quality);
 *
 * KEUNGGULAN DECISION TREE:
 *
 * ✓ Mudah dipahami dan diinterpretasi
 * ✓ Dapat menangani data numerik dan kategorikal
 * ✓ Tidak memerlukan normalisasi data
 * ✓ Dapat menangani missing values
 * ✓ Cepat dalam prediksi
 * ✓ Dapat memvisualisasikan proses keputusan
 *
 * PARAMETER KUALITAS SUSU:
 *
 * 1. pH (6.5-6.8 optimal)
 *    - Mengukur keasaman susu
 *    - Susu segar: pH sekitar 6.6
 *    - pH turun jika susu mulai asam
 *
 * 2. Temperature (4-8°C optimal)
 *    - Suhu penyimpanan
 *    - Rendah = pertumbuhan bakteri lambat
 *    - Tinggi = susu cepat rusak
 *
 * 3. Taste (1=fresh, 0=medium, -1=bad)
 *    - Rasa susu
 *    - Fresh: manis sedikit
 *    - Bad: asam/pahit
 *
 * 4. Odor (1=fresh, 0=medium, -1=bad)
 *    - Bau susu
 *    - Fresh: bau segar
 *    - Bad: tengik/busuk
 *
 * 5. Fat (>3.5% baik)
 *    - Kandungan lemak
 *    - Susu kambing: 3.5-4.5%
 *    - Tinggi = kualitas baik
 *
 * 6. Turbidity (0=clear, 1=medium, 2+=cloudy)
 *    - Kekeruhan
 *    - Clear: baik
 *    - Cloudy: kontaminasi
 *
 * 7. Colour (255=white, <240=yellowish)
 *    - Warna
 *    - Putih bersih: baik
 *    - Kekuningan: mungkin rusak
 */

// Export semua contoh sebagai satu objek
export const decisionTreeExamples = {
  contohSusuBaik,
  contohSusuSedang,
  contohSusuBuruk,
  contohKlasifikasiBatch,
  contohStatistikKualitas,
  contohDataDariSensor,
  updateDashboardWithQuality
};

// Jalankan semua contoh jika file dijalankan langsung
if (typeof window !== 'undefined') {
  console.log('=== CONTOH PENGGUNAAN DECISION TREE ===\n');

  console.log('1. SUSU BERKUALITAS BAIK');
  console.log('---');
  contohSusuBaik();

  console.log('\n\n2. SUSU BERKUALITAS SEDANG');
  console.log('---');
  contohSusuSedang();

  console.log('\n\n3. SUSU BERKUALITAS BURUK');
  console.log('---');
  contohSusuBuruk();

  console.log('\n\n4. KLASIFIKASI BATCH');
  console.log('---');
  contohKlasifikasiBatch();

  console.log('\n\n5. STATISTIK KUALITAS');
  console.log('---');
  contohStatistikKualitas();

  console.log('\n\n6. DATA DARI SENSOR');
  console.log('---');
  contohDataDariSensor();
}
