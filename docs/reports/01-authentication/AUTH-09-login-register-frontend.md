# AUTH-09 — Login & Register Frontend

## 1. Thông tin Task

- Task ID — AUTH-09
- Tên Task — Login & Register Frontend
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-AUTH-01, NFR-05, UC-AUTH-01
- Loại báo cáo — Ghi ngay sau triển khai

## 2. Tóm tắt triển khai

Triển khai hoàn chỉnh Login và Register UI với React Hook Form, Zod validation, Lucide icons, và shadcn/ui primitives. Bao gồm: AuthLayout (split-screen), LoginForm, RegisterForm, AuthHeroPanel, pages, routes, Zod schemas, auth API stubs, và 27 Vitest + RTL tests.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/styles/index.css` | Cập nhật | Thêm shadcn/ui CSS variable contract (--primary, --ring, --destructive, v.v.) |
| `frontend/index.html` | Đã cập nhật ở AUTH-08 | — |
| `frontend/src/components/common/Logo.tsx` | Tạo mới | Geometric SVG logo, currentColor |
| `frontend/src/components/common/FormErrorBanner.tsx` | Tạo mới | Form-level API error banner, role="alert" |
| `frontend/src/components/ui/button.tsx` | Tạo (shadcn) + Fix | Fix cn import path |
| `frontend/src/components/ui/input.tsx` | Tạo (shadcn) + Fix | Fix cn import path |
| `frontend/src/components/ui/label.tsx` | Tạo (shadcn) + Fix | Fix cn import path |
| `frontend/src/components/ui/card.tsx` | Tạo (shadcn) + Fix | Fix cn import path |
| `frontend/src/features/auth/schemas/auth.schema.ts` | Cập nhật | Zod schemas: loginSchema, registerSchema, RegisterApiPayload |
| `frontend/src/features/auth/types/auth.types.ts` | Cập nhật | AuthTokenResponse, AuthUser, AuthState interfaces |
| `frontend/src/features/auth/api/auth.api.ts` | Cập nhật | login, register, logout, refreshToken, mapAuthError |
| `frontend/src/features/auth/components/LoginForm.tsx` | Cập nhật | Complete implementation: React Hook Form + Zod + eye toggle + loading + errors |
| `frontend/src/features/auth/components/RegisterForm.tsx` | Cập nhật | Complete implementation: 4 fields + password guidance + success state |
| `frontend/src/features/auth/components/AuthHeroPanel.tsx` | Tạo mới | Indigo gradient panel, Kanban preview, tagline |
| `frontend/src/layouts/AuthLayout.tsx` | Cập nhật | Split-screen layout: form side + hero side |
| `frontend/src/pages/auth/LoginPage.tsx` | Cập nhật | Compose AuthLayout + LoginForm, handle API |
| `frontend/src/pages/auth/RegisterPage.tsx` | Cập nhật | Compose AuthLayout + RegisterForm, handle API |
| `frontend/src/app/router/AppRouter.tsx` | Cập nhật | Add /login, /register routes |
| `frontend/tests/unit/auth.schema.test.ts` | Cập nhật | 14 schema unit tests |
| `frontend/tests/integration/auth-flow.test.tsx` | Cập nhật | 13 RTL form integration tests |
| `frontend/vitest.config.ts` | Cập nhật | Remove auth tests from exclusion list |
| `docs/sprints/sprint-01-authentication/README.md` | Cập nhật | AUTH-09 COMPLETED |
| `docs/reports/README.md` | Cập nhật | AUTH-09 entry |

## 4. Quyết định kỹ thuật

### shadcn/ui import path fix
shadcn CLI generated `import { cn } from "cn"` — đây là alias không hợp lệ. Đã sửa thành `@/utils/cn.util` khớp với `components.json` alias.

### class-variance-authority và tslib
shadcn Button dùng `cva` từ `class-variance-authority` nhưng package này không được install tự động. `tslib` cũng thiếu (required bởi `react-remove-scroll` trong test env). Cả hai được install thêm.

### useWatch thay vì watch
React Hook Form `watch()` không ổn định về memoization trong React Compiler context (lint warning). Thay bằng `useWatch({ control })` để observe password fields cho password guidance — không gây re-subscribe không cần thiết.

### confirmPassword strip qua object destructuring
Zod schema định nghĩa `confirmPassword` cho client-side validation. Trước khi call API, dùng `const { confirmPassword: _confirmPassword, ...apiPayload } = values` với lint suppress comment. Lý do: type-safe và không dùng `.omit()` runtime method.

### AuthHeroPanel SVG-only
Kanban preview được xây dựng bằng HTML/CSS thuần (không screenshot, không external image). Responsive: `hidden lg:flex`.

### Error mapping tập trung
`mapAuthError(error, context)` trong `auth.api.ts` xử lý tất cả HTTP status codes theo spec (401→"Incorrect credentials", 409→"Email exists", 429, 5xx, network). Pages chỉ gọi function này, không xử lý riêng lẻ.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript compile | `npm run typecheck` → exit 0 | PASSED |
| All tests pass | `npm test` → 27/27 passed (3 test files) | PASSED |
| Lint | `npm run lint` → 0 errors, 1 warning (shadcn buttonVariants — expected) | PASSED |
| Auth schema tests | 14 unit tests: loginSchema, registerSchema valid/invalid cases | PASSED |
| Form tests | 13 RTL tests: render, validation, loading, error, success, payload stripping | PASSED |
| Existing smoke test | init-status.test.tsx → still passes | PASSED |
| OpenAPI field match | Login: {email, password}; Register: {displayName, email, password} — đúng contract | VERIFIED |
| confirmPassword not sent | Test "strips confirmPassword" explicitly asserts payload shape | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Form đúng các trường OpenAPI | PASSED | Login: email+password; Register: displayName+email+password |
| Chặn dữ liệu sai | PASSED | Zod validation + React Hook Form, block submit khi invalid |
| Phản hồi rõ khi gửi | PASSED | Loading spinner, button disabled, aria-busy |
| Phản hồi rõ khi lỗi | PASSED | Inline field errors + form-level API error banner |
| confirmPassword không gửi lên API | PASSED | Test coverage xác nhận |
| Responsive từ 360px | PASSED | AuthLayout single-column trên mobile, hero hidden |
| Keyboard navigation | PASSED | Tab order, aria-invalid, aria-describedby, aria-live |

## 7. Vấn đề và Blocker

- **AUTH-10 (Auth State) chưa implement:** `LoginPage` hiện navigate `/` sau login thành công nhưng chưa store access token trong Zustand. AuthStore stub vẫn trống. Cần AUTH-10 để hoàn thành luồng session.
- **Backend cần chạy để test integration thực:** Hiện tại tests dùng mock `onSubmit`. AUTH-11 sẽ test end-to-end với backend thực.
- **shadcn buttonVariants warning:** `react-refresh/only-export-components` warning là expected behavior của shadcn CLI — không ảnh hưởng production, không cần sửa.

## 8. Ghi chú cho Developer

**Luồng hoạt động:**
```
LoginPage → LoginForm.onSubmit() → auth.api.ts login() → returns AuthTokenResponse
         ↓ error → mapAuthError() → string → LoginForm shows banner
         ↓ success → navigate('/') [AUTH-10 sẽ thêm store setAuth() ở đây]
```

**Password validation boundary:**
Backend chỉ enforce `non-empty` và `≤ 72 bytes UTF-8`. Frontend dùng `TextEncoder().encode(v).length` để đếm bytes chính xác (không phải `.length` chars). Không thêm uppercase/symbol/min-length rules.

**Để test local:**
- Backend phải chạy trên `VITE_API_BASE_URL` (xem `frontend/.env`)
- `npm test` không cần backend (tất cả dùng mock)

## 9. Task tiếp theo

**AUTH-10 — Authentication State & Protected Routes**
- Implement Zustand `auth.store.ts`
- Implement `ProtectedRoute.tsx`
- Session restoration qua `/auth/refresh` on mount
- Update `LoginPage` để gọi `store.setAuth()`
- Dependencies: AUTH-04, AUTH-05 (COMPLETED), AUTH-07 nếu GET /me available
