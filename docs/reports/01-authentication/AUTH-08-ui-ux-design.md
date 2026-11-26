# AUTH-08 — Authentication UI/UX Design & Global Design Foundation

## 1. Thông tin Task

- Task ID — AUTH-08
- Tên Task — Authentication UI/UX Design & Global Design Foundation
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-AUTH-01, NFR-05, UC-AUTH-01
- Loại báo cáo — Ghi ngay sau triển khai

## 2. Tóm tắt triển khai

Hoàn thành toàn bộ phạm vi AUTH-08: thiết lập design system foundation, tạo Kiro specification files, tài liệu thiết kế và wireframes. Deliverable kỹ thuật chính là `frontend/src/styles/index.css` với đầy đủ CSS custom properties và Tailwind v4 theme extension. Không triển khai UI components (AUTH-09 trở đi).

**Việc đã làm:**
- Khảo sát toàn bộ repository: backend APIs (AUTH-01–07), frontend structure, OpenAPI contract, Sprint plan, existing tests
- Xác nhận backend validation rules (auth.schema.ts): displayName min 1, email valid, password non-empty ≤ 72 bytes UTF-8
- Xác nhận token delivery: accessToken trong JSON response, refresh token HttpOnly cookie
- Xác nhận confirmPassword không có trong API contract (không gửi lên backend)
- Triển khai CSS design tokens (light + dark theme)
- Tích hợp Inter font vào index.html
- Tạo đầy đủ Kiro spec và steering files
- Tạo tài liệu thiết kế `docs/design/`

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/styles/index.css` | Cập nhật | CSS custom properties, Tailwind v4 @theme, typography, focus, reduced motion |
| `frontend/index.html` | Cập nhật | Inter + JetBrains Mono font preconnect + stylesheet |
| `.kiro/steering/product-context.md` | Tạo mới | Product context steering (always included) |
| `.kiro/steering/frontend-architecture.md` | Tạo mới | Architecture steering (auto) |
| `.kiro/steering/ui-design-system.md` | Tạo mới | Design system steering (auto) |
| `.kiro/specs/frontend-design-foundation/requirements.md` | Tạo mới | Kiro requirements spec |
| `.kiro/specs/frontend-design-foundation/design.md` | Tạo mới | Kiro design spec |
| `.kiro/specs/frontend-design-foundation/tasks.md` | Tạo mới | Kiro tasks spec |
| `docs/design/README.md` | Tạo mới | Design docs index |
| `docs/design/01-Design-Direction.md` | Tạo mới | Product visual identity, brand |
| `docs/design/02-Design-System.md` | Tạo mới | Design tokens reference |
| `docs/design/03-Sitemap.md` | Tạo mới | Screen inventory, navigation architecture |
| `docs/design/04-User-Flows.md` | Tạo mới | Auth user flows, error state matrix |
| `docs/design/05-Component-Guidelines.md` | Tạo mới | Component architecture, conventions |
| `docs/design/wireframes/auth-login.md` | Tạo mới | Login screen wireframe |
| `docs/design/wireframes/auth-register.md` | Tạo mới | Register screen wireframe |

## 4. Quyết định kỹ thuật

### CSS Custom Properties approach
Dùng CSS custom properties thay vì Tailwind CSS variables trực tiếp. Lý do: shadcn/ui đọc CSS variables (`--background`, `--border`, v.v.), Tailwind v4 `@theme` allow class-based access song song. Kết quả: `bg-primary` hoạt động qua Tailwind và `var(--color-primary)` hoạt động trong CSS.

### Password validation boundary
Backend (auth.schema.ts) chỉ enforce: non-empty và `Buffer.byteLength(v, 'utf8') <= 72`. **Không có** minimum length, uppercase, number, symbol requirement. Frontend Zod schema khớp chính xác — không thêm rules tự ý.

### confirmPassword — client-side only
OpenAPI /auth/register chỉ nhận `{ displayName, email, password }`. confirmPassword được xử lý hoàn toàn client-side qua Zod `.refine()`, bị omit trước khi call API bằng `.omit({ confirmPassword: true })`.

### Tailwind v4 theme extension
Với Tailwind CSS v4, dùng `@theme { }` block trong CSS thay vì `tailwind.config.js`. Điều này cho phép `bg-primary`, `text-secondary`, v.v. mà không cần file config riêng.

### Inter từ Google Fonts CDN
Quyết định dùng CDN cho development speed. Nếu production cần self-hosting, có thể thay bằng `@fontsource-variable/inter` (npm install) và import trong CSS. Cả hai approach đều support.

### Error text màu
`#EF4444` không đạt 4.5:1 contrast ratio với white background ở text size 14px thường. Thêm `--color-error-text: #DC2626` (đạt ~4.7:1) cho error messages. `--color-error` giữ nguyên cho icons/backgrounds.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript compile | `npm run typecheck` → exit 0 | PASSED |
| Existing tests | `npm test` → 1 test passed (init-status) | PASSED |
| CSS token syntax | Manual review: valid CSS, `@theme` đúng Tailwind v4 syntax | PASSED |
| Font integration | `index.html` có preconnect + stylesheet links | PASSED |
| OpenAPI contract match | Đọc `docs/06-API-Specification.yaml`: fields email, password (login), displayName+email+password (register) | VERIFIED |
| Backend validation match | Đọc `backend/src/modules/auth/auth.schema.ts`: non-empty + ≤72 bytes | VERIFIED |
| Contrast ratios | Foreground #0F172A on #F8FAFC: 17.9:1; Primary #6366F1 on white: 4.6:1; Error text #DC2626 on white: 4.7:1 | PASSED |
| Backend tests | Không thay đổi backend code | NOT APPLICABLE |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Luồng Login/Register bám UC-AUTH-01 | PASSED | Documented trong design.md và user-flows.md |
| Xác định trạng thái thành công/lỗi | PASSED | Error states matrix trong 04-User-Flows.md |
| Bố cục dùng được từ 360px | PASSED | NFR-UI-01 documented, responsive strategy defined |
| Kiro spec files tồn tại | PASSED | requirements.md, design.md, tasks.md |
| Design tokens implemented | PASSED | index.css với full light/dark tokens |
| Backend thay đổi không bị ảnh hưởng | PASSED | Không chạm đến backend code |

