# Perbaikan Dashboard - Review Session Feature

## 📋 Ringkasan
Dashboard telah diperbaiki dengan menambahkan fitur untuk mengakses kembali session yang sudah dipelajari. User sekarang dapat mereview materi kapan saja dengan tombol "Pelajari Lagi".

## ✨ Fitur Baru

### 1. **Section "Sesi yang Telah Dipelajari"**

#### Lokasi
- Muncul di bawah card "Continue Learning" atau "Next Action"
- Hanya muncul jika ada session yang sudah completed
- Hanya muncul setelah pre-test selesai

#### Kondisi Tampil
```tsx
{progress.pre_test_completed && progress.sessions.some(s => s.completed) && (
  // Section muncul
)}
```

#### Design
- Card dengan background white
- Border `border-[#E2E8F0]`
- Rounded `rounded-2xl`
- Padding `p-6`

### 2. **Session Card (Completed)**

#### Layout
```tsx
<div className="flex items-center justify-between">
  {/* Left: Session Info */}
  <div className="flex items-center gap-3">
    <div className="badge">Day Number</div>
    <div>
      <p>Session Title</p>
      <p>Status</p>
    </div>
  </div>
  
  {/* Right: Action */}
  <div>Pelajari Lagi →</div>
</div>
```

#### Components

**Badge (Day Number):**
```css
w-10 h-10
bg-[#2F5D50]/10
rounded-lg
text-[#2F5D50]
group-hover:bg-[#2F5D50]
group-hover:text-white
```

**Session Title:**
```css
text-sm font-medium text-[#1F2933]
```

**Status Text:**
```css
text-xs text-[#1F2933]/60
"Selesai dipelajari"
```

**Action Button:**
```css
text-sm font-medium text-[#2F5D50]
"Pelajari Lagi →"
group-hover:translate-x-1
```

### 3. **Hover Effects**

#### Card Hover
```css
hover:bg-[#2F5D50]/5
hover:border-[#2F5D50]/20
cursor-pointer
```

#### Badge Hover
```css
group-hover:bg-[#2F5D50]
group-hover:text-white
```

#### Arrow Hover
```css
group-hover:translate-x-1
transition-transform
```

### 4. **Animations**

#### Card Entrance
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, delay: 0.6 }}
```

#### Session Items Stagger
```tsx
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
```

## 🎯 User Flow

### Scenario 1: User Baru (Belum Pre-Test)
```
Dashboard
└── "Mulai Program" Card
    └── Button: "Mulai Pre-Test"
```

### Scenario 2: Sudah Pre-Test, Belum Ada Session Completed
```
Dashboard
└── "Lanjutkan Pembelajaran" Card
    └── Next Session Info
    └── Button: "Lanjutkan"
```

### Scenario 3: Ada Session Completed
```
Dashboard
├── "Lanjutkan Pembelajaran" Card (jika ada next session)
│   └── Next Session Info
│   └── Button: "Lanjutkan"
└── "Sesi yang Telah Dipelajari" Card ✨ NEW
    ├── Session 1 (completed) → "Pelajari Lagi"
    ├── Session 2 (completed) → "Pelajari Lagi"
    └── ...
```

### Scenario 4: Semua Session Completed, Belum Post-Test
```
Dashboard
├── "Saatnya Evaluasi" Card
│   └── Button: "Mulai Post-Test"
└── "Sesi yang Telah Dipelajari" Card ✨ NEW
    ├── Session 1 → "Pelajari Lagi"
    ├── Session 2 → "Pelajari Lagi"
    ├── Session 3 → "Pelajari Lagi"
    ├── Session 4 → "Pelajari Lagi"
    └── Session 5 → "Pelajari Lagi"
```

### Scenario 5: Program Selesai (Post-Test Done)
```
Dashboard
├── "Program Selesai" Card
│   ├── Score Comparison
│   └── Button: "Lihat Hasil Lengkap"
└── "Sesi yang Telah Dipelajari" Card ✨ NEW
    ├── Session 1 → "Pelajari Lagi"
    ├── Session 2 → "Pelajari Lagi"
    ├── Session 3 → "Pelajari Lagi"
    ├── Session 4 → "Pelajari Lagi"
    └── Session 5 → "Pelajari Lagi"
