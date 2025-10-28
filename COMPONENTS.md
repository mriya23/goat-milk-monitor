# 📦 Dokumentasi Komponen

Dokumentasi lengkap untuk semua komponen yang tersedia di Goat Milk Monitor.

---

## 📊 Chart Component

Komponen untuk membuat grafik interaktif menggunakan Chart.js.

### Location
`src/components/Chart.astro`

### Import
```astro
---
import Chart from '../components/Chart.astro';
---
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | ✅ Yes | - | ID unik untuk canvas element |
| `type` | `'line' \| 'bar' \| 'pie' \| 'doughnut' \| 'radar' \| 'polarArea'` | ❌ No | `'line'` | Tipe grafik yang akan ditampilkan |
| `data` | `object` | ✅ Yes | - | Data untuk grafik (format Chart.js) |
| `options` | `object` | ❌ No | `{}` | Opsi konfigurasi Chart.js |
| `height` | `string` | ❌ No | `'400px'` | Tinggi container grafik |

### Example Usage

#### Line Chart
```astro
---
const lineData = {
  labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  datasets: [{
    label: 'Produksi Susu (Liter)',
    data: [12, 15, 13, 18, 16, 20, 14],
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4,
    fill: true
  }]
};
---

<Chart
  id="productionChart"
  type="line"
  data={lineData}
  height="350px"
/>
```

#### Bar Chart
```astro
---
const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [{
    label: 'Sales',
    data: [65, 59, 80, 81],
    backgroundColor: 'rgba(59, 130, 246, 0.8)'
  }]
};
---

<Chart
  id="barChart"
  type="bar"
  data={barData}
/>
```

#### Pie/Doughnut Chart
```astro
---
const pieData = {
  labels: ['Kambing Laktasi', 'Kambing Hamil', 'Kambing Muda'],
  datasets: [{
    data: [25, 15, 30],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)'
    ]
  }]
};
---

<Chart
  id="distribution"
  type="doughnut"
  data={pieData}
  height="300px"