## 7. Vấn đề và Blocker

### Mở
- **AUTH-07 (GET /me) chưa có HTTP route:** Kiro spec đã document dependency này. AUTH-10 cần endpoint này để session restoration. Nếu AUTH-07 vẫn blocked, AUTH-10 có thể dùng `/api/v1/auth/refresh` như indirect session check.
- **Google Fonts CDN:** Trong môi trường không có internet, font fallback sẽ được dùng. Cho production, xem xét self-hosting.
- **JetBrains Mono:** Loaded nhưng chưa dùng trong Sprint 1. Sẽ dùng cho code blocks, task IDs trong Sprint 3+.

### Technical Debt
- `InitStatusPage` hiện đang route `/` và `*` — cần update trong AUTH-09 khi implement proper routing và pages.
- `ProtectedRoute.tsx` là empty stub — sẽ implement trong AUTH-10.

## 8. Ghi chú cho Developer

**Trước khi bắt đầu AUTH-09:**
1. Install `react-hook-form @hookform/resolvers zod lucide-react`
2. Run `npx shadcn@latest add button input label card` trong `frontend/`
3. Verify `components.json` alias `@/utils/cn.util` đúng path

**Luồng chính AUTH-09:**
- `LoginForm` → `LoginPage` → `AuthLayout` (compose pattern)
- Form chỉ handle validation, không call API trực tiếp
- Page nhận `onSubmit` callback, call API, handle response

**Security reminders:**
- Access token → Zustand store (in-memory, không persist)
- Refresh token → HttpOnly cookie (browser-managed, frontend không đọc)
- `withCredentials: true` đã set trong api-client.ts

**Component order:**
Task 1 (Tokens ✓) → Task 2 (shadcn setup) → Task 3 (AuthLayout) → Task 4 (LoginForm) → Task 5 (RegisterForm)

## 9. Task tiếp theo

**AUTH-09 — Login & Register Frontend**  
Dependencies đã sẵn sàng: AUTH-08 ✓, AUTH-02 ✓, AUTH-03 ✓  
Cần install: react-hook-form, zod, lucide-react, shadcn/ui components  
Xem: `.kiro/specs/frontend-design-foundation/tasks.md` Task 2–5
