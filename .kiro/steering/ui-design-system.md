---
inclusion: auto
name: ui-design-system
description: FlowPilot AI design system V2: tokens, typography, spacing, component conventions, accessibility, ui-ux-pro-max workflow
---

# UI Design System — FlowPilot AI

> Nguồn chuẩn duy nhất cho Design System V2 (Proposed) là [Design System](../../docs/design/frontend/design-system.md), [Component Inventory](../../docs/design/frontend/component-inventory.md) và [Screen Specifications](../../docs/design/frontend/screen-specifications.md).
> Trước mọi task frontend, đọc `.agents/skills/ui-ux-pro-max/SKILL.md` và tuân thủ các token đã duyệt trong `frontend/src/styles/index.css`.

## Visual Identity

- **Style:** Minimalism & Flat B2B SaaS (Linear/Vercel/Notion/ClickUp inspired) — crisp 1px `--border` surfaces, subtle shadows (`shadow-xs`, `shadow-popover`, `shadow-dialog`), NO excessive glassmorphism/gradients.
- **Brand Colors (Preserved):** Primary Brand `#6366F1`, Primary Action `#4F46E5` (hover `#4338CA`, active `#3730A3`), AI Accent `#8B5CF6` / AI Text `#6D28D9`.
- **Light & Dark Surfaces:** Light `#F8FAFC` / `#FFFFFF` / `#F1F5F9` (`--border: #E2E8F0`); Dark `#09090B` / `#18181B` / `#111113` (`--border: #27272A`).
- **Status & Priority Tokens (V2):** Đầy đủ semantic text/bg/border cho `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE` và `LOW`, `MEDIUM`, `HIGH`, `URGENT` kèm icon + label text (`color-not-only`).

## Typography & Spacing

- **Fonts:** `Inter` (UI) + `JetBrains Mono` (code/IDs), dùng `tabular-nums` cho counts, dates, file sizes và KPIs.
- **Scale:** Page Title `28/36px`, Section Title `18–20/28px`, Card Title `15/22px`, UI Body `14/20px`, Caption `12/16px`.
- **Spacing:** 4px base grid (`4, 8, 12, 16, 24, 32, 48px`). Page gutter `16/24/32px`.
- **Control Heights (V2):** Desktop default `36px` (`h-9`), compact `32px` (`h-8`), comfortable `40px` (`h-10` cho Auth/Hero CTAs).
- **Border Radius (V2):** `6px` (`--radius`) cho inputs/buttons/selects, `8px` (`--radius-md`) cho cards/columns/panels, `12px` (`--radius-lg`) chỉ cho dialogs/popovers.
- **Shell Tokens:** `--topbar-height: 56px` (`h-14`), `--sidebar-width: 240px`, `--sidebar-rail-width: 64px`, `scroll-padding-top: var(--topbar-height)`.

## Do / Don't

- ✅ Dùng `border-border` / `border-input`, dùng shared `Avatar`, `Select`, `Textarea`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`, `LoadingState`, `EmptyState`, `ErrorState`, `FormErrorBanner`.
- ✅ Kiểm chứng WCAG 2.2 AA (`>= 4.5:1` text, `>= 3:1` controls), keyboard-only nav, `prefers-reduced-motion`, 200% zoom, `360–1920px`.
- ❌ Không dùng `border` trơn, `rounded-xl` trên card, inline `<select>`/`<textarea>`/avatar tự chế, `break-all` cho văn bản thường, hoặc emoji làm UI icon.
