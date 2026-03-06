# Profile Components - Quick Reference

## 🎨 Design Tokens

### Colors
```css
/* Primary */
--primary-500: #2F5D50;
--primary-600: #274E43;  /* Hover */
--primary-50: #F4F7F5;   /* Background */

/* Neutral */
--neutral-900: #1F2933;  /* Text primary */
--neutral-600: #6B7280;  /* Text secondary */

/* Error */
--error: #E07A5F;
--error-bg: rgba(224,122,95,0.1);
--error-border: rgba(224,122,95,0.3);

/* Borders */
--border: rgba(47,93,80,0.1);
--input-border: rgba(47,93,80,0.2);
```

### Typography
```css
/* Sizes */
--title-mobile: 30px;
--title-desktop: 36px;
--section-title: 20px;
--label: 14px;
--input: 16px;
--helper: 13px;

/* Fonts */
--font-heading: serif;
--font-body: sans-serif;
```

### Spacing
```css
/* Form */
--form-spacing: 20px;      /* space-y-5 */
--field-spacing: 8px;      /* space-y-2 */
--header-padding: 20px;    /* pb-5 */

/* Container */
--mobile-padding: 16px;
--tablet-padding: 24px;
--desktop-padding: 32px;
```

### Sizing
```css
/* Inputs & Buttons */
--input-height: 48px;      /* h-12 */
--button-height: 48px;     /* h-12 */
--icon-size: 20px;         /* w-5 h-5 */
--step-icon-size: 24px;    /* w-6 h-6 */

/* Container */
--max-width: 720px;
--border-radius: 12px;     /* rounded-xl */
```

### Animations
```css
--transition-fast: 200ms;
--transition-normal: 300ms;
--transition-slow: 400ms;
--easing: ease-in-out;
```

## 📦 Component Props

### StepIndicator
```tsx
interface StepIndicatorProps {
  currentStep: number        // 1 or 2
  totalSteps: number        // 2
  steps: {
    label: string           // "Data Ibu" | "Data Anak"
    icon: 'user' | 'baby'  // Icon type
  }[]
}

// Usage
<StepIndicator 
  currentStep={1} 
  totalSteps={2} 
  steps={[
    { label: 'Data Ibu', icon: 'user' },
    { label: 'Data Anak', icon: 'baby' }
  ]}
/>
```

### MotherInfoForm
```tsx
interface MotherInfoFormProps {
  form: UseFormReturn<ProfileSetupInput>
}

// Usage
<MotherInfoForm form={form} />
```

### ChildInfoForm
```tsx
interface ChildInfoFormProps {
  form: UseFormReturn<ProfileSetupInput>
}

// Usage
<ChildInfoForm form={form} />
```

## 🎯 Common Patterns

### Input Field
```tsx
<div className="space-y-2">
  <label htmlFor="field-id" className="block text-sm font-medium text-[#1F2933]">
    Label <span className="text-[#E07A5F]">*</span>
  </label>
  <input
    id="field-id"
    type="text"
    placeholder="Placeholder text"
    className="w-full h-12 px-4 rounded-lg border border-[#2F5D50]/20 bg-white text-[#1F2933] placeholder:text-[#1F2933]/40 focus:outline-none focus:ring-2 focus:ring-[#2F5D50]/30 focus:border-[#2F5D50] transition-all text-base"
  />
  {error && (
    <p className="text-sm text-[#E07A5F] font-medium">
      {error.message}
    </p>
  )}
</div>
```

### Primary Button
```tsx
<button
  type="submit"
  className="flex-1 h-12 inline-flex items-center justify-center px-6 bg-[#2F5D50] text-white font-medium rounded-lg hover:bg-[#274E43] transition-all duration-200 text-base"
>
  Button Text
  <Icon className="w-5 h-5 ml-2" strokeWidth={2} />
</button>
```

### Secondary Button
```tsx
<button
  type="button"
  className="flex-1 h-12 inline-flex items-center justify-center px-6 text-[#2F5D50] font-medium rounded-lg border-2 border-[#2F5D50]/30 hover:border-[#2F5D50] hover:bg-[#F4F7F5] transition-all duration-200 text-base"
>
  <Icon className="w-5 h-5 mr-2" strokeWidth={2} />
  Button Text
</button>
```

### Error Container
```tsx
<div className="bg-[#E07A5F]/10 border border-[#E07A5F]/30 rounded-lg p-4 flex items-start gap-3">
  <AlertCircle className="w-5 h-5 text-[#E07A5F] flex-shrink-0 mt-0.5" strokeWidth={2} />
  <p className="text-sm text-[#E07A5F] font-medium leading-relaxed">
    {error}
  </p>
</div>
```

### Section Header
```tsx
<div className="flex items-center gap-3 pb-5 border-b border-[#2F5D50]/10">
  <div className="w-12 h-12 bg-[#2F5D50]/10 rounded-lg flex items-center justify-center">
    <Icon className="w-6 h-6 text-[#2F5D50]" strokeWidth={2} />
  </div>
  <div>
    <h2 className="text-xl font-serif text-[#1F2933]">Title</h2>
    <p className="text-sm text-[#6B7280]">Subtitle</p>
  </div>
</div>
```

## 🔧 Input Types Reference

### Text Input
```tsx
<input
  type="text"
  className="..."
/>
```

### Number Input
```tsx
<input
  type="number"
  inputMode="numeric"
  className="..."
/>
```

