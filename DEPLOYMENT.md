# 🚀 Deployment Guide

Panduan lengkap untuk deploy aplikasi Goat Milk Monitor ke berbagai platform hosting.

---

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

- ✅ Project berhasil build tanpa error: `npm run build`
- ✅ Semua dependencies sudah terinstall
- ✅ File `.env` (jika ada) tidak di-commit ke repository
- ✅ Testing lokal sudah selesai: `npm run preview`
- ✅ Git repository sudah di-push ke GitHub/GitLab

---

## 🌐 Platform Deployment

### 1. Vercel (Recommended)

**Paling mudah dan cepat untuk Astro projects**

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Klik "New Project"
3. Import repository dari GitHub
4. Vercel akan auto-detect Astro project
5. Klik "Deploy"

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify

**Great untuk static sites dengan continuous deployment**

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Via Netlify Dashboard

1. Buka [netlify.com](https://netlify.com)
2. Klik "Add new site" → "Import an existing project"
3. Connect ke Git provider (GitHub/GitLab)
4. Pilih repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

#### netlify.toml (Optional)

Buat file `netlify.toml` di root project:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. Cloudflare Pages

**Free dengan unlimited bandwidth**

#### Via Wrangler CLI

```bash
# Install Wrangler
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish dist
```

#### Via Cloudflare Dashboard

1. Login ke [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to "Pages" → "Create a project"
3. Connect Git repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Save and Deploy

---

### 4. GitHub Pages

**Free hosting untuk GitHub repositories**

#### Setup

1. Install adapter:
```bash
npm install -D @astrojs/static
```

2. Update `astro.config.mjs`:
```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'https://username.github.io',
  base: '/goat-milk-monitor', // repository name
  vite: {
    plugins: [tailwindcss()],
  },
});
```

3. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

4. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Save

---

### 5. AWS S3 + CloudFront

**Untuk enterprise deployment**

#### Build dan Upload

```bash
# Build project
npm run build

# Install AWS CLI
# Download from: https://aws.amazon.com/cli/

# Configure AWS
aws configure

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### 6. DigitalOcean App Platform

1. Login ke DigitalOcean
2. Go to App Platform
3. Create New App
4. Connect GitHub repository
5. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy

---

## ⚙️ Environment Variables

Jika menggunakan environment variables:

### Vercel
```bash
vercel env add VARIABLE_NAME
```

### Netlify
Tambahkan di: Site settings → Environment variables

### Cloudflare Pages
Tambahkan di: Settings → Environment variables

### GitHub Actions
Tambahkan di: Settings → Secrets and variables → Actions

---

## 🔧 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records di domain provider

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS

### Cloudflare Pages
1. Go to Custom domains
2. Add domain (automatic if using Cloudflare DNS)

---

## 📊 Performance Optimization

### Before Deployment

1. **Optimize Images**
```bash
# Install image optimization tools
npm install -D @astrojs/image
```

2. **Minify CSS/JS** (Astro already does this by default)

3. **Check Bundle Size**
```bash
npm run build
# Check dist folder size
```

4. **Enable Compression**
Most platforms enable Gzip/Brotli automatically

### Astro Optimizations

Update `astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'terser'
    }
  },
});
```

---

## 🧪 Testing Deployment

### Local Preview
```bash
npm run build
npm run preview
```

### Test URLs
- Check all pages load correctly
- Test chart functionality
- Verify responsive design
- Check console for errors
- Test navigation links

### Performance Testing
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

---

## 🔄 Continuous Deployment

### Automatic Deployment on Push

Most platforms support automatic deployment:

1. **Connect Git Repository**
2. **Configure Build Settings**
3. **Push to main branch**
4. **Auto-deploy triggers**

### Preview Deployments

Platforms like Vercel and Netlify create preview URLs for pull requests automatically.

---

## 📈 Monitoring & Analytics

### Add Analytics

**Google Analytics:**
Add to `Layout.astro`:
```astro
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to pages:
```astro
---
import { Analytics } from '@vercel/analytics/react';
---

<Analytics />
```

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** `npm run build` fails
**Solution:**
- Check Node.js version (18+ required)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npx astro check`

### 404 Errors

**Problem:** Pages not found after deployment
**Solution:**
- Verify `dist` folder contains HTML files
- Check base path in `astro.config.mjs`
- Configure redirects (for SPA-like behavior)

### Charts Not Loading

**Problem:** Charts don't appear on production
**Solution:**
- Check browser console for errors
- Verify Chart.js is in dependencies (not devDependencies)
- Ensure unique chart IDs
- Check network tab for failed requests

### Styling Issues

**Problem:** Tailwind styles not working
**Solution:**
- Verify `global.css` is imported in Layout
- Check `astro.config.mjs` has Tailwind plugin
- Clear build cache and rebuild

---

## 📝 Deployment Checklist

- [ ] Build succeeds locally
- [ ] All pages load correctly
- [ ] Charts render properly
- [ ] Responsive design works
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Custom domain setup (if needed)
- [ ] SSL certificate active
- [ ] Analytics installed
- [ ] Performance tested
- [ ] SEO meta tags added
- [ ] Favicon present

---

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Use `.env` for secrets
   - Add `.env` to `.gitignore`

2. **Use HTTPS**
   - All modern platforms provide free SSL

3. **Keep dependencies updated**
```bash
npm audit
npm update
```

4. **Enable security headers**
   - Configure via platform settings or `netlify.toml`/`vercel.json`

---

## 💡 Tips

1. **Use Preview Deployments** - Test changes before production
2. **Monitor Build Times** - Optimize if builds take too long
3. **Set up Notifications** - Get alerts for failed deployments
4. **Document Changes** - Keep deployment notes for your team
5. **Backup Regularly** - Keep Git repository updated

---

## 📞 Support

### Platform Support
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [answers.netlify.com](https://answers.netlify.com)
- **Cloudflare:** [community.cloudflare.com](https://community.cloudflare.com)

### Astro Resources
- [Astro Docs - Deployment](https://docs.astro.build/en/guides/deploy/)
- [Astro Discord](https://astro.build/chat)

---

**Last Updated:** 2024
**Project:** Goat Milk Monitor v1.0.0

Happy Deploying! 🚀