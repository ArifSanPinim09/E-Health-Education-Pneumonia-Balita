# Profile Components Redesign

## Overview
Redesign komponen profile setup mengikuti prinsip **Calm Healthcare Interface** dengan fokus pada kesederhanaan, keterbacaan, dan pengalaman pengguna yang nyaman untuk ibu pengguna aplikasi.

## Design Philosophy

### Core Principles
- **Content > Decoration** - Fokus pada konten, bukan dekorasi berlebihan
- **Clarity > Complexity** - Sederhana dan mudah dipahami
- **Spacing > Borders** - Gunakan spacing untuk pemisahan, bukan border tebal

### Target User
- Ibu dengan anak balita (0-5 tahun)
- Mayoritas pengguna mobile (Android)
- Membutuhkan interface yang cepat dan mudah diisi

## Color System

### Primary Colors
```css
Primary 500: #2F5D50
Primary 600 (Hover): #274E43
Primary 50 (Background): #F4F7F5
```

### Neutral Colors
```css
Text Primary: #1F2933
Text Secondary: #6B7280
Border: rgba(47,93,80,0.1)
Input Border: rgba(47,93,80,0.2)
```

### Error Color
```css
Error: #E07A5F
Error Background: rgba(224,122,95,0.1)
Error Border: rgba(224,122,95,0.3)
```

## Typography

### Font Families
- **Heading**: Serif (untuk kesan human & healthcare)
- **Body**: Sans-serif (untuk readability)

### Font Sizes
- Page Title: 30px mobile / 36px desktop
- Section Title: 20px (font-serif)
- Label: 14px (font-medium)
- Input Text: 16px (base)
- Helper Text: 13px

## Components

### 1. StepIndicator

#### Features
- Icon-based steps (User & Baby)
- Animated progress bar
- Responsive labels (hidden on mobile)
- CheckCircle untuk completed step

#### Styling
```tsx
Active Step:
- Background: #2F5D50
- Text: white
- Icon: white

Inactive Step:
- Background: rgba(47,93,80,0.1)
- Text: rgba(47,93,80,0.5)

Progress Bar:
- Height: 4px (1 = 4px)
- Background: rgba(47,93,80,0.1)
- Active: #2F5D50
- Animation: 0.4s ease-in-out
```

#### Responsive Behavior
- Desktop: Icon + Label inline
- Mobile: Icon only, labels below

### 2. MotherInfoForm

#### Layout Structure
```
Header (Icon + Title)
├── Nama Lengkap (full width)
├── Usia | Agama (2 columns on tablet+)
├── Pekerjaan (full width)
├── Alamat (full width)
└── Nomor Telepon (full width)
```

#### Input Specifications
- Height: 48px (h-12)
- Border Radius: 8px
- Border: 1px solid rgba(47,93,80,0.2)
- Padding: 16px (px-4)
- Font Size: 16px (text-base)

#### Input Types
- Nama: `type="text"`
- Usia: `type="number"` + `inputMode="numeric"`
- Telepon: `type="tel"` + `inputMode="tel"`

#### Focus State
```css
outline: none
border: #2F5D50
ring: 2px rgba(47,93,80,0.3)
transition: all
```

#### Spacing
- Section spacing: space-y-5 (20px)
- Field spacing: space-y-2 (8px)

### 3. ChildInfoForm

#### Layout Structure
```
Header (Icon + Title)
├── Nama Lengkap Anak (full width)
├── Tanggal Lahir (full width)
└── Jenis Kelamin (full width)
```

#### Special Features
- Date input dengan `max` attribute (today)
- Select dropdown untuk gender
- Consistent styling dengan MotherInfoForm

### 4. Profile Setup Page

#### Container Specifications
```css
Max Width: 720px
Background: #F4F7F5
Card Background: white
Card Border Radius: 12px (rounded-xl)
Card Border: 1px solid rgba(47,93,80,0.1)
Card Padding: 24px mobile / 40px desktop
```

#### Responsive Padding
```css
Mobile: px-4 (16px)
Tablet: px-6 (24px)
Desktop: px-8 (32px)
```

#### Button System

