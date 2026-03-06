# Profile Setup - Complete Documentation

## 📖 Overview

Halaman Profile Setup adalah bagian dari onboarding flow aplikasi E-Health Education untuk Pneumonia Balita. Halaman ini mengumpulkan data ibu dan anak yang diperlukan untuk personalisasi pengalaman pembelajaran.

## 🎯 Purpose

- Mengumpulkan data ibu (nama, usia, agama, pekerjaan, alamat, telepon)
- Mengumpulkan data anak (nama, tanggal lahir, jenis kelamin)
- Validasi data sesuai dengan aturan bisnis
- Menyimpan data ke database
- Redirect ke dashboard setelah berhasil

## 🏗️ Architecture

```
Profile Setup Flow
├── Step 1: Data Ibu (MotherInfoForm)
│   ├── Nama Lengkap
│   ├── Usia & Agama (2 columns)
│   ├── Pekerjaan
│   ├── Alamat
│   └── Nomor Telepon
│
├── Step 2: Data Anak (ChildInfoForm)
│   ├── Nama Lengkap Anak
│   ├── Tanggal Lahir
│   └── Jenis Kelamin
│
└── Submit → API → Success → Dashboard
```

## 📁 File Structure

```
app/(auth)/profile-setup/
├── page.tsx                          # Main page component
├── README.md                         # This file
├── PROFILE-SETUP-REDESIGN.md         # Original design document
├── PROFILE-SETUP-IMPLEMENTATION.md   # Implementation guide
├── REDESIGN-CHANGELOG.md             # Version history
└── BEFORE-AFTER-COMPARISON.md        # Comparison document

components/profile/
├── StepIndicator.tsx                 # Step progress indicator
├── MotherInfoForm.tsx                # Mother data form
├── ChildInfoForm.tsx                 # Child data form
├── ChildInfoFormStandalone.tsx       # Standalone child form
├── PROFILE-COMPONENTS-REDESIGN.md    # Component documentation
└── QUICK-REFERENCE.md                # Quick reference guide

lib/validations/
└── profile-schema.ts                 # Zod validation schemas

app/api/profile/
└── create/route.ts                   # API endpoint
```

## 🎨 Design System

### Color Palette
- **Primary**: #2F5D50 (Brand Green)
- **Primary Hover**: #274E43
- **Background**: #F4F7F5
- **Text Primary**: #1F2933
- **Text Secondary**: #6B7280
- **Error**: #E07A5F

### Typography
- **Headings**: Serif font (healthcare feel)
- **Body**: Sans-serif (readability)
- **Input**: 16px (text-base)
- **Labels**: 14px (text-sm)

### Spacing
- **Form sections**: 20px (space-y-5)
- **Form fields**: 8px (space-y-2)
- **Container padding**: 16px → 24px → 32px (responsive)

### Components
- **Input height**: 48px
- **Button height**: 48px
- **Icon size**: 20px
- **Max width**: 720px

## 🚀 Getting Started

### Prerequisites
```bash
# Dependencies
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- react-hook-form
- zod
- framer-motion
- lucide-react
```

### Installation
```bash
# Already installed in the project
npm install
```

### Usage
```tsx
// The page is automatically routed at /profile-setup
// Users are redirected here after OAuth login if profile is incomplete
```

## 📝 Documentation Index

### For Developers
1. **[Implementation Guide](./PROFILE-SETUP-IMPLEMENTATION.md)**
   - Detailed implementation details
   - API integration
   - Validation flow
   - Testing scenarios

2. **[Component Documentation](../../components/profile/PROFILE-COMPONENTS-REDESIGN.md)**
   - Component specifications
   - Props interface
   - Styling guidelines
   - Accessibility standards

3. **[Quick Reference](../../components/profile/QUICK-REFERENCE.md)**
   - Design tokens
   - Common patterns
   - Code snippets
   - Troubleshooting

### For Designers
1. **[Design Document](./PROFILE-SETUP-REDESIGN.md)**
   - Design philosophy
   - Visual hierarchy
   - Responsive behavior
   - Microcopy guidelines

2. **[Before/After Comparison](./BEFORE-AFTER-COMPARISON.md)**
   - Visual comparison
   - Metrics comparison
   - Feature comparison
   - UX improvements

### For Project Managers
1. **[Changelog](./REDESIGN-CHANGELOG.md)**
   - Version history
   - Breaking changes
   - Migration guide
   - Future roadmap

## 🎯 Key Features

