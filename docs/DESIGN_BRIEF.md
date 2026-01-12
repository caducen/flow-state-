# Design Brief: Flow State Logo & Favicon System

## Overview

Create a set of 3D arrow/pointer icons to serve as the visual identity for Flow State. The arrows represent direction and progress, aligning with the app's purpose of helping users navigate their tasks and stay in flow.

---

## What You Need to Create

### Three Arrow Variants

| Variant | Direction | Color | Meaning |
|---------|-----------|-------|---------|
| 1 | ↗ Up-right (45°) | **Green** | Progress, positive, on track |
| 2 | → Right (0°) | **Blue** | Neutral, steady, maintaining |
| 3 | ↘ Down-right (-45°) | **Red/Orange** | Needs attention, falling behind |

### Sizes Needed

| Use Case | Size | Format |
|----------|------|--------|
| Favicon | 32x32px, 16x16px | `.ico` or `.png` |
| Apple Touch Icon | 180x180px | `.png` |
| App Header Logo | 64x64px or 128x128px | `.png` or `.svg` |
| Open Graph (social sharing) | 1200x630px (with padding) | `.png` |

---

## Visual Style Specifications

### Reference: Glossy 3D Look
The style should match a **polished plastic or ceramic** aesthetic:

- **Solid colors** — not translucent or glassy
- **Smooth, rounded surfaces** — soft edges, no sharp corners
- **Clear light source** — coming from top-left
- **Highlights** — bright reflection where light hits (top-left area)
- **Shadows** — darker shade on bottom-right
- **Subtle gradient** — within each color for depth
- **Dark background friendly** — icons should pop on dark surfaces

### Color Palette

```
GREEN (Progress)
- Main:      #7CB342 or similar lime-green
- Highlight: #9CCC65 (lighter)
- Shadow:    #558B2F (darker)

BLUE (Neutral)
- Main:      #2196F3 or similar sky-blue
- Highlight: #64B5F6 (lighter)
- Shadow:    #1565C0 (darker)

RED (Attention)
- Main:      #F4511E or similar orange-red
- Highlight: #FF7043 (lighter)
- Shadow:    #BF360C (darker)
```

### Arrow Shape
- Based on the existing favicon shape (triangular pointer)
- Smooth, rounded edges
- Slight 3D depth/thickness (not flat)
- The arrow should feel dynamic and directional

---

## Tools You Can Use

### Beginner-Friendly (Recommended to Start)

#### 1. **Canva** (Free) — easiest option
- Website: https://canva.com
- Has 3D-style elements and effects
- Good for quick mockups
- Limited for true 3D, but can achieve the look

#### 2. **Figma** (Free) — design standard
- Website: https://figma.com
- Great for 2D with gradient/shadow effects
- Many 3D icon plugins available
- Export to multiple sizes easily

#### 3. **Photopea** (Free) — Photoshop alternative
- Website: https://photopea.com
- Browser-based, no install needed
- Can create glossy effects with gradients and layer styles

### Intermediate (Better Results)

#### 4. **Spline** (Free) — 3D for beginners
- Website: https://spline.design
- Actual 3D modeling in the browser
- Easy to learn, made for designers
- Can export renders as PNG
- **Highly recommended for this project**

#### 5. **Vectary** (Free tier)
- Website: https://vectary.com
- 3D design tool in browser
- Good for glossy materials
- Export high-quality renders

### Advanced (Best Quality)

#### 6. **Blender** (Free) — industry standard
- Website: https://blender.org
- Full 3D modeling and rendering
- Steeper learning curve
- Best quality results
- Many YouTube tutorials for "glossy icon" style

---

## Step-by-Step Instructions

### Option A: Using Spline (Recommended)

1. **Go to** https://spline.design and create free account
2. **Create new project**
3. **Add a cone or custom shape** and modify to arrow shape
4. **Apply material:**
   - Type: Plastic or Glossy
   - Color: Green (#7CB342)
   - Roughness: Low (0.1-0.2)
   - Add subtle reflection
5. **Set up lighting:**
   - Add directional light from top-left
   - Soft shadows enabled
6. **Position camera** looking at arrow
7. **Export as PNG** with transparent background
8. **Duplicate and recolor** for blue and red variants
9. **Rotate arrow** for each direction variant

### Option B: Using Figma

1. **Create arrow shape** using pen tool
2. **Apply gradient fill:**
   - Linear gradient from top-left (light) to bottom-right (dark)
3. **Add inner shadow** for depth
4. **Add drop shadow** for 3D pop
5. **Add highlight ellipse** on top-left with blur
6. **Group and duplicate** for other colors
7. **Export at multiple sizes**

### Option C: Using AI Tools

You can use AI image generators with this prompt:

```
3D glossy arrow pointer icon, pointing up and to the right,
lime green color, polished plastic material, soft rounded edges,
studio lighting from top-left, dark gray background,
app icon style, high quality render, no text
```

Try these AI tools:
- **Midjourney** (paid)
- **DALL-E 3** via ChatGPT Plus (paid)
- **Leonardo.ai** (free tier available)
- **Ideogram** (free tier available)

---

## File Organization

Save your files in this structure:

```
flow-state/
├── public/
│   ├── favicon.ico          # Multi-size favicon
│   ├── icon-green.png       # 128x128 green arrow
│   ├── icon-blue.png        # 128x128 blue arrow
│   ├── icon-red.png         # 128x128 red arrow
│   ├── apple-touch-icon.png # 180x180 for iOS
│   └── og-image.png         # 1200x630 for social
```

---

## Implementation in Code

Once you have the assets, here's how to add them:

### 1. Favicon (in `app/layout.tsx`)

```tsx
export const metadata: Metadata = {
  title: 'Flow State',
  description: 'Calm-tech task management',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
```

### 2. Header Logo (in `app/page.tsx`)

```tsx
<header>
  <div className="flex items-center gap-3">
    <img src="/icon-green.png" alt="Flow State" className="w-8 h-8" />
    <h1>Flow State</h1>
  </div>
</header>
```

---

## Checklist

- [ ] Create green arrow (↗ up-right)
- [ ] Create blue arrow (→ right)
- [ ] Create red arrow (↘ down-right)
- [ ] Export at all required sizes
- [ ] Generate favicon.ico (multi-size)
- [ ] Test on dark background
- [ ] Add to project `/public` folder
- [ ] Update `layout.tsx` metadata
- [ ] Update header in `page.tsx`

---

## Resources & Tutorials

### Spline Tutorials
- "Spline 3D Tutorial for Beginners" — YouTube
- "Create 3D Icons in Spline" — YouTube

### Blender Tutorials
- "Blender 3D Icon Tutorial" — YouTube
- "Glossy Material in Blender" — YouTube

### Favicon Generators
- https://realfavicongenerator.net — Generate all favicon sizes
- https://favicon.io — Simple favicon generator

---

## Questions?

If you get stuck, come back and share:
1. Screenshots of what you've created
2. What tool you're using
3. What's not working

I can help guide you through any issues!
