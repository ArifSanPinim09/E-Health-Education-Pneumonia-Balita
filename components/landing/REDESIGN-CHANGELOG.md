# Changelog Redesign Landing Page

## Tanggal: 6 Maret 2026

### 🎨 Design Direction Baru

Mengubah dari template SaaS startup menjadi platform edukasi kesehatan institutional yang warm dan trustable.

### ✅ Perubahan Utama

#### 1. Color System Baru
- ❌ Hapus: Biru neon (#2563EB), gradient biru-putih
- ✅ Gunakan: 
  - Primary: `#2F5D50` (Deep Sage)
  - Secondary: `#F4F7F5` (Warm Off White)
  - Accent: `#E07A5F` (Soft Coral)
  - Text: `#1F2933`

#### 2. Hero Section
**Sebelum:**
- Grid 2 kolom dengan box rotasi
- Gradient background biru
- Badge dengan icon
- CTA dengan glow effect
- Animasi arrow infinite loop

**Sesudah:**
- Editorial typography sebagai hero utama
- Background solid warm (#F4F7F5)
- Heading besar dengan font serif (Lora)
- Kata "dicegah" highlight dengan coral
- Statistik inline di bawah CTA
- Animasi minimal (fade 0.5s)

#### 3. Statistics Section
**Sebelum:**
- Grid 4 kolom dengan cards
- Shadow dan rounded-2xl
- Icon dengan animasi scale loop
- Hover scale effect

**Sesudah:**
- Big number layout vertikal (WHO style)
- Tanpa card, tanpa shadow
- Divider tipis antar statistik
- Typography besar dan bold
- Spacing lega seperti laporan tahunan

#### 4. Benefits Section
**Sebelum:**
- Grid 3 kolom cards
- Icon box biru dengan shadow
- Hover translate-y effect
- Trust indicators dengan cards

**Sesudah:**
- Alternating content layout
- Icon kecil di kiri (tanpa box)
- Divider tipis antar benefit
- Paragraph panjang edukatif
- Tanpa shadow, tanpa cards

#### 5. How It Works Section
**Sebelum:**
- Grid 4 kolom horizontal cards
- Badge dengan gradient
- Connector line horizontal
- Step number di corner

**Sesudah:**
- Timeline vertikal dengan garis di kiri
- Phase numbering (01, 02, 03, 04)
- Dot indicator di timeline
- Layout seperti program akademik
- Tanpa cards

#### 6. CTA Section
**Sebelum:**
- Background biru solid (#2563EB)
- Icon besar dengan backdrop blur
- CTA dengan gradient hover
- Animasi arrow infinite
- Checkmark list dengan icons

**Sesudah:**
- Background deep sage (#2F5D50)
- Grid 2 kolom: text kiri, CTA kanan
- Border button style
- Tanpa glow, tanpa gradient
- Footer minimal

#### 7. Navbar
**Sebelum:**
- Logo dengan background biru
- Link dengan hover biru
- CTA rounded-full biru

**Sesudah:**
- Logo dengan background sage
- Link dengan hover sage
- CTA rounded-lg sage
- Spacing lebih breathable

### 📐 Design System

#### Typography
- Heading: `font-serif` (Lora) untuk editorial feel
- Body: `font-sans` (Plus Jakarta Sans)
- H1: 64-72px
- H2: 30-36px
- Body: 18px

#### Spacing
- Section padding: `py-24` (96px)
- Large gaps: `space-y-20` (80px)
- Medium gaps: `space-y-12` (48px)
- Small gaps: `space-y-4` (16px)

#### Border Radius
- Max: `rounded-lg` (8px)
- No `rounded-2xl` atau `rounded-3xl`

#### Shadows
- Minimal usage
- Only `shadow-sm` untuk images
- No heavy shadows

#### Animations
- Duration: 0.3s - 0.5s
- Fade only
- No bounce, no scale, no infinite loops

### 🎯 Visual Mood

**Target:**
- Kementerian Kesehatan modern
- WHO digital report
- NGO health organization
- Institutional but warm

**Bukan:**
- Startup SaaS
- Template themeforest
- Crypto landing page
- Tech product marketing

### 📝 Content Tone

**Microcopy Changes:**
- ❌ "Mengapa Memilih Program Ini?" → ✅ "Kenapa Edukasi Penting"
- ❌ "Bagaimana Program Ini Bekerja?" → ✅ "Program 5 Hari"
- ❌ "Siap Melindungi Balita Anda?" → ✅ "Mulai Lindungi Balita Anda Hari Ini"

### 🔧 Technical Changes

1. Update `app/layout.tsx`: Tambah `lora.variable` ke body className
2. Update `app/globals.css`: Tambah `--font-serif` dan `.font-serif` utility
3. Redesign semua komponen di `components/landing/`:
   - HeroSection.tsx
   - StatisticsSection.tsx
   - BenefitsSection.tsx
   - HowItWorksSection.tsx
   - CTASection.tsx
   - Navbar.tsx

### 📚 Dokumentasi

- `DESIGN-SYSTEM.md`: Design tokens dan guidelines
- `REDESIGN-CHANGELOG.md`: Changelog lengkap (file ini)

### ✨ Hasil

Landing page sekarang terlihat lebih:
- Professional dan trustable
- Editorial dan institutional
- Warm dan human
- Research-based
- Bukan template generic

Cocok untuk platform edukasi kesehatan berbasis penelitian.
