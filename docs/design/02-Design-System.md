# 02 — Design System

Chi tiết technical của design system. Nguồn thực thi: `frontend/src/styles/index.css` và Kiro spec [design.md](../../.kiro/specs/frontend-design-foundation/design.md).

## Color Tokens

### Light Theme (`:root`)

| Token | Value | OKLCH equivalent | Use |
|---|---|---|---|
| `--background` | `#F8FAFC` | `oklch(0.985 0.002 247)` | Page background |
| `--surface` | `#FFFFFF` | `oklch(1 0 0)` | Card, dialog, input bg |
| `--surface-secondary` | `#F1F5F9` | `oklch(0.961 0.005 247)` | Hover bg, secondary card |
| `--border` | `#E2E8F0` | `oklch(0.924 0.007 253)` | All borders |
| `--foreground` | `#0F172A` | `oklch(0.145 0.025 265)` | Primary text |
| `--foreground-secondary` | `#64748B` | `oklch(0.556 0.025 264)` | Secondary text, metadata |
| `--foreground-muted` | `#94A3B8` | `oklch(0.708 0.019 255)` | Placeholder, disabled |
| `--color-primary` | `#6366F1` | `oklch(0.585 0.233 277)` | Primary interactive |
| `--color-primary-hover` | `#4F46E5` | `oklch(0.511 0.26 275)` | Primary hover |
| `--color-secondary` | `#8B5CF6` | `oklch(0.606 0.26 303)` | Secondary interactive |
| `--color-accent-ai` | `#A78BFA` | `oklch(0.717 0.231 304)` | AI features |
| `--color-success` | `#22C55E` | `oklch(0.705 0.209 148)` | Success states |
| `--color-warning` | `#F59E0B` | `oklch(0.769 0.187 69)` | Warning states |
| `--color-error` | `#EF4444` | `oklch(0.627 0.248 29)` | Error background/icon |
| `--color-error-text` | `#DC2626` | `oklch(0.577 0.245 28)` | Error body text (4.5:1) |
| `--color-info` | `#3B82F6` | `oklch(0.623 0.214 258)` | Info states |
| `--sidebar-bg` | `#FFFFFF` | — | Sidebar background |
| `--sidebar-border` | `#E2E8F0` | — | Sidebar right border |
| `--focus-ring` | `rgba(99,102,241,0.4)` | — | Focus ring color |

### Dark Theme (`.dark`)

| Token | Value |
|---|---|
| `--background` | `#09090B` |
| `--surface` | `#18181B` |
| `--surface-secondary` | `#111113` |
| `--border` | `#27272A` |
| `--foreground` | `#FAFAFA` |
| `--foreground-secondary` | `#A1A1AA` |
| `--foreground-muted` | `#71717A` |
| `--sidebar-bg` | `#111113` |
| `--sidebar-border` | `#27272A` |

Brand và semantic colors giữ nguyên trong dark theme (đã verify contrast).

## Typography

**Font stack:**
```css
font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

**Loading:** Google Fonts preconnect + stylesheet trong `index.html`.

**Scale:**

| Class | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `.text-display` | 40px / 2.5rem | 1.1 | 700 | Hero headings |
| `.text-page` | 28px / 1.75rem | 1.2 | 600 | Page title |
| `.text-section` | 18px / 1.125rem | 1.4 | 600 | Section |
| `.text-card` | 15px / 0.9375rem | 1.5 | 500 | Card title |
| `.text-body` | 14px / 0.875rem | 1.6 | 400 | Body (default) |
| `.text-secondary` | 13px / 0.8125rem | 1.5 | 400 | Meta info |
| `.text-caption` | 12px / 0.75rem | 1.4 | 400 | Caption |

## Spacing Reference

Tailwind 4px grid. Recommended usage:

| Tailwind | px | Use case |
|---|---|---|
| `p-1` | 4px | Compact padding (badge, chip) |
| `p-2` | 8px | Small padding (compact button) |
| `p-3` | 12px | Form input padding horizontal |
| `p-4` | 16px | Card padding, field gap |
| `p-6` | 24px | Section padding, page content |
| `p-8` | 32px | Page padding desktop |
| `p-12` | 48px | Large section spacing |
| `p-16` | 64px | Hero padding |

## Component Specification

### Button

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `--color-primary` | white | none | `--color-primary-hover` |
| `secondary` | `--surface-secondary` | `--foreground` | 1px `--border` | slightly darker |
| `ghost` | transparent | `--foreground` | none | `--surface-secondary` |
| `destructive` | `#FEE2E2` | `#DC2626` | `#FECACA` | slightly darker |
| `link` | transparent | `--color-primary` | none | underline |

Heights: `sm` = 32px, `default` = 36px, `lg` = 40px. Radius: 6px.

### Input

- Height: 36px
- Radius: 6px
- Border: 1px `--border`
- Background: `--surface`
- Focus: ring 2px `--focus-ring`, border `--color-primary`
- Error state: border `--color-error`, ring `--color-error` / 0.3
- Placeholder: `--foreground-muted`

### Card

- Background: `--surface`
- Border: 1px `--border`
- Radius: 8px
- Padding: 16–24px
- Shadow: `shadow-xs` only

### Badge / Status Chip

- Height: 22px, padding `px-2`
- Radius: 4px (default), 999px (pill)
- Variants match semantic colors
- Status indicator: dot + label (không chỉ màu)

### Error Text

- Color: `--color-error-text` (`#DC2626`)
- Size: 12px
- Prefix: `×` hoặc error icon (Lucide `AlertCircle` 14px)

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Tailwind CSS v4 Configuration

Với Tailwind v4, dùng `@theme` trong CSS thay vì `tailwind.config.js`:

```css
@theme {
  --color-primary: #6366F1;
  --color-primary-hover: #4F46E5;
  --color-secondary: #8B5CF6;
  --color-accent-ai: #A78BFA;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius: 0.375rem; /* 6px */
}
```

Sau đó dùng: `bg-primary`, `text-primary`, `text-accent-ai`, v.v.
