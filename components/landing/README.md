# Landing Page Components

Platform edukasi kesehatan pneumonia balita dengan design institutional yang warm dan trustable.

## 📁 File Structure

```
components/landing/
├── Navbar.tsx                    # Navigation bar dengan deep sage theme
├── HeroSection.tsx               # Editorial hero dengan typography besar
├── StatisticsSection.tsx         # Big number layout (WHO style)
├── BenefitsSection.tsx           # Alternating content layout
├── HowItWorksSection.tsx         # Vertical timeline program 5 hari
├── CTASection.tsx                # Deep sage CTA section
├── DESIGN-SYSTEM.md              # Design tokens & guidelines
├── REDESIGN-CHANGELOG.md         # Changelog lengkap
├── BEFORE-AFTER-COMPARISON.md    # Visual comparison
└── README.md                     # File ini
```

## 🎨 Design System

### Colors
```tsx
Primary:   #2F5D50  // Deep Sage
Secondary: #F4F7F5  // Warm Off White
Accent:    #E07A5F  // Soft Coral
Text:      #1F2933  // Dark Gray
```

### Typography
```tsx
Heading: font-serif (Lora)
Body:    font-sans (Plus Jakarta Sans)
```

### Spacing
```tsx
Section: py-24 (96px)
Large:   space-y-20 (80px)
Medium:  space-y-12 (48px)
Small:   space-y-4 (16px)
```

## 🧩 Components

### Navbar
- Fixed position dengan backdrop blur
- Deep sage CTA button
- Responsive mobile menu
- Auth state aware

### HeroSection
- Editorial typography hero
- Font serif untuk heading
- Accent coral untuk kata kunci
- Statistik inline
- Full height image

### StatisticsSection
- Big number layout vertikal
- Tanpa cards
- Divider tipis
- Typography besar dan bold
- WHO report style

### BenefitsSection
- Alternating content layout
- Icon kecil tanpa box
- Divider antar item
- Paragraph edukatif panjang
- Tanpa shadow

### HowItWorksSection
- Vertical timeline
- Phase numbering (01-04)
- Dot indicator
- Program akademik style
- Tanpa cards

### CTASection
- Deep sage background
- Grid 2 kolom (desktop)
- Border button style
- Footer minimal
- Tanpa glow effects

## 🚀 Usage

```tsx
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CTASection } from '@/components/landing/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatisticsSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
    </>
  );
}
```

## 📐 Design Principles

1. **Institutional but Warm** - Seperti Kemenkes modern, bukan startup SaaS
2. **Editorial Typography** - Serif untuk heading, sans untuk body
3. **Minimal Animations** - Fade only, no bounce, no loops
4. **No Card Overload** - Alternating layouts, timelines, big numbers
5. **Warm Color Palette** - Sage & coral, bukan neon blue
6. **Research-Based Tone** - Edukatif, faktual, humanis

## 🎯 Target Mood

✅ WHO digital report  
✅ NGO health organization  
✅ Kementerian Kesehatan modern  
✅ Institutional but accessible  

❌ Startup SaaS  
❌ Template themeforest  
❌ Crypto landing page  
❌ Tech product marketing  

## 📝 Content Guidelines

### Microcopy
- Edukatif, bukan marketing
- Faktual, bukan hyperbole
- Humanis, bukan menggurui

### Examples
✅ "Kenapa edukasi penting"  
❌ "Mengapa memilih program ini?"

✅ "Edukasi berbasis bukti, bukan asumsi"  
❌ "Fitur unggulan kami"

✅ "Program 5 Hari"  
❌ "Bagaimana program ini bekerja?"

## 🔧 Technical Notes

- Menggunakan Framer Motion untuk animasi
- Responsive design dengan Tailwind CSS
- Font: Lora (serif) + Plus Jakarta Sans (sans)
- No heavy dependencies
- Optimized untuk mobile

## 📚 Documentation

- `DESIGN-SYSTEM.md` - Design tokens lengkap
- `REDESIGN-CHANGELOG.md` - Changelog detail
- `BEFORE-AFTER-COMPARISON.md` - Visual comparison

## 🎓 Capstone Quality

Design ini dibuat untuk capstone level atas dengan:
- Custom design system
- Institutional design language
- Research-based approach
- Professional documentation
- Bukan template generic

---

**Last Updated:** 6 Maret 2026  
**Design Direction:** Institutional Health Education Platform
