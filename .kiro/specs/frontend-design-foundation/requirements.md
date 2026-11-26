# Requirements — Frontend Design Foundation

**Spec ID:** frontend-design-foundation  
**Task ID:** AUTH-08  
**Sprint:** Sprint 01 — Foundation + AUTH  
**Trạng thái:** DRAFT  
**Phụ thuộc:** AUTH-02 (Register API), AUTH-03 (Login API), FR-AUTH-01, UC-AUTH-01, NFR-05

---

## 1. Phạm vi

Spec này bao gồm **toàn bộ Design Foundation** của FlowPilot AI frontend và **Authentication UI** (Login, Register). Các Sprint sau sẽ mở rộng spec này bằng feature-specific requirements riêng.

Scope hiện tại (AUTH-08):
- Global design system và design tokens
- Authentication screens (Login, Register)
- Authentication user flows và error states
- Component architecture plan cho Sprint 1

Ngoài scope AUTH-08:
- Workspace, Project, Kanban, Dashboard, AI Planner, Notifications
- Zustand store implementation (AUTH-10)
- API integration (AUTH-11)
- E2E tests (AUTH-12)

---

## 2. User Stories

### US-AUTH-01 (Subset — UI)
> Là **Guest**, tôi muốn đăng ký và đăng nhập vào FlowPilot AI qua form rõ ràng, đẹp và dễ sử dụng, để tôi có thể bắt đầu sử dụng platform.

**Acceptance criteria:**
- Form hiển thị đúng các field theo OpenAPI contract
- Validation error xuất hiện inline, cụ thể
- Loading state hiển thị trong khi request đang xử lý
- Server error hiển thị bằng thông điệp người dùng có thể hiểu
- Form responsive từ 360px đến 1440px+
- Keyboard navigation hoàn chỉnh

### US-DS-01 (Design System)
> Là **Developer**, tôi muốn có design tokens nhất quán, để tôi có thể triển khai components theo đúng visual identity của FlowPilot AI.

**Acceptance criteria:**
- CSS custom properties định nghĩa đầy đủ cho light và dark theme
- Tailwind config mở rộng bằng brand colors
- Typography scale áp dụng qua font-size utilities
- Không có hardcoded màu hex trong components

---

## 3. Functional Requirements

### FR-DS-01 — Design Tokens
**WHEN** developer triển khai component mới  
**THE SYSTEM SHALL** cung cấp CSS custom properties đầy đủ cho background, foreground, surface, border, primary, secondary, accent, semantic colors (success, warning, error, info), sidebar, và chart colors.

**Acceptance:** `src/styles/index.css` định nghĩa tất cả tokens; light và dark variants được định nghĩa; Tailwind config extend đúng tokens.

---

### FR-DS-02 — Typography
**WHEN** user mở bất kỳ trang nào  
**THE SYSTEM SHALL** render text bằng Inter font với typography scale đúng quy định.

**Acceptance:** Inter được load từ Google Fonts hoặc self-hosted; fallback stack đúng; font-size scale nhất quán trong components.

---

### FR-DS-03 — Theme Support
**WHEN** user hoặc system thay đổi color scheme preference  
**THE SYSTEM SHALL** apply light hoặc dark theme tương ứng qua `.dark` class trên `<html>`.

**Acceptance:** Light/dark tokens đều được định nghĩa; không có color regression trong cả hai theme; `prefers-color-scheme` được dùng làm default.

---

### FR-AUTH-UI-01 — Login Screen
**WHEN** unauthenticated user truy cập `/login`  
**THE SYSTEM SHALL** render split-screen login page với form bên trái và branded panel bên phải.

**Form fields (theo OpenAPI /auth/login):**
- Email address (type email, required)
- Password (type password, required, with show/hide toggle)

**Actions:**
- Sign In button (submits form)
- Link đến Register page

**Acceptance:** Form render đúng; submit disabled khi invalid; loading spinner hiển thị khi submitting; navigation to Register hoạt động.

---

### FR-AUTH-UI-02 — Register Screen
**WHEN** unauthenticated user truy cập `/register`  
**THE SYSTEM SHALL** render registration page tái dùng AuthLayout.

**Form fields (theo OpenAPI /auth/register):**
- Display Name (required, min 1 character)
- Email address (type email, required)
- Password (required, bcrypt limit 72 bytes)
- Confirm Password (client-side only — không gửi lên API)

**Actions:**
- Create Account button
- Link đến Login page

**Acceptance:** Tất cả required fields có label; confirm password validation client-side only; không gửi confirmPassword lên API.

---

### FR-AUTH-UI-03 — Validation States
**WHEN** user submit form với dữ liệu không hợp lệ  
**THE SYSTEM SHALL** hiển thị validation error inline dưới field tương ứng mà không reload trang.

**Validations (client-side):**
- Email: format hợp lệ
- Password: không được trống; ≤ 72 bytes UTF-8
- Display Name: không được trống
- Confirm Password: phải khớp với Password

**Acceptance:** Error message xuất hiện khi blur hoặc submit; error bị xóa khi field được fix; không có generic "invalid" message.

---

### FR-AUTH-UI-04 — API Error States
**WHEN** API trả về error response  
**THE SYSTEM SHALL** hiển thị thông điệp lỗi phù hợp cho từng case.

