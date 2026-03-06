# 📚 Interactive User Guide - README

## 🎯 Overview

Interactive User Guide menggunakan **Driver.js** untuk membantu pengguna pertama kali memahami dashboard pembelajaran pneumonia balita.

---

## ✨ Features

- ✅ Auto-trigger untuk first-time user
- ✅ 6 steps interactive guide
- ✅ Tombol "Panduan" di navbar untuk re-watch
- ✅ Responsive (desktop, tablet, mobile)
- ✅ Custom styling sesuai tema aplikasi
- ✅ LocalStorage untuk save state

---

## 🚀 Quick Start

### Reset Guide (Testing)
```javascript
localStorage.removeItem('guide_seen')
// Refresh page
```

### Manual Trigger
```tsx
import { startUserGuide } from '@/lib/userGuide'

startUserGuide()
```

---

## 📁 Files

```
lib/userGuide.ts                    → Core logic
styles/driver-custom.css            → Custom styling
components/dashboard/UserGuideButton.tsx
components/user/UserNavbar.tsx
app/(user)/dashboard/page.tsx
```

---

## 🎬 Guide Steps

1. **Welcome** - Greeting card
2. **Progress Program** - Overview cards
3. **Alur Pembelajaran** - Progress timeline
4. **Mulai Pre-Test** - Pre-test button
5. **Sesi Bertahap** - Session unlock system
6. **Chatbot Bantuan** - Chatbot button

---

## 📖 Documentation

| File | Description |
|------|-------------|
| `IMPLEMENTASI-USER-GUIDE.md` | Full implementation guide |
| `CARA-PAKAI-USER-GUIDE.md` | Usage guide |
| `USER-GUIDE-SUMMARY.md` | Summary |
| `QUICK-REFERENCE-USER-GUIDE.md` | Quick reference |
| `USER-GUIDE-FLOW.md` | Flow diagrams |
| `USER-GUIDE-DEPLOYMENT-CHECKLIST.md` | Deployment checklist |
| `USER-GUIDE-TESTING-MANUAL.md` | Testing guide |

---

## 🧪 Testing

```bash
# Build test
npm run build

# Manual test
1. Clear localStorage
2. Login as new user
3. Verify guide shows
4. Test all 6 steps
5. Test navbar button
```

---

## 🎨 Customization

### Add New Step
```typescript
// Edit lib/userGuide.ts
{
  element: '#your-element-id',
  popover: {
    title: 'Title',
    description: 'Description',
    side: "bottom",
    align: 'start'
  }
}
```

### Change Styling
```css
/* Edit styles/driver-custom.css */
.driver-popover-next-btn {
  background: #2F5D50; /* Your color */
}
```

---

## 📊 Status

- ✅ Implementation: Complete
- ✅ Testing: Passed
- ✅ Documentation: Complete
- ✅ Build: Success
- ✅ Ready for Production

---

## 🔗 Quick Links

- [Driver.js Docs](https://driverjs.com)
- [Full Documentation](./IMPLEMENTASI-USER-GUIDE.md)
- [Testing Guide](./USER-GUIDE-TESTING-MANUAL.md)

---

## 💡 Tips

1. Guide shows once per user (localStorage)
2. Use "Panduan" button to re-watch
3. Delay 800ms for smooth render
4. All elements need unique IDs
5. Test on multiple devices

---

## 🐛 Troubleshooting

**Guide not showing?**
```javascript
localStorage.removeItem('guide_seen')
```

**Element not highlighted?**
- Check element ID
- Ensure element is visible
- Check console for errors

**Styling issues?**
- Check CSS import order
- Clear browser cache

---

## 📞 Support

- Documentation: See markdown files
- Issues: Check troubleshooting section
- Testing: See testing manual

---

**Version:** 1.0.0  
**Date:** 7 Maret 2026  
**Status:** Production Ready ✅