```

## 📝 Text Content

### Card Title
```
"Sesi yang Telah Dipelajari"
```

### Card Description
```
"Anda dapat mengakses kembali materi yang sudah dipelajari kapan saja"
```

### Session Status
```
"Selesai dipelajari"
```

### Action Button
```
"Pelajari Lagi →"
```

## 🎨 Design Consistency

### Colors (Konsisten dengan Design System)
```css
Primary: #2F5D50
Background: #F8FAFC
Border: #E2E8F0
Text Primary: #1F2933
Text Secondary: #1F2933/60
```

### Spacing
```css
Card Padding: p-6
Gap between items: gap-3
Space between cards: space-y-3
```

### Border Radius
```css
Card: rounded-2xl
Badge: rounded-lg
```

### Typography
```css
Title: text-xl font-semibold
Description: text-sm text-[#1F2933]/70
Session Title: text-sm font-medium
Status: text-xs text-[#1F2933]/60
Action: text-sm font-medium
```

## 🔄 Interaction States

### Default State
- Background: `bg-[#F8FAFC]`
- Border: `border-[#E2E8F0]`
- Badge: `bg-[#2F5D50]/10` with `text-[#2F5D50]`

### Hover State
- Background: `hover:bg-[#2F5D50]/5`
- Border: `hover:border-[#2F5D50]/20`
- Badge: `bg-[#2F5D50]` with `text-white`
- Arrow: `translate-x-1`

### Active State
- Clickable (Link to session page)
- Cursor: `cursor-pointer`

## 💡 Benefits

### For Users
1. ✅ Dapat mereview materi kapan saja
2. ✅ Tidak perlu menunggu unlock untuk mengakses materi lama
3. ✅ Memudahkan refresh pengetahuan
4. ✅ Fleksibilitas dalam belajar

### For Learning Experience
1. ✅ Mendorong repetitive learning
2. ✅ Meningkatkan retention
3. ✅ User dapat belajar sesuai pace mereka
4. ✅ Akses unlimited ke materi

## 🚫 Exclusions

### Pre-Test & Post-Test
- **TIDAK** ditampilkan di "Sesi yang Telah Dipelajari"
- Pre-test hanya bisa diakses sekali (sebelum session)
- Post-test hanya bisa diakses sekali (setelah semua session)
- Hasil test bisa dilihat di halaman Results

### Alasan:
- Test adalah assessment, bukan learning material
- Test results harus final untuk tracking progress
- User bisa lihat hasil di halaman Results

## 📊 Display Logic

```tsx
// Hanya tampilkan session yang completed
progress.sessions.map((session, index) => 
  session.completed ? (
    <SessionCard key={session.day} session={session} />
  ) : null
)
```

## 🎯 Key Features

1. **Conditional Rendering**
   - Hanya muncul jika ada completed sessions
   - Hanya muncul setelah pre-test

2. **Dynamic List**
   - Otomatis update saat session baru completed
   - Sorted by day number

3. **Interactive Cards**
   - Hover effects yang smooth
   - Clear call-to-action
   - Visual feedback

4. **Consistent Design**
   - Mengikuti design system
   - Konsisten dengan card lain
   - Professional appearance

## 🔧 Technical Implementation

### Component Structure
```tsx
<motion.div> {/* Container Card */}
  <h2>Sesi yang Telah Dipelajari</h2>
  <p>Description</p>
  <div className="space-y-3">
    {progress.sessions.map((session) => 
      session.completed ? (
        <Link href={`/session/${session.day}`}>
          <motion.div> {/* Session Card */}
            <div> {/* Left: Info */}
              <div>Badge</div>
              <div>
                <p>Title</p>
                <p>Status</p>
              </div>
            </div>
            <div>Action</div>
          </motion.div>
        </Link>
      ) : null
    )}
  </div>
</motion.div>
```

### State Management
- Menggunakan existing `progress.sessions` state
- Tidak perlu state tambahan
- Reactive terhadap progress changes

### Navigation
- Menggunakan Next.js Link component
- Client-side navigation
- Smooth transitions

## ✅ Result

Dashboard sekarang:
- ✅ Memiliki section untuk review materi
- ✅ Session completed bisa diakses kapan saja
- ✅ Tombol "Pelajari Lagi" yang jelas
- ✅ Design konsisten dengan design system
- ✅ Hover effects yang smooth
- ✅ Animations yang natural
- ✅ Pre-test dan Post-test tetap excluded
- ✅ User experience yang lebih baik
