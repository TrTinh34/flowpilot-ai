---
inclusion: auto
name: ui-design-system
description: FlowPilot AI design system: tokens, typography, spacing, component conventions, accessibility
---

# UI Design System — FlowPilot AI

## Visual Identity

**Style:** Modern SaaS — Minimalist, Professional, Productivity-focused.  
**Inspirations:** Linear (compact nav), Vercel (typography/spacing), Notion (workspace UX), ClickUp (PM features).  
**Logo:** Geometric SVG, inline — không dùng external image dependency. Works in light/dark.

## Color Tokens (CSS Custom Properties)

Định nghĩa đầy đủ trong `frontend/src/styles/index.css`.

### Brand
```
--color-primary: #6366F1
--color-primary-hover: #4F46E5
--color-secondary: #8B5CF6
--color-accent-ai: #A78BFA
```

### Light Theme (`:root`)
```
--background: #F8FAFC
--surface: #FFFFFF
--surface-secondary: #F1F5F9
--border: #E2E8F0
--foreground: #0F172A
--foreground-secondary: #64748B
--foreground-muted: #94A3B8
```

### Dark Theme (`.dark`)
```
--background: #09090B
--surface: #18181B
--surface-secondary: #111113
--border: #27272A
--foreground: #FAFAFA
--foreground-secondary: #A1A1AA
```

### Semantic
```
--color-success: #22C55E
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #3B82F6
```

## Typography

**Primary font:** Inter (Google Fonts).  
**Monospace:** JetBrains Mono (code blocks, IDs).

| Use | Size | Weight |
|---|---|---|
| Display | 36–48px | 700 |
| Page Title | 28–32px | 600–700 |
| Section Title | 18–24px | 600 |
| Card Title | 14–16px | 500–600 |
| Body | 14px | 400 |
| Secondary / Meta | 12–13px | 400 |
| Caption | 11–12px | 400 |

## Spacing

4px base grid: `4, 8, 12, 16, 24, 32, 48, 64px`.  
Tailwind utility classes `p-1` → `p-16` map 1:1 (1 unit = 4px).

## Component Conventions

- **Border radius:** `rounded-md` (6px) cho inputs/buttons; `rounded-lg` (8px) cho cards/panels
- **Shadows:** Subtle — `shadow-xs`, `shadow-sm` maximum
- **Borders:** 1px solid `--border` — không dùng màu khác
- **Control height:** 36px (inputs, buttons default); 32px (compact); 40px (comfortable)
- **Icon size:** 16px inline, 20px standalone
- **Transitions:** 150ms ease-out — chỉ cho opacity/color/transform. `prefers-reduced-motion` support bắt buộc
- **Focus rings:** Visible, 2px offset, dùng `--color-primary`

## Do / Don't

✅ Làm:
- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<section>`)
- Visible focus indicators
- Label cho mọi form input
- Responsive từ 360px
- Light/dark support qua CSS variables

❌ Không làm:
- Excessive gradients / glassmorphism
- Border radius > 12px trên cards
- Heavy box shadows
- Decorative illustrations
- Placeholder thay label
- Hardcode màu hex trong components
- Generic "admin dashboard" appearance