/>
```

### Custom Options
```astro
---
const customOptions = {
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Custom Chart Title'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
---

<Chart
  id="customChart"
  type="line"
  data={lineData}
  options={customOptions}
/>
```

---

## 🎴 Card Component

Komponen kartu statistik dengan icon dan warna yang dapat dikustomisasi.

### Location
`src/components/Card.astro`

### Import
```astro
---
import Card from '../components/Card.astro';
---
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ Yes | - | Judul kartu |
| `value` | `string \| number` | ✅ Yes | - | Nilai utama yang ditampilkan |
| `icon` | `string` | ❌ No | `'📊'` | Icon emoji atau karakter |
| `color` | `'blue' \| 'green' \| 'yellow' \| 'purple' \| 'red' \| 'indigo'` | ❌ No | `'blue'` | Tema warna kartu |
| `description` | `string` | ❌ No | - | Deskripsi tambahan di bawah nilai |

### Example Usage

#### Basic Card
```astro
<Card
  title="Total Kambing"
  value="80"
  icon="🐐"
  color="blue"
/>
```

#### Card with Description
```astro
<Card
  title="Produksi Hari Ini"
  value="18L"
  icon="🥛"
  color="green"
  description="Naik 12% dari kemarin"
/>
```

#### Multiple Cards in Grid
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card
    title="Total Kambing"
    value="80"
    icon="🐐"
    color="blue"
  />
  
  <Card
    title="Produksi Hari Ini"
    value="18L"
    icon="✅"
    color="green"
  />
  
  <Card
    title="Rata-rata Minggu Ini"
    value="15.4L"
    icon="📈"
    color="yellow"
  />
  
  <Card
    title="Kambing Laktasi"
    value="25"
    icon="❤️"
    color="purple"
  />
</div>
```

### Color Variants
- `blue` - Biru (default)
- `green` - Hijau
- `yellow` - Kuning
- `purple` - Ungu
- `red` - Merah
- `indigo` - Indigo

---

## 🔘 Button Component

Komponen tombol yang dapat dikustomisasi dengan berbagai varian dan ukuran.

### Location
`src/components/Button.astro`

### Import
```astro
---
import Button from '../components/Button.astro';
---
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `string` | ✅ Yes | - | Teks tombol |
| `href` | `string` | ❌ No | - | URL tujuan (render sebagai link) |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'ghost'` | ❌ No | `'primary'` | Varian warna tombol |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ No | `'md'` | Ukuran tombol |
| `type` | `'button' \| 'submit' \| 'reset'` | ❌ No | `'button'` | Tipe tombol HTML |
| `class` | `string` | ❌ No | `''` | Class CSS tambahan |
| `icon` | `string` | ❌ No | - | Icon emoji atau karakter |

### Example Usage

#### Primary Button
```astro
<Button
  text="Simpan Data"
  variant="primary"
/>
```

#### Button as Link
```astro
<Button
  text="Lihat Detail"
  href="/detail"
  variant="primary"
  icon="👁️"
/>
```

#### Different Variants
```astro
<div class="flex gap-4">
  <Button text="Primary" variant="primary" />
  <Button text="Secondary" variant="secondary" />
  <Button text="Success" variant="success" />
  <Button text="Danger" variant="danger" />
  <Button text="Warning" variant="warning" />
  <Button text="Ghost" variant="ghost" />
</div>
```

#### Different Sizes
```astro
<div class="flex items-center gap-4">
  <Button text="Small" size="sm" />
  <Button text="Medium" size="md" />
  <Button text="Large" size="lg" />
</div>
```

#### Button with Icon
```astro
<Button
  text="Tambah Kambing"
  icon="➕"
  variant="success"
  size="lg"
/>
```

#### Submit Button in Form
```astro
<form>
  <!-- form fields -->
  <Button
    text="Submit"
    type="submit"
    variant="primary"
    icon="✓"
  />
</form>
```

### Variant Colors
- `primary` - Biru (default)
- `secondary` - Abu-abu
- `success` - Hijau
- `danger` - Merah
- `warning` - Kuning
- `ghost` - Transparan dengan border

---

## 🎨 Layout Component

Layout utama aplikasi dengan konfigurasi HTML head dan styling global.

### Location
`src/layouts/Layout.astro`

### Import
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Judul Halaman">
  <!-- Konten halaman -->
</Layout>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ❌ No | `'Goat Milk Monitor'` | Judul halaman (untuk `<title>` tag) |

### Example Usage

#### Basic Page
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Dashboard">
  <main class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <p>Konten halaman di sini...</p>
  </main>
</Layout>
```

#### Page with Custom Title
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Detail Kambing - Goat Milk Monitor">
  <main>
    <!-- Konten -->
  </main>
</Layout>
```

### Features
- ✅ Responsive viewport meta tag
- ✅ Tailwind CSS global import
- ✅ Default background gradient
- ✅ SEO-friendly structure
- ✅ Favicon support

---

## 🎯 Best Practices

### 1. Chart Component
- Selalu gunakan ID yang unik untuk setiap chart
- Gunakan warna yang konsisten dengan tema aplikasi
- Pertimbangkan ukuran data untuk performa optimal
- Tambahkan labels yang jelas dan deskriptif

### 2. Card Component
- Gunakan icon yang relevan dengan konten
- Pilih warna yang sesuai dengan makna data (hijau = positif, merah = perhatian)
- Keep nilai tetap simple dan mudah dibaca
- Gunakan grid layout untuk tata letak yang rapi

### 3. Button Component
- Gunakan variant yang sesuai dengan action (danger untuk delete, success untuk save)
- Tambahkan icon untuk meningkatkan UX
- Gunakan size yang konsisten dalam satu area
- Pertimbangkan accessibility dengan text yang jelas

### 4. Performance Tips
- Lazy load charts jika ada banyak grafik dalam satu halaman
- Batasi jumlah data points untuk grafik yang kompleks
- Gunakan SSR (Server Side Rendering) Astro untuk performa optimal
- Compress images dan assets

---

## 🔧 Customization

### Menambah Warna Baru di Card
Edit `src/components/Card.astro`:
```astro
const colorClasses = {
  // ... existing colors
  teal: 'bg-teal-100 text-teal-600',
  pink: 'bg-pink-100 text-pink-600',
};

const textColorClasses = {
  // ... existing colors
  teal: 'text-teal-600',
  pink: 'text-pink-600',
};
```

### Menambah Chart Type Baru
Chart.js mendukung lebih banyak tipe grafik. Tambahkan di Props:
```typescript
type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble';
```

### Custom Tailwind Classes
Semua komponen mendukung prop `class` untuk menambahkan Tailwind classes:
```astro
<Card
  title="Custom"
  value="100"
  class="shadow-2xl border-4 border-blue-500"
/>
```

---

## 📚 Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [Astro Component Props](https://docs.astro.build/en/core-concepts/astro-components/#component-props)

---

## 🐛 Troubleshooting

### Chart tidak muncul
- Pastikan ID chart unique
- Check console untuk error
- Verifikasi format data sesuai Chart.js schema
- Pastikan Chart.js sudah terinstall: `npm list chart.js`

### Tailwind classes tidak bekerja
- Pastikan `global.css` sudah di-import di Layout
- Check `astro.config.mjs` sudah include Tailwind plugin
- Restart dev server: `npm run dev`

### TypeScript errors
- Pastikan interface Props sudah didefinisikan dengan benar
- Check tsconfig.json configuration
- Run: `npx astro check` untuk validasi

---

**Last Updated:** 2024
**Version:** 1.0.0