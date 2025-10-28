# 🚀 Quick Start Guide

Panduan cepat untuk memulai development Goat Milk Monitor.

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah menginstall:

- **Node.js** versi 18 atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**
- **Git** (optional, untuk version control)
- **VS Code** (recommended) dengan extension Astro

---

## ⚡ Setup dalam 5 Menit

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:4321`

### 3. Buka Browser

Akses `http://localhost:4321` dan Anda akan melihat dashboard!

---

## 🎯 Struktur Project

```
goat-milk-monitor/
├── src/
│   ├── components/       # Komponen reusable
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── Chart.astro
│   ├── layouts/          # Layout template
│   │   └── Layout.astro
│   ├── pages/            # Halaman website
│   │   ├── index.astro       # Dashboard utama
│   │   ├── charts.astro      # Contoh chart
│   │   └── components.astro  # Showcase komponen
│   └── styles/
│       └── global.css    # Tailwind CSS
├── public/               # Static files
└── dist/                 # Build output (generated)
```

---

## 📄 Halaman yang Tersedia

### 1. Dashboard (`/`)
- Overview statistik produksi susu
- Grafik produksi mingguan
- Distribusi kambing
- Aktivitas terkini

### 2. Chart Examples (`/charts`)
- 6 tipe grafik berbeda
- Line Chart
- Bar Chart
- Pie & Doughnut Chart
- Radar Chart
- Polar Area Chart
- Multi-line Chart

### 3. Components Showcase (`/components`)
- Card component dengan berbagai varian
- Button component dengan berbagai style
- Code examples

---

## 🛠️ Commands Penting

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run astro --help` | Lihat semua Astro commands |

---

## 🎨 Membuat Halaman Baru

1. Buat file baru di `src/pages/`, contoh: `about.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="About Us">
  <main class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold">About Us</h1>
    <p>Konten halaman di sini...</p>
  </main>
</Layout>
```

2. Akses di browser: `http://localhost:4321/about`

---

## 📊 Menambah Chart Baru

```astro
---
import Chart from '../components/Chart.astro';

const myData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 15, 22],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  }]
};
---

<Chart
  id="myChart"
  type="line"
  data={myData}
  height="300px"
/>
```

---

## 🎴 Menggunakan Card Component

```astro
---
import Card from '../components/Card.astro';
---

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card
    title="Total Users"
    value="1,234"
    icon="👥"
    color="blue"
    description="Active users"
  />
  
  <Card
    title="Revenue"
    value="$45,678"
    icon="💰"
    color="green"
    description="+12% from last month"
  />
  
  <Card
    title="Orders"
    value="567"
    icon="📦"
    color="purple"
    description="Pending: 23"
  />
</div>
```

---

## 🔘 Menggunakan Button Component

```astro
---
import Button from '../components/Button.astro';
---

<!-- Regular Button -->
<Button
  text="Save"
  variant="success"
  icon="💾"
/>

<!-- Button as Link -->
<Button
  text="View Details"
  href="/details"
  variant="primary"
  icon="👁️"
/>

<!-- Different Sizes -->
<Button text="Small" size="sm" variant="primary" />
<Button text="Medium" size="md" variant="primary" />
<Button text="Large" size="lg" variant="primary" />
```

---

## 🎨 Tailwind CSS

Project ini sudah ter-setup dengan Tailwind CSS v4. Gunakan utility classes:

```astro
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
  <h2 class="text-xl font-bold text-gray-900 mb-4">Title</h2>
  <p class="text-gray-600">Content here...</p>
</div>
```

### Warna Tema
- Blue: `bg-blue-600`, `text-blue-600`
- Green: `bg-green-600`, `text-green-600`
- Yellow: `bg-yellow-600`, `text-yellow-600`
- Purple: `bg-purple-600`, `text-purple-600`
- Red: `bg-red-600`, `text-red-600`
- Gray: `bg-gray-600`, `text-gray-600`

---

## 🔧 Customization

### Mengubah Warna Tema

Edit file `src/styles/global.css` untuk menambah custom CSS:

```css
@import "tailwindcss";

/* Custom styles */
.my-custom-class {
  /* your styles */
}
```

### Mengubah Data Chart

Edit data di `src/pages/index.astro`:

```javascript
const productionData = {
  labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  datasets: [{
    label: 'Produksi Susu (Liter)',
    data: [12, 15, 13, 18, 16, 20, 14], // ← Edit ini
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  }]
};
```

---

## 🐛 Troubleshooting

### Port sudah digunakan?

```bash
# Gunakan port lain
npm run dev -- --port 3000
```

### Node modules bermasalah?

```bash
# Hapus dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Build error?

```bash
# Check TypeScript errors
npx astro check

# Clear cache dan rebuild
rm -rf .astro dist
npm run build
```

### Chart tidak muncul?

1. Pastikan ID chart unique
2. Check browser console untuk error
3. Verifikasi format data sesuai Chart.js
4. Restart development server

---

## 📚 Resources

### Documentation
- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Docs](https://www.chartjs.org/docs)

### Project Files
- `README.md` - Overview project
- `COMPONENTS.md` - Dokumentasi komponen lengkap
- `DEPLOYMENT.md` - Panduan deployment

### Links
- [Astro Discord](https://astro.build/chat)
- [Tailwind Play](https://play.tailwindcss.com)
- [Chart.js Samples](https://www.chartjs.org/docs/latest/samples)

---

## 💡 Tips & Tricks

### 1. Hot Reload
Astro automatically reloads saat Anda save file. Tidak perlu refresh manual!

### 2. TypeScript Support
Gunakan TypeScript untuk type safety:

```typescript
interface Props {
  title: string;
  count: number;
}

const { title, count } = Astro.props;
```

### 3. Component Composition
Kombinasikan komponen untuk hasil yang powerful:

```astro
<div class="grid grid-cols-3 gap-6">
  <Card title="Metric 1" value="100" color="blue">
    <Button text="Details" href="/details" size="sm" />
  </Card>
</div>
```

### 4. Performance
- Astro menghasilkan zero-JS by default
- Charts di-load hanya saat dibutuhkan
- Images otomatis di-optimize

### 5. VS Code Extensions
Install extensions yang recommended di `.vscode/extensions.json`

---

## 🎯 Next Steps

1. ✅ Explore semua halaman (`/`, `/charts`, `/components`)
2. ✅ Baca `COMPONENTS.md` untuk detail komponen
3. ✅ Customisasi data sesuai kebutuhan Anda
4. ✅ Tambahkan halaman baru
5. ✅ Deploy ke production (lihat `DEPLOYMENT.md`)

---

## 📧 Need Help?

- Check `README.md` untuk info general
- Check `COMPONENTS.md` untuk dokumentasi komponen
- Check `DEPLOYMENT.md` untuk panduan deploy
- Create issue di GitHub repository

---

**Happy Coding!** 🚀🐐

Made with ❤️ using Astro, Tailwind CSS, and Chart.js