# 🐐 Sistem Monitoring Kelayakan Konsumsi Susu Kambing Berbasis IoT

Proyek ini merupakan **sistem monitoring real-time** untuk mengevaluasi **kelayakan konsumsi susu kambing** berdasarkan parameter kualitas seperti **pH, kadar gas (MQ-135), dan warna (TCS3200)**. Sistem ini dirancang sebagai bagian dari tugas akhir untuk menyelesaikan studi di **Telkom University Purwokerto**.

## 🎯 Tujuan

- Memantau kualitas susu kambing secara **real-time** melalui sensor IoT.
- Mengklasifikasikan kelayakan konsumsi susu menggunakan **Decision Tree Classifier**.
- Menyajikan data sensor dalam bentuk dashboard web yang **interaktif dan informatif**.
- Menampilkan klasifikasi kualitas susu: **Baik, Sedang, dan Buruk**.

## 🧩 Arsitektur Sistem

- **Sensor**: pH, MQ-135, TCS3200
- **Perangkat**: ESP32
- **Backend**: Firebase Realtime Database
- **Frontend**: Astro, TypeScript, HTML, CSS (Chart.js, Firebase SDK)
- **Metode Klasifikasi**: Decision Tree (7 parameter kualitas susu)

## ✨ Fitur Utama

- [x] Dashboard real-time untuk menampilkan data sensor
- [x] **Klasifikasi Kualitas dengan Decision Tree** (Baik/Sedang/Buruk)
- [x] Grafik tren data (pH & MQ-135)
- [x] **Distribusi kualitas susu** dengan chart interaktif
- [x] Sistem notifikasi real-time
- [x] **Statistik kualitas** dengan persentase
- [x] **Rekomendasi tindakan** berdasarkan kualitas
- [x] Halaman laporan historis
- [x] Sinkronisasi waktu lokal browser
- [x] Penyimpanan data historis ke `localStorage`
- [x] Integrasi Firebase untuk sinkronisasi data
- [x] Tampilan antarmuka yang responsif dan profesional

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Astro, TypeScript, HTML5, CSS3
- **Library**: Chart.js, Firebase JavaScript SDK
- **Backend**: Firebase Realtime Database
- **Machine Learning**: Decision Tree Classifier (7 parameters)
- **Hardware**: ESP32, Sensor pH, MQ-135, TCS3200, Sensor Suhu
- **IDE**: Arduino IDE, VS Code
- **Version Control**: Git & GitHub

## 🌳 Decision Tree Classifier

Sistem ini menggunakan **Decision Tree Classifier** untuk mengklasifikasikan kualitas susu berdasarkan 7 parameter:

### Parameter Kualitas
1. **pH** - Tingkat keasaman (optimal: 6.5-6.8)
2. **Temperature** - Suhu penyimpanan (optimal: 4-8°C)
3. **Taste** - Rasa susu (1=segar, 0=sedang, -1=buruk)
4. **Odor** - Bau susu (1=segar, 0=sedang, -1=tengik)
5. **Fat** - Kandungan lemak (optimal: ≥3.5%)
6. **Turbidity** - Kekeruhan (0=jernih, 1=keruh, 2+=sangat keruh)
7. **Colour** - Warna (optimal: 245-255, putih bersih)

### Kategori Klasifikasi
- 🟢 **Baik** (Skor: 85) - Layak konsumsi, kualitas optimal
- 🟡 **Sedang** (Skor: 60) - Layak konsumsi, segera gunakan
- 🔴 **Buruk** (Skor: 30) - Tidak layak konsumsi

### Dokumentasi Decision Tree
- 📚 **Panduan Lengkap**: [DECISION_TREE_GUIDE.md](DECISION_TREE_GUIDE.md)
- 🚀 **Quick Reference**: [DECISION_TREE_README.md](DECISION_TREE_README.md)
- 🔌 **Integration Guide**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- 📊 **Summary**: [DECISION_TREE_SUMMARY.md](DECISION_TREE_SUMMARY.md)
- 🎨 **Visualization**: [decision-tree-visualization.html](decision-tree-visualization.html)

### Test Results
- ✅ **100% Test Success Rate**
- ✅ 9 unit tests passed
- ✅ Batch processing tested (7 samples)
- ✅ Parameter boundaries validated

```bash
# Run tests
node test-decision-tree.js
```
