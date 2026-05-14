# Gushwork Web Dev Assignment
## Premium HDPE Pipes & Coils — Responsive Landing Page

> **Submitted by:** [Your Name]  
> **Date:** May 2025  
> **Assignment:** Responsive Web Page — Vanilla HTML, CSS & JavaScript

---

## 🔗 Live Demo
> *(Add your GitHub Pages URL here after deploying — see deployment section below)*  
> Example: `https://yourusername.github.io/gushwork-assignment/`

---

## 📁 File Structure

```
gushwork/
├── index.html      → Main HTML (semantic HTML5, accessible markup)
├── styles.css      → All styles (CSS variables, Flexbox/Grid, responsive)
├── script.js       → All JavaScript (sticky header, carousel, zoom)
└── README.md       → This documentation file
```

---

## ✅ Features Implemented

### 1. Sticky Header
- **Trigger:** Appears when user scrolls past 100% of the viewport height (first fold)
- **Hide:** Disappears when user scrolls back up into the first fold
- **Animation:** Smooth `translateY` CSS transition (350ms ease)
- **Backdrop:** Frosted glass effect using `backdrop-filter: blur(14px)`
- **Code:** `stickyHeader()` function in `script.js` — uses `requestAnimationFrame` for performance

### 2. Image Carousel with Zoom
- **Carousel:** Single-slide product image carousel in the hero section
- **Navigation:** Previous/Next arrow buttons + clickable dot indicators
- **Auto-play:** Advances every 4 seconds; pauses on hover/focus
- **Touch/Swipe:** Full swipe gesture support for mobile
- **Zoom on Hover:**
  - A circular magnifying lens tracks the cursor position
  - A `2.5×` zoomed preview panel appears beside the hovered image
  - Preview position dynamically adjusts to stay within bounds
  - Smooth show/hide transitions

### 3. Fully Responsive Design
| Breakpoint | Layout |
|---|---|
| Desktop (> 1024px) | Two-column hero, 3-column grids |
| Tablet (≤ 1024px) | Single-column hero, 2-column grids |
| Mobile (≤ 640px) | Stacked layout, hamburger nav |

### 4. Additional Features
- **Mobile Navigation** — Hamburger menu with animated icon and slide-down drawer
- **Scroll Reveal** — `IntersectionObserver`-based entrance animations for all sections
- **Stats Counter** — Animated count-up when statistics section enters viewport
- **Form Validation** — Client-side email/name validation with success state
- **Smooth Scroll** — All anchor links scroll smoothly with sticky header offset
- **Accessibility** — ARIA labels, semantic HTML5, focus-visible styles, reduced-motion support

---

## 🎨 Design Decisions

| Property | Value | Reason |
|---|---|---|
| Primary colour | `#E8600A` (orange) | Matches Figma brand CTA colour |
| Background | `#FFFFFF` / `#F8F9FB` | Matches Figma light theme |
| Dark sections | `#0D1B2A` (navy) | Specs table, footer, CTA — matches Figma |
| Font (display) | Outfit (Google Fonts) | Bold geometric — close to Figma display font |
| Font (body) | Inter (Google Fonts) | Clean, readable — matches Figma body text |

---

## 🛠 Technical Decisions

### CSS Architecture
- **CSS Custom Properties** (`--orange`, `--navy`, etc.) for consistent theming
- **CSS Grid** for feature cards, testimonials, portfolio, footer layouts
- **Flexbox** for navigation, buttons, inline elements
- **`clamp()`** for fluid typography that scales between breakpoints
- **`aspect-ratio`** for consistent image proportions across viewports

### JavaScript Architecture
Each feature is wrapped in an **IIFE (Immediately Invoked Function Expression)** to avoid polluting the global scope and keep each feature self-contained:

```
stickyHeader()    → Scroll listener + class toggle
mobileNav()       → Hamburger toggle + outside-click close
productCarousel() → Slide track + dots + auto-play + swipe
carouselZoom()    → Lens positioning + preview panel zoom
scrollReveal()    → IntersectionObserver for entrance animations
statsCounter()    → Count-up animation on viewport entry
contactForm()     → Email/name validation + success state
smoothScroll()    → Anchor scroll with offset
```

### Performance
- `requestAnimationFrame` throttles the scroll listener (sticky header)
- `IntersectionObserver` used instead of scroll listeners for reveal/counter
- Images use `loading="lazy"` for deferred loading
- CSS transitions used over JS animations where possible

### Accessibility
- All interactive elements have `aria-label` or visible labels
- `role` attributes on carousel region, list items, dots (tablist/tab)
- `prefers-reduced-motion` media query disables animations
- Focus-visible outlines on all interactive elements
- Semantic elements: `<header>`, `<nav>`, `<section>`, `<article>`, `<blockquote>`, `<footer>`

---

## 🚀 Running Locally

### Option A — Direct Open (simplest)
1. Extract the zip
2. Double-click `index.html` — opens in your browser, no server needed

### Option B — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500`

### Option C — Python
```bash
cd gushwork/
python3 -m http.server 8080
# Open: http://localhost:8080
```

---

## 🌐 Deploying to GitHub Pages

1. Create a free account at [github.com](https://github.com)
2. Click **+** → **New repository** → name it `gushwork-assignment` → Public → Create
3. Click **uploading an existing file** → drag in all 4 files → **Commit changes**
4. Go to **Settings** → **Pages** → Source: `main` branch → `/root` → **Save**
5. Wait ~2 minutes → live at `https://yourusername.github.io/gushwork-assignment/`
6. Add this URL to your submission email

---

## 📧 Pre-Submission Checklist

- [ ] Sticky header appears after scrolling past hero section
- [ ] Sticky header hides when scrolling back to top
- [ ] Carousel prev/next arrows work correctly
- [ ] Hovering a carousel image shows zoom lens + preview panel
- [ ] Page is responsive on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Contact form validates and shows success message
- [ ] Tested in Chrome, Firefox, and Edge
- [ ] All files attached: `index.html`, `styles.css`, `script.js`, `README.md`

---

## 🖥 Browser Compatibility

| Browser | Status |
|---|---|
| Chrome 100+ | ✅ Full support |
| Firefox 95+ | ✅ Full support |
| Edge 100+ | ✅ Full support |
| Safari 15+ | ✅ Full support |
| Mobile Chrome/Safari | ✅ Responsive + swipe |

---

*Assignment submitted for Gushwork Web Developer Position — May 2025*