**Error mapping:**
- 401 từ /login → "Email hoặc mật khẩu không đúng"
- 409 từ /register → "Email này đã được đăng ký"
- 400/422 → hiển thị message từ API response
- Network error / 500+ → "Không thể kết nối. Vui lòng thử lại."
- 429 → "Quá nhiều yêu cầu. Vui lòng đợi."

**Acceptance:** Error hiển thị ở form level (không chỉ console); error bị xóa khi user thử lại.

---

### FR-AUTH-UI-05 — Loading State
**WHEN** form đang submit  
**THE SYSTEM SHALL** disable submit button và hiển thị loading indicator.

**Acceptance:** Button disabled; spinner hiển thị; không thể submit form hai lần; form fields có thể vẫn được edit.

---

### FR-AUTH-UI-06 — Success Navigation
**WHEN** login thành công  
**THE SYSTEM SHALL** navigate user đến trang chính của app (tạm thời: `/`).

**WHEN** registration thành công  
**THE SYSTEM SHALL** hiển thị success message và navigate/prompt user đến login.

**Acceptance:** Navigation đúng sau success; không còn ở trang auth sau khi authenticated.

---

### FR-AUTH-UI-07 — Protected Routes
**WHEN** unauthenticated user truy cập protected route  
**THE SYSTEM SHALL** redirect về `/login`.

**WHEN** authenticated user truy cập `/login` hoặc `/register`  
**THE SYSTEM SHALL** redirect về dashboard hoặc main app.

**Acceptance:** Protected route hoạt động; auth user không thấy login page; redirect không tạo loop.

---

## 4. Non-functional Requirements

### NFR-UI-01 — Responsive Design
Áp dụng NFR-05 từ SRS: responsive từ 360px.

- **Mobile (360–767px):** Full-width form, single column, touch-friendly controls (min 44px touch target)
- **Tablet (768–1279px):** Wider form container, centered
- **Desktop (1280px+):** Split-screen auth layout

**Acceptance:** Không có horizontal scroll; form usable ở 360px; split panel ẩn ở mobile.

---

### NFR-UI-02 — Accessibility (WCAG 2.2 AA)
- Semantic HTML: `<form>`, `<label>`, `<input>`, `<button>` đúng cách
- Keyboard navigation: Tab qua tất cả interactive elements
- ARIA: `aria-describedby` cho errors; `aria-invalid` trên field lỗi; `aria-live` cho thông báo dynamic
- Color contrast: ≥ 4.5:1 cho text thường; ≥ 3:1 cho large text
- Focus indicators: Visible, không bị ẩn
- Error không chỉ dùng màu để phân biệt

**Acceptance:** VoiceOver/NVDA announce errors; Tab order logic; không có orphan labels.

---

### NFR-UI-03 — Performance
- Initial page load ≤ 3s trên simulated 4G
- Form interaction (typing, validation) không có lag > 50ms
- No CLS (Cumulative Layout Shift) > 0.1 khi loading states change

---

### NFR-UI-04 — Security (UI Level)
- Không lưu password vào state sau khi submit
- Không log access token hay password
- Refresh token không được read hoặc store từ frontend (HttpOnly cookie)
- Form autocomplete theo context: `email` → `username`, password → `current-password` (login) / `new-password` (register)

---

### NFR-UI-05 — Theme Consistency
- Tất cả components dùng CSS custom properties, không hardcode màu
- Không có unthemed element sau khi dark mode toggle
- Transitions ngắn gọn ≤ 200ms; `prefers-reduced-motion: reduce` được respect

---

## 5. Screen Inventory

| Screen | Route | Sprint | Status |
|---|---|---|---|
| Login | `/login` | 1 | AUTH-08/09 |
| Register | `/register` | 1 | AUTH-08/09 |
| App Shell (skeleton) | `/` | 1 | AUTH-09/10 |
| 404 Not Found | `*` | 1 | AUTH-09 |
| Workspace Dashboard | `/workspace/:id` | 2 | Future |
| Project Board | `/project/:id/board` | 3 | Future |
| AI Planner | `/ai/planner` | 5 | Future |

---

## 6. Dependencies

| Dependency | Type | Status |
|---|---|---|
| `POST /auth/register` OpenAPI contract | Backend | COMPLETED (AUTH-02) |
| `POST /auth/login` OpenAPI contract | Backend | COMPLETED (AUTH-03) |
| Backend validation rules | Backend | CONFIRMED (auth.schema.ts) |
| `GET /me` hoặc Current User endpoint | Backend | PARTIAL (AUTH-07, chưa có HTTP route) |
| Zustand cho auth store | Frontend | PENDING (AUTH-10) |
| shadcn/ui component installation | Frontend | PENDING (AUTH-09) |
| React Hook Form + Zod installation | Frontend | PENDING (AUTH-09) |

---

## 7. Scope Boundaries

**Trong scope AUTH-08:**
- Design system specification và CSS tokens
- Authentication screen designs và specifications
- User flow documentation
- Kiro spec files
- Design documentation

**Trong scope AUTH-09 (không implement ở AUTH-08):**
- shadcn/ui component installation
- React Hook Form + Zod installation
- Form implementation
- Route setup

**Ngoài scope Sprint 1:**
- OAuth, social login, forgot password, email verification
- Workspace UI, Project UI, Kanban
- Dashboard, Notifications, AI Planner
