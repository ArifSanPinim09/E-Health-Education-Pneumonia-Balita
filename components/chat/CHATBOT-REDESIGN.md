# Chatbot Redesign - Konsisten dengan Design System

## Perubahan dari Template ke Institutional

### BEFORE (Template Style)
```
❌ Gradient purple-blue-cyan
❌ Rounded-full (circle button)
❌ Shadow-2xl dengan glow effect
❌ Bounce animation infinite
❌ "Belajar dengan AI ✨"
❌ "AI Assistant - Powered by Gemini"
❌ Rounded-2xl untuk messages
❌ Gradient untuk user messages
```

### AFTER (Institutional Style)
```
✅ Deep Sage solid (#2F5D50)
✅ Rounded-lg (8px max)
✅ Shadow-sm minimal
✅ No bounce animation
✅ "Tanya AI tentang Pneumonia"
✅ "Asisten Edukasi - Tanya tentang pneumonia"
✅ Rounded-lg untuk messages
✅ Solid sage untuk user messages
```

## Design Changes

### Floating Button
**Before:**
- Size: 16x16 (64px)
- Shape: Circle (rounded-full)
- Color: Gradient purple-blue-cyan
- Shadow: Heavy with glow
- Animation: Bounce + scale on hover
- Tooltip: "Belajar dengan AI ✨"

**After:**
- Size: 14x14 (56px)
- Shape: Square with rounded-lg
- Color: Deep Sage (#2F5D50)
- Shadow: Minimal (shadow-sm)
- Animation: Subtle opacity transition
- Tooltip: "Tanya AI tentang Pneumonia"

### Chat Window
**Before:**
- Border radius: rounded-2xl (16px)
- Header: Gradient purple-blue-cyan
- Background: gray-50
- Messages: rounded-2xl
- Input: rounded-full
- Button: rounded-full with gradient

**After:**
- Border radius: rounded-lg (8px)
- Header: Solid Deep Sage
- Background: Warm Off White (#F4F7F5)
- Messages: rounded-lg
- Input: rounded-lg
- Button: rounded-lg with solid sage

### Color Mapping
| Element | Before | After |
|---------|--------|-------|
| Button BG | Purple-Blue Gradient | #2F5D50 |
| Header BG | Purple-Blue-Cyan Gradient | #2F5D50 |
| User Message | Purple-Blue Gradient | #2F5D50 |
| Assistant Message | White + Gray Border | White + Sage Border |
| Chat BG | Gray-50 | #F4F7F5 |
| Loading Spinner | Purple | #2F5D50 |

### Typography & Content
**Before:**
- "AI Assistant"
- "Powered by Gemini"
- "Belajar dengan AI ✨"
- "Ketik pesan Anda..."

**After:**
- "Asisten Edukasi"
- "Tanya tentang pneumonia"
- "Tanya AI tentang Pneumonia"
- "Tanyakan tentang pneumonia..."

## Design Principles Applied

1. **No Gradients** - Solid colors only
2. **Max Radius 8px** - rounded-lg, no rounded-2xl
3. **Minimal Shadows** - shadow-sm only
4. **No Animations** - Removed bounce effect
5. **Institutional Colors** - Deep Sage theme
6. **Educational Tone** - Focus on pneumonia education

## Consistency with Landing Page

### Color System
- Primary: #2F5D50 (Deep Sage) ✅
- Secondary: #F4F7F5 (Warm Off White) ✅
- Text: #1F2933 ✅
- Border: #2F5D50/10 or #2F5D50/20 ✅

### Border Radius
- Max: rounded-lg (8px) ✅
- No rounded-2xl ✅
- No rounded-full ✅

### Shadows
- Minimal: shadow-sm ✅
- No shadow-2xl ✅
- No glow effects ✅

### Animations
- Subtle transitions only ✅
- No bounce ✅
- No scale on hover ✅

## User Experience

### Before
- Flashy dan attention-grabbing
- Tech startup vibe
- Generic AI assistant

### After
- Calm dan professional
- Health education vibe
- Focused pneumonia assistant

## Technical Changes

```tsx
// Button
- className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-full shadow-2xl"
+ className="w-14 h-14 bg-[#2F5D50] rounded-lg shadow-sm"

// Header
- className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"
+ className="bg-[#2F5D50]"

// Chat Background
- className="bg-gray-50"
+ className="bg-[#F4F7F5]"

// User Message
- className="bg-gradient-to-r from-purple-600 to-blue-600"
+ className="bg-[#2F5D50]"

// Input
- className="rounded-full focus:ring-purple-500"
+ className="rounded-lg focus:ring-[#2F5D50]/30"

// Send Button
- className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
+ className="rounded-lg bg-[#2F5D50]"
```

## Result

Chatbot sekarang:
- ✅ Konsisten dengan landing page design
- ✅ Institutional dan professional
- ✅ Warm dan trustable
- ✅ Focused pada edukasi pneumonia
- ✅ Bukan generic AI assistant template

---

**Updated:** 6 Maret 2026  
**Design System:** Institutional Health Education Platform