### Phone Input
```tsx
<input
  type="tel"
  inputMode="tel"
  placeholder="Contoh: 081234567890"
  className="..."
/>
```

### Date Input
```tsx
<input
  type="date"
  max={new Date().toISOString().split('T')[0]}
  className="..."
/>
```

### Select Input
```tsx
<select className="...">
  <option value="">Pilih opsi</option>
  <option value="value1">Label 1</option>
  <option value="value2">Label 2</option>
</select>
```

## 📱 Responsive Classes

### Container
```tsx
className="px-4 sm:px-6 lg:px-8"  // Padding
className="py-8 sm:py-12"         // Vertical padding
className="max-w-[720px]"         // Max width
```

### Typography
```tsx
className="text-[30px] sm:text-4xl"  // Title
className="text-base"                 // Body
className="text-sm"                   // Small
className="text-xs"                   // Extra small
```

### Grid
```tsx
className="grid grid-cols-1 sm:grid-cols-2 gap-4"
```

### Spacing
```tsx
className="space-y-5"   // Form sections
className="space-y-2"   // Form fields
className="gap-3"       // Flex gap
```

## 🎭 Animation Patterns

### Page Load
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Step Transition
```tsx
<AnimatePresence mode="wait">
  {currentStep === 1 ? (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Step1 />
    </motion.div>
  ) : (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Step2 />
    </motion.div>
  )}
</AnimatePresence>
```

### Progress Bar
```tsx
<motion.div
  initial={{ width: '0%' }}
  animate={{ width: isCompleted ? '100%' : '0%' }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
  className="h-full bg-[#2F5D50]"
/>
```

### Error Message
```tsx
<AnimatePresence>
  {error && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <ErrorMessage />
    </motion.div>
  )}
</AnimatePresence>
```

## 🎨 Tailwind Classes Cheatsheet

### Most Used Classes
```css
/* Layout */
w-full, h-12, max-w-[720px], flex, flex-1, grid

/* Spacing */
px-4, py-8, space-y-5, space-y-2, gap-3, mb-8, mt-6

/* Colors */
bg-[#2F5D50], text-[#1F2933], text-[#6B7280], text-[#E07A5F]
border-[#2F5D50]/20, bg-[#F4F7F5]

/* Typography */
text-base, text-sm, text-xs, text-xl, font-serif, font-medium

/* Borders */
rounded-lg, rounded-xl, border, border-2

/* Effects */
hover:bg-[#274E43], focus:outline-none, focus:ring-2
transition-all, duration-200

/* Responsive */
sm:px-6, sm:text-4xl, sm:grid-cols-2, lg:px-8
```

## 📋 Validation Rules

### Mother Fields
```typescript
name: min 2 chars, max 255, letters & spaces only
age: 15-100 years, integer
religion: required, max 100 chars
occupation: required, max 255 chars
address: min 10 chars, max 500 chars
phone: min 10 digits, max 20, valid format
```

### Child Fields
```typescript
name: min 2 chars, max 255, letters & spaces only
birth_date: required, past date, max 5 years old
gender: required, 'male' or 'female'
```

## 🚀 Quick Start

### 1. Import Components
```tsx
import { StepIndicator } from '@/components/profile/StepIndicator'
import { MotherInfoForm } from '@/components/profile/MotherInfoForm'
import { ChildInfoForm } from '@/components/profile/ChildInfoForm'
```

### 2. Setup Form
```tsx
const form = useForm<ProfileSetupInput>({
  resolver: zodResolver(profileSetupSchema),
  mode: 'onChange',
})
```

### 3. Define Steps
```tsx
const steps = [
  { label: 'Data Ibu', icon: 'user' as const },
  { label: 'Data Anak', icon: 'baby' as const }
]
```

### 4. Render
```tsx
<StepIndicator currentStep={currentStep} totalSteps={2} steps={steps} />
{currentStep === 1 ? (
  <MotherInfoForm form={form} />
) : (
  <ChildInfoForm form={form} />
)}
```

## 🐛 Common Issues

### Issue: StepIndicator not showing icons
**Solution**: Make sure to pass icon type in steps array
```tsx
// ❌ Wrong
steps={['Data Ibu', 'Data Anak']}

// ✅ Correct
steps={[
  { label: 'Data Ibu', icon: 'user' },
  { label: 'Data Anak', icon: 'baby' }
]}
```

### Issue: Input keyboard not optimized
**Solution**: Add proper type and inputMode
```tsx
// ❌ Wrong
<input {...register('phone')} />

// ✅ Correct
<input 
  type="tel" 
  inputMode="tel"
  {...register('phone')} 
/>
```

### Issue: Date input allows future dates
**Solution**: Add max attribute
```tsx
<input 
  type="date"
  max={new Date().toISOString().split('T')[0]}
  {...register('birth_date')} 
/>
```

## 📚 Related Documentation

- [Full Component Documentation](./PROFILE-COMPONENTS-REDESIGN.md)
- [Implementation Guide](../app/(auth)/profile-setup/PROFILE-SETUP-IMPLEMENTATION.md)
- [Changelog](../app/(auth)/profile-setup/REDESIGN-CHANGELOG.md)
- [Before/After Comparison](../app/(auth)/profile-setup/BEFORE-AFTER-COMPARISON.md)

---

**Last Updated**: March 6, 2026
**Version**: 2.0
**Quick Reference**: Always up-to-date
