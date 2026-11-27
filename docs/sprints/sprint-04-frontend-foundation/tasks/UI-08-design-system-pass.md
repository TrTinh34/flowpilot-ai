# UI-08 — Design System Consistency Pass

## Thông tin Task

- Task ID — UI-08
- Sprint — [Sprint 04](../README.md)
- Priority — P2
- Trạng thái — PENDING
- Effort — S (0.5–1 ngày)
- Dependencies — UI-01–07
- Related Requirements — NFR-05, NFR-02

## Objective

Review toàn bộ màn hình đã implement, đảm bảo typography, spacing, màu sắc, icon sizing nhất quán. Fix bất kỳ visual regression nào so với design system.

## Scope

### Typography audit

- Heading levels đúng (`h1`, `h2`, `h3`) theo page hierarchy
- Font size đúng scale (body: 14px, secondary: 13px, caption: 12px)
- Letter spacing tight cho headings

### Spacing audit

- 4px base grid compliance
- Consistent padding trên Page containers (24px mobile, 32px desktop)
- Card internal padding 16–24px

### Color audit

- Không có hardcoded hex trong components
- Primary button = `#6366f1` (không dùng CSS token mà sai dark mode)
- Error text = `var(--color-error-text)` = `#dc2626`
- Border = `var(--border)` = `#e2e8f0`

### Component sizing audit

- Input: `h-11` (44px), `rounded-lg`
- Button: `h-11` (44px), `rounded-lg`
- Icon: 16px inline, 20px standalone

### Accessibility audit

- Focus ring visible trên mọi interactive element
- Không có placeholder làm label
- `aria-label` đầy đủ trên icon buttons
- Color contrast kiểm tra primary trên background

### Responsive audit

Kiểm tra ở 390px, 768px, 1024px, 1440px:
- Không có horizontal overflow
- Sidebar collapse đúng
- Dashboard cards stack đúng
- Form full-width trên mobile

### Dark mode smoke

- Toggle `.dark` class trên `<html>`
- Verify không có unthemed element

## Acceptance Criteria

- AC-08-01: Mọi màn hình có consistent font sizes và weights
- AC-08-02: Không có hardcoded màu hex trong components
- AC-08-03: Không có horizontal overflow ở 390px
- AC-08-04: Focus ring visible trên mọi interactive element
- AC-08-05: Typecheck và lint pass sau changes

## Development Report Reference

`docs/reports/frontend/UI-08-design-system-pass.md`

## Next Task

UI-09 — Frontend Foundation Testing & Review.
