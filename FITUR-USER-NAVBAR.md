# Fitur User Navbar

## 📋 Ringkasan
Telah dibuat navbar untuk halaman user (dashboard, profile, results) yang konsisten dengan design system dan responsive di semua ukuran layar.

## 🎯 Komponen yang Dibuat

### UserNavbar Component (`components/user/UserNavbar.tsx`)

#### Features:
- Logo Pneumonia Care (klik untuk ke dashboard)
- Navigation links (Dashboard, Hasil)
- User menu dengan avatar dan dropdown
- Mobile hamburger menu
- Responsive design
- Fixed position di top
- Backdrop blur effect

#### Design:
- Background: `bg-white/95` dengan `backdrop-blur-sm`
- Border: `border-b border-[#2F5D50]/10`
- Height: `h-16 sm:h-20` (64px mobile, 80px desktop)
- Z-index: `z-40` (below chatbot z-50)
- Animation: Slide down dari atas

#### Navigation Items:
1. **Dashboard** - Link ke /dashboard (active state)
2. **Hasil** - Link ke /results
3. **User Menu** - Dropdown dengan profile & logout

#### Mobile Menu:
- Hamburger icon (Menu/X)
- Slide down animation
- Full width menu
- Active state untuk current page
- Auto close on navigation

## 🎨 Integration

### Dashboard Page:
```tsx
<UserNavbar userName={profile.mother.name} />
<div className="pt-16 sm:pt-20"> // Padding top untuk navbar
  {/* Content */}
</div>
```

### Profile Page:
```tsx
<UserNavbar userName={profile.mother.name} />
<div className="pt-16 sm:pt-20">
  {/* Content */}
</div>
```

### Results Page:
```tsx
{profile && <UserNavbar userName={profile.mother.name} />}
<div className="pt-24 sm:pt-28"> // Extra padding karena ada header
  {/* Content */}
</div>
```

## 📱 Responsive Design

### Mobile (< 768px):
- Logo: `w-8 h-8` (32px)
- Text: `text-base` (16px)
- Height: `h-16` (64px)
- Show: Logo + UserMenu + Hamburger
- Hide: Navigation links (in hamburger menu)

### Desktop (≥ 768px):
- Logo: `w-10 h-10` (40px)
- Text: `text-lg` (18px)
- Height: `h-20` (80px)
- Show: Logo + Navigation links + UserMenu
- Hide: Hamburger menu

## 🎯 Navigation Structure

```
UserNavbar
├── Logo (Link to /dashboard)
├── Desktop Nav
│   ├── Dashboard (active)
│   ├── Hasil
│   └── UserMenu
│       ├── Avatar + Name
│       └── Dropdown
│           ├── Lihat Profil
│           └── Keluar
└── Mobile Nav
    ├── UserMenu (compact)
    └── Hamburger
        └── Menu Items
            ├── Dashboard
            └── Hasil
```

## 🎨 Active State

### Desktop:
- Active link: `text-[#2F5D50]` (green)
- Inactive link: `text-[#1F2933]/70` (gray)
- Hover: `hover:text-[#2F5D50]`

### Mobile Menu:
- Active: `bg-[#2F5D50]/5 text-[#2F5D50]`
- Inactive: `text-[#1F2933]/70`
- Hover: `hover:bg-[#F4F7F5]`

## ✅ Features Checklist

- [x] Fixed navbar di top
- [x] Logo dengan link ke dashboard
- [x] Navigation links (Desktop)
- [x] User menu integration
- [x] Mobile hamburger menu
- [x] Responsive design
- [x] Active state indication
- [x] Smooth animations
- [x] Backdrop blur effect
- [x] Consistent with design system
- [x] Integrated to dashboard
- [x] Integrated to profile
- [x] Integrated to results

## 🚀 Halaman yang Sudah Terintegrasi

1. **Dashboard** (`app/(user)/dashboard/page.tsx`)
   - Navbar dengan user name
   - Padding top: `pt-16 sm:pt-20`

2. **Profile** (`app/(user)/profile/page.tsx`)
   - Navbar dengan user name
   - Padding top: `pt-16 sm:pt-20`
   - Back button tetap ada di content

3. **Results** (`app/(user)/results/page.tsx`)
   - Navbar dengan user name (conditional)
   - Padding top: `pt-24 sm:pt-28` (extra untuk header)

## 🎯 User Experience

### Navigation Flow:
1. User login → Dashboard (navbar muncul)
2. Klik "Hasil" → Results page (navbar tetap)
3. Klik avatar → Dropdown menu
4. Klik "Lihat Profil" → Profile page (navbar tetap)
5. Klik logo → Kembali ke Dashboard

### Mobile Experience:
1. Compact navbar dengan logo + user menu + hamburger
2. Klik hamburger → Menu slide down
3. Klik menu item → Navigate & auto close
4. User menu tetap accessible di navbar

### Consistency:
- Semua halaman user memiliki navbar yang sama
- Navigation state selalu jelas
- User selalu tahu posisi mereka
- Easy access ke profile & logout

## 📐 Spacing & Layout

### Navbar Height:
- Mobile: 64px (h-16)
- Desktop: 80px (h-20)

### Content Padding Top:
- Dashboard/Profile: 64px mobile, 80px desktop
- Results: 96px mobile, 112px desktop (extra space)

### Z-Index Hierarchy:
- Navbar: z-40
- Chatbot: z-50
- Modals: z-50+

---
**Catatan**: Navbar memberikan navigasi yang konsisten dan mudah diakses di semua halaman user, dengan design yang responsive dan selaras dengan design system yang ada.
