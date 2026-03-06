# ⚡ Quick Reference - User Guide

## 🚀 Quick Start

### Reset Guide (Testing)
```javascript
// Browser console
localStorage.removeItem('guide_seen')
// Refresh page
```

### Manual Trigger
```tsx
import { startUserGuide } from '@/lib/userGuide'

startUserGuide()
```

---

## 📝 Add New Step

### 1. Edit `lib/userGuide.ts`
```typescript
steps: [
  {
    element: '#your-element-id',
    popover: {
      title: 'Step Title',
      description: 'Step description',
      side: "bottom", // top, bottom, left, right
      align: 'start'  // start, center, end
    }
  }
]
```

### 2. Add ID to Element
```tsx
<div id="your-element-id">
  {/* Your content */}
</div>
```

---

## 🎨 Customize Styling

### Edit `styles/driver-custom.css`
```css
/* Change primary color */
.driver-popover-next-btn {
  background: #2F5D50;
}

/* Change border radius */
.driver-popover {
  border-radius: 12px;
}
```

---

## 🔧 Common Tasks

### Show Guide Button
```tsx
import { UserGuideButton } from '@/components/dashboard/UserGuideButton'

<UserGuideButton />
```

### Check if Guide Shown
```tsx
import { shouldShowGuide } from '@/lib/userGuide'

if (shouldShowGuide()) {
  // Guide belum pernah dilihat
}
```

### Reset Guide
```tsx
import { resetGuide } from '@/lib/userGuide'

resetGuide()
```

---

## 📍 Element IDs

Current IDs used in guide:
- `#greeting-card` - Welcome card
- `#overview-cards` - Progress overview
- `#progress-card` - Learning path
- `#pretest-button` - Pre-test button
- `#session-unlock` - Session unlock indicator
- `#chatbot` - Chatbot floating button

---

## 🐛 Troubleshooting

### Guide not showing?
```javascript
// Check localStorage
localStorage.getItem('guide_seen')

// Clear it
localStorage.removeItem('guide_seen')
```

### Element not highlighted?
1. Check ID is correct
2. Element must be visible (not `display: none`)
3. Check console for errors

### Styling not applied?
1. Import order: `driver.css` → `driver-custom.css`
2. Check CSS specificity
3. Clear browser cache

---

## 📦 Files Structure

```
lib/userGuide.ts              → Core logic
styles/driver-custom.css      → Custom styling
components/
  dashboard/
    UserGuideButton.tsx       → Reusable button
  user/
    UserNavbar.tsx            → Navbar with guide button
```

---

## 🎯 Key Functions

```typescript
// Start guide
startUserGuide()

// Check if should show
shouldShowGuide() // returns boolean

// Reset guide
resetGuide()
```

---

## 💡 Tips

1. **Delay render**: Wait 800ms before showing guide
2. **Keep it short**: 5-7 steps max
3. **Simple language**: Easy to understand
4. **Test responsive**: Desktop, tablet, mobile
5. **Unique IDs**: Don't change element IDs

---

## 📱 Responsive

Driver.js auto-adjusts popover position based on:
- Screen size
- Element position
- Available space

No extra code needed!

---

## 🔗 Quick Links

- [Full Documentation](./IMPLEMENTASI-USER-GUIDE.md)
- [Usage Guide](./CARA-PAKAI-USER-GUIDE.md)
- [Summary](./USER-GUIDE-SUMMARY.md)
- [Driver.js Docs](https://driverjs.com)

---

**Need help?** Check the full documentation files above.
