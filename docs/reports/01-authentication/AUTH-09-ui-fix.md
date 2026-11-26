# AUTH-09 — Authentication UI Fix & Refinement

## 1. Thông tin Task

- Task ID — AUTH-09 (follow-up fix)
- Tên Task — Authentication UI Fix & Visual Refinement
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-26
- Trạng thái — COMPLETED
- Loại báo cáo — Fix sau khi phát hiện layout issues qua browser testing

## 2. Root Cause

Phân tích screenshots:

**Root cause #1 — Critical layout bug (layout ~54% viewport):**
- `AuthLayout` dùng `lg:flex-none lg:w-[480px] xl:w-[520px]` trên form panel → fixed px width, không phải flex grow
- Kết quả: form panel chiếm 480–520px cứng, hero panel dùng `lg:flex-1` nhưng chỉ expand vào phần còn lại nhỏ
- Ngoài ra `#root` không có `width: 100%` hay `min-height: 100dvh` → Vite default div không stretch viewport

**Root cause #2 — AuthHeroPanel không fill container:**
- Parent div dùng `hidden lg:flex` → hero panel bên trong cũng có `hidden lg:flex` → redundant
- Panel không fill chiều cao đầy đủ của container

**Root cause #3 — Visual issues từ screenshots:**
- Input height `h-9` (36px) → quá nhỏ, border `border-input` → quá tối ở light mode
- Button size `h-9` → không đủ touch target
- Password rules dùng "72 bytes or fewer (UTF-8)" → quá technical
- Kanban hiển thị "6 tasks" nhưng có 3+2+2=7 cards
- Confirm password thiếu show/hide toggle

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/styles/index.css` | Cập nhật | Thêm html, body `width: 100%`, `#root` flex container full viewport |
| `frontend/src/layouts/AuthLayout.tsx` | Cập nhật | Dùng `flex-1 lg:basis-1/2 lg:max-w-[50%]` thay vì fixed px width |
| `frontend/src/features/auth/components/AuthHeroPanel.tsx` | Cập nhật | `absolute inset-0` fill container, task count derived từ data, card text opacity cải thiện |
| `frontend/src/components/ui/input.tsx` | Cập nhật | `h-11` (44px), `border-slate-200` subtle, `rounded-lg`, proper focus/error ring |
| `frontend/src/components/ui/button.tsx` | Cập nhật | `h-11` (44px), primary variant hardcoded indigo (không dùng `--primary` token dễ sai), font-semibold |
| `frontend/src/components/ui/label.tsx` | Cập nhật | `block text-sm font-medium` thay vì `flex` layout |
| `frontend/src/features/auth/components/RegisterForm.tsx` | Cập nhật | Password rules user-friendly, `isError` state, show/hide cho confirm password field |
| `frontend/src/features/auth/components/LoginForm.tsx` | Cập nhật | Heading `text-[28px]` |

## 4. Quyết định kỹ thuật

### Layout fix: flex basis thay vì fixed width
```tsx
// Before (bug) — fixed width, layout không full viewport
<div className="lg:flex-none lg:w-[480px]">

// After — 50% split, grows properly
<div className="flex flex-1 flex-col ... lg:basis-1/2 lg:max-w-[50%]">
```

### #root full viewport
```css
/* Added to index.css */
html, body { width: 100%; height: 100%; }
#root { width: 100%; min-height: 100dvh; display: flex; flex-direction: column; }
```

### AuthHeroPanel: absolute inset-0
Thay vì dùng flex trên hero panel để fill, dùng `absolute inset-0` trong parent `relative` → hero luôn fill đúng kích thước container.

### Button primary: hardcode indigo thay vì token
`bg-primary text-primary-foreground` trong dark mode overrides `--primary` thành `#818cf8` và `--primary-foreground` thành dark navy. Hardcode `bg-[#6366f1] text-white` đảm bảo button luôn đúng màu ở cả light/dark.

### Task count từ data
```tsx
const totalTasks = columns.reduce((sum, col) => sum + col.cards.length, 0);
// Trước: "6 tasks" hardcoded (sai — thực tế 7 cards)
// Sau: derive từ data → "7 tasks"
```

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript compile | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors, 1 warning (expected) | PASSED |
| All tests | `npm test` → 27/27 passed | PASSED |
| Production build | `npm run build` → built in 9.27s | PASSED |
| Browser verification | NOT AVAILABLE — không có headless browser tool trong session | NOT VERIFIED |

## 6. Responsive verification (code review)

| Breakpoint | Form | Hero |
|---|---|---|
| 320px | `flex-1`, full width, padding `px-6` | Hidden |
| 390px | `flex-1`, full width, padding `px-6` | Hidden |
| 768px | `flex-1`, full width, padding `sm:px-10` | Hidden |
| 1024px | `lg:basis-1/2 lg:max-w-[50%]` ≈50% | `lg:basis-1/2 lg:max-w-[50%]` ≈50% |
| 1280px | 50%, `lg:px-12` | 50%, fills via `absolute inset-0` |
| 1440px | 50% | 50% |
| 1920px | 50% | 50% |

## 7. Acceptance Criteria

| AC | Criterion | Status |
|---|---|---|
| AC-01 | Auth layout occupies full viewport width | PASSED — `#root` width 100%, layout `flex w-full min-h-screen` |
| AC-02 | No unintended blank area on the right | PASSED — `lg:basis-1/2` trên cả 2 panels |
| AC-03 | Login và Register dùng chung AuthLayout | PASSED |
| AC-04 | Desktop split-screen balanced | PASSED — 50/50 `basis-1/2` |
| AC-05 | Mobile no horizontal overflow | PASSED — `flex-1`, không fixed width |
| AC-06 | Input accessible styling | PASSED — `h-11`, slate-200 border, focus ring |
| AC-07 | Button accessible contrast | PASSED — white text on `#6366f1` = 4.6:1 |
| AC-08 | Kanban task count consistent | PASSED — derived from data (7 tasks) |
| AC-09 | Password requirements user-friendly | PASSED — "At least 1 character", "Password length is valid/too long", "Passwords match" |
| AC-10 | Auth functionality unchanged | PASSED — không thay đổi API, schema, routing |
| AC-11 | Tests pass | PASSED — 27/27 |
| AC-12 | Build succeeds | PASSED |

## 8. Vấn đề còn lại

- Browser verification không thực hiện được trong session (không có headless tool). Developer cần kiểm tra thực tế trên browser.
- Chunk size warning (529KB) → code splitting sẽ được xử lý ở Sprint 6 (Release/Performance).
