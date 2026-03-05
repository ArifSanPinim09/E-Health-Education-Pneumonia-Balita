# Design System - E-Health Education Pneumonia Balita

## Design Direction
Platform edukasi kesehatan berbasis penelitian dengan visual yang:
- Hangat dan trustable
- Human dan calm
- Institutional tapi modern
- Bukan SaaS startup atau tech product

## Color Tokens

```css
--primary: #2F5D50      /* Deep Sage - untuk CTA dan aksen utama */
--secondary: #F4F7F5    /* Warm Off White - background */
--accent: #E07A5F       /* Soft Coral - highlight penting */
--text: #1F2933         /* Dark Gray - body text */
--text-light: #1F2933/70 /* 70% opacity untuk secondary text */
```

## Typography Tokens

### Font Families
- Heading: `font-serif` (Playfair Display / DM Serif)
- Body: `font-sans` (Manrove / Plus Jakarta Sans / Inter)

### Font Sizes
- H1: `text-5xl sm:text-6xl lg:text-7xl` (48-72px)
- H2: `text-3xl sm:text-4xl` (30-36px)
- H3: `text-xl` (20px)
- Body: `text-lg` (18px)
- Small: `text-sm` (14px)

### Line Heights
- Heading: `leading-tight` (1.25)
- Body: `leading-relaxed` (1.625)

## Spacing System

```
12px  - gap-3, space-y-3
16px  - gap-4, space-y-4
24px  - gap-6, space-y-6
48px  - gap-12, space-y-12
72px  - py-24 (section padding)
120px - space-y-20 (large gaps)
```

## Border Radius Rules

- Max radius: `rounded-lg` (8px)
- No `rounded-2xl` atau `rounded-3xl`
- Lebih institutional, kurang playful

## Shadow Rules

- Minimal shadow usage
- Only for images: `shadow-sm`
- No heavy shadows
- No glow effects

## Animation Rules

- Fade only: `duration-0.3s` atau `duration-0.4s`
- No bounce
- No infinite loop animations
- No scale hover effects
- Subtle transitions only

## Component Patterns

### Hero Section
- Editorial typography sebagai hero utama
- Full height image di samping
- No gradient background
- No rotated boxes
- Statement typography dengan accent color

### Statistics Section
- Big number layout (WHO style)
- No cards
- Vertical spacing dengan divider tipis
- Bold numbers dengan light description

### Benefits Section
- Alternating content layout
- Icon kecil di kiri
- Divider tipis antar item
- No shadow, no cards
- Paragraph panjang edukatif

### How It Works
- Vertical timeline dengan garis di kiri
- Phase numbering (01, 02, 03, 04)
- No horizontal cards
- Mirip program akademik

### CTA Section
- Deep sage solid background
- Text kiri, CTA kanan (desktop)
- Border button style
- No glow, no gradient
- Elegan, bukan agresif

## Visual Identity

### Mood
- Kementerian Kesehatan modern
- WHO digital report
- NGO health organization
- Institutional but warm

### NOT
- Startup SaaS
- Web template themeforest
- Crypto landing page
- Tech product marketing

## Content Tone

### Microcopy Examples
❌ "Mengapa memilih program ini?"
✅ "Kenapa edukasi penting"

❌ "Fitur unggulan"
✅ "Edukasi berbasis bukti, bukan asumsi"

### Voice
- Edukatif tapi tidak menggurui
- Faktual tapi humanis
- Serius tapi accessible
- Research-based tapi mudah dipahami