**Primary Button (Lanjutkan/Simpan)**
```css
Height: 48px
Background: #2F5D50
Hover: #274E43
Color: white
Border Radius: 8px
Font Weight: 500 (medium)
Font Size: 16px (text-base)
Transition: 200ms
```

**Secondary Button (Kembali)**
```css
Height: 48px
Border: 2px solid rgba(47,93,80,0.3)
Hover Border: #2F5D50
Hover Background: #F4F7F5
Color: #2F5D50
Border Radius: 8px
Font Weight: 500
Font Size: 16px
Transition: 200ms
```

#### Animation System

**Page Animation**
```tsx
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
duration: 0.3s
```

**Step Transition**
```tsx
Step 1 → Step 2:
initial: { opacity: 0, x: 10 }
animate: { opacity: 1, x: 0 }
exit: { opacity: 0, x: -10 }
duration: 0.3s
```

**Error Message**
```tsx
initial: { opacity: 0, y: -10 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -10 }
duration: 0.3s
```

## Mobile UX Improvements

### Input Optimization
1. **Keyboard Types**
   - `type="tel"` + `inputMode="tel"` untuk nomor telepon
   - `type="number"` + `inputMode="numeric"` untuk usia
   - `type="date"` untuk tanggal lahir

2. **Touch Targets**
   - Button height: 48px (mudah ditekan)
   - Input height: 48px
   - Spacing antar field: 20px

3. **Visual Feedback**
   - Focus ring yang jelas
   - Hover state untuk desktop
   - Disabled state yang jelas

## Accessibility

### Standards
- Label selalu ada dengan `htmlFor`
- Error message dengan contrast ratio > 4.5
- Focus state yang jelas
- Semantic HTML

### ARIA
- Form fields dengan proper labels
- Error messages linked to inputs
- Button states (disabled, loading)

## Microcopy Guidelines

### Bahasa
- Ramah dan sederhana
- Hindari jargon teknis
- Gunakan contoh yang jelas

### Examples
✅ Good:
- "Nama Lengkap"
- "Masukkan nama lengkap"
- "Contoh: 081234567890"

❌ Bad:
- "Input your full legal name"
- "Enter phone number in international format"

## Error Handling

### Error Display
```tsx
<p className="text-sm text-[#E07A5F] font-medium">
  {error.message}
</p>
```

### Global Error Container
```tsx
<div className="bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg p-4">
  <AlertCircle className="w-5 h-5 text-[#E07A5F]" />
  <p className="text-sm text-[#E07A5F] font-medium">{error}</p>
</div>
```

## Validation

### Client-Side Validation
- Real-time validation dengan react-hook-form
- Zod schema validation
- Field-level error messages

### Validation Rules
- Nama: min 2 karakter, hanya huruf dan spasi
- Usia: 15-100 tahun
- Telepon: min 10 digit, format nomor valid
- Tanggal lahir: anak max 5 tahun (balita)

## Performance Optimizations

1. **Form State Management**
   - react-hook-form untuk efficient re-renders
   - Zod resolver untuk validation

2. **Animations**
   - framer-motion dengan duration 0.3s
   - AnimatePresence untuk smooth transitions

3. **Loading States**
   - Spinner animation saat submit
   - Disabled state untuk prevent double submit

## Testing Checklist

- [ ] Form validation bekerja
- [ ] Step navigation smooth
- [ ] Mobile keyboard types correct
- [ ] Error messages clear
- [ ] Success redirect works
- [ ] Responsive di semua breakpoints
- [ ] Accessibility standards met
- [ ] Loading states work

## Future Improvements

1. **Auto-calculate Age**
   - Dari tanggal lahir anak
   - Display: "Usia Anak: 2 tahun 3 bulan"

2. **Progress Indicator**
   - "Langkah 1 dari 2"
   - Percentage completion

3. **Field Suggestions**
   - Autocomplete untuk alamat
   - Common occupations

4. **Save Draft**
   - Auto-save form data
   - Resume later functionality

## Consistency Rules

Semua halaman onboarding harus mengikuti:
- Container width: max 720px
- Button style: consistent height & colors
- Input style: consistent height & borders
- Spacing scale: 4px base unit
- Color system: primary #2F5D50
- Animation duration: 0.3s standard

---

**Last Updated**: March 6, 2026
**Design System Version**: 1.0
**Status**: ✅ Implemented