### ✅ Implemented
- Two-step form with progress indicator
- Real-time validation with react-hook-form
- Zod schema validation
- Responsive design (mobile-first)
- Smooth animations with framer-motion
- Error handling and display
- Success toast notification
- Auto-redirect to dashboard
- Mobile keyboard optimization
- Accessibility compliant

### 🔄 In Progress
- None (v2.0 complete)

### 📋 Planned
- Auto-calculate child age
- Progress percentage
- Save draft functionality
- Multi-child support
- Photo upload

## 🧪 Testing

### Manual Testing Checklist
```
Form Validation:
□ Empty fields show errors
□ Invalid data shows errors
□ Valid data passes validation

Navigation:
□ Step 1 → Step 2 works
□ Back button works
□ Can't skip steps

Submission:
□ Loading state shows
□ Success toast appears
□ Redirects to dashboard
□ Error handling works

Responsive:
□ Mobile layout works
□ Tablet layout works
□ Desktop layout works

Accessibility:
□ Keyboard navigation works
□ Screen reader compatible
□ Focus states visible
□ Error messages clear
```

### Automated Testing
```bash
# Run tests (if available)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: Form not submitting
- Check network tab for API errors
- Verify validation schema
- Check console for errors

**Issue**: Step indicator not updating
- Verify currentStep state
- Check step validation logic
- Ensure steps array is correct

**Issue**: Mobile keyboard wrong type
- Check input type attribute
- Verify inputMode attribute
- Test on actual device

**Issue**: Animations not smooth
- Check framer-motion installation
- Verify AnimatePresence usage
- Test on different devices

## 📊 Performance

### Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Form submission: < 2s

### Optimization
- Code splitting with Next.js
- Lazy loading components
- Optimized animations
- Efficient re-renders with react-hook-form

## 🔒 Security

### Data Validation
- Client-side validation with Zod
- Server-side validation in API
- Input sanitization
- XSS prevention

### Privacy
- No sensitive data in URLs
- Secure API endpoints
- HTTPS only
- Session management

## 🌐 Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

### Known Issues
- iOS date picker has different UI
- Select dropdown styling varies
- Some animations may lag on low-end devices

## 📱 Mobile Optimization

### Features
- Touch-friendly targets (48px)
- Optimized keyboard types
- Input modes for better UX
- Progressive padding
- Responsive typography

### Testing Devices
- iPhone 12/13/14
- Samsung Galaxy S21/S22
- Google Pixel 6/7
- iPad Air/Pro

## ♿ Accessibility

### WCAG 2.1 Level AA
- Color contrast > 4.5:1
- Keyboard navigation
- Screen reader support
- Focus indicators
- Error identification
- Labels and instructions

### Testing Tools
- axe DevTools
- WAVE
- Lighthouse
- Screen readers (NVDA, JAWS, VoiceOver)

## 🔄 Version History

### v2.0 (Current) - March 6, 2026
- Complete redesign following Calm Healthcare Interface
- Icon-based step indicator
- Improved mobile UX
- Better accessibility
- Enhanced animations
- Comprehensive documentation

### v1.0 - Previous
- Initial implementation
- Basic form functionality
- Number-based steps
- Generic styling

## 🤝 Contributing

### Code Style
- Follow TypeScript strict mode
- Use Tailwind CSS classes
- Follow component patterns
- Write meaningful comments

### Pull Request Process
1. Update documentation
2. Add tests if applicable
3. Run linting and type checking
4. Test on multiple devices
5. Update changelog

## 📞 Support

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

### Contact
- Technical issues: Check GitHub issues
- Design questions: Refer to design document
- General questions: Check documentation

## 📄 License

This project is part of E-Health Education - Pneumonia Balita application.

## 🙏 Acknowledgments

- Design inspired by modern healthcare interfaces
- Built with modern React best practices
- Optimized for Indonesian users
- Focus on accessibility and mobile UX

---

**Last Updated**: March 6, 2026
**Version**: 2.0
**Status**: ✅ Production Ready
**Maintainer**: Development Team

## Quick Links

- [Implementation Guide](./PROFILE-SETUP-IMPLEMENTATION.md)
- [Component Docs](../../components/profile/PROFILE-COMPONENTS-REDESIGN.md)
- [Quick Reference](../../components/profile/QUICK-REFERENCE.md)
- [Changelog](./REDESIGN-CHANGELOG.md)
- [Comparison](./BEFORE-AFTER-COMPARISON.md)
