# Tasks — Frontend Design Foundation

**Spec ID:** frontend-design-foundation  
**Task ID:** AUTH-08  
**Sprint:** Sprint 01 — Foundation + AUTH

Các tasks được sắp xếp theo thứ tự implement. Mỗi task phải độc lập verifiable.

---

## Task 1 — Global Design System Foundation
**Task ID tham chiếu:** AUTH-08-T1  
**Sprint Task:** AUTH-08 (đây là deliverable chính)

**Objective:** Triển khai CSS design tokens và Tailwind configuration làm nền tảng cho toàn bộ frontend.

**Dependencies:**
- Tailwind CSS v4 đã cài (`@tailwindcss/vite` trong package.json)
- `src/styles/index.css` tồn tại
- Không cần dependencies mới

**Related requirements:** FR-DS-01, FR-DS-03, NFR-UI-05

**Deliverables:**

1. **`src/styles/index.css`** — cập nhật với đầy đủ CSS custom properties:
   - Brand colors (primary, secondary, accent-ai)
   - Light theme tokens (background, surface, surface-secondary, border, foreground variants)
   - Dark theme tokens (`.dark` class)
   - Semantic colors (success, warning, error, info)
   - Sidebar tokens
   - Focus ring
   - Font family declaration

2. **Inter font** — integrate vào `index.html` hoặc CSS `@import` từ Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **`tailwind.config` / `@theme` trong index.css** — extend Tailwind với brand colors để có classes như `bg-primary`, `text-primary`, `border-primary`.

**Acceptance Criteria:**
- [ ] CSS custom properties đầy đủ trong `:root` và `.dark`
- [ ] Inter font load và render trong browser
- [ ] `className="bg-primary text-white"` hiển thị đúng màu `#6366F1`
- [ ] Dark mode: `.dark` class trên `<html>` đổi màu background/surface/foreground
- [ ] `prefers-reduced-motion` được include trong CSS
- [ ] TypeScript compile không có errors

**Verification:** `npm run typecheck` pass; mở browser, toggle class `dark` trên `<html>`, verify màu thay đổi.

---

## Task 2 — shadcn/ui Setup và UI Primitive Components
**Task ID tham chiếu:** AUTH-09-T1  
**Sprint Task:** AUTH-09

**Objective:** Cài đặt và cấu hình shadcn/ui; thêm UI primitives cần thiết cho Authentication UI.

**Dependencies:**
- Task 1 hoàn thành (design tokens)
- `components.json` đã có (style: new-york, cssVariables: true)
- Node.js và npm

**Related requirements:** FR-AUTH-UI-01, FR-AUTH-UI-02

**Deliverables:**

1. **Install shadcn/ui-compatible dependencies:**
   ```bash
   # Chạy từ frontend/
   npx shadcn@latest add button input label card
   ```
   Các component cần thiết cho auth: `button`, `input`, `label`, `card`, `form` (nếu shadcn/ui có).

2. **Install React Hook Form + Zod:**
   ```bash
   npm install react-hook-form @hookform/resolvers zod
   ```

3. **Install Lucide React:**
   ```bash
   npm install lucide-react
   ```

4. **Verify `components.json`** — đảm bảo alias `@/components/ui` và `@/utils/cn.util` đúng.

5. **`src/components/ui/`** — sau khi shadcn add: Button.tsx, Input.tsx, Label.tsx, Card.tsx tồn tại với design tokens được apply.

**Acceptance Criteria:**
- [ ] `npm install` không có peer dependency conflicts
- [ ] shadcn components dùng `var(--border)`, `var(--background)`, v.v. từ index.css
- [ ] `import { Button } from '@/components/ui/button'` hoạt động
- [ ] `npm run typecheck` pass
- [ ] `npm test` pass (không phá existing tests)

---

## Task 3 — AuthLayout
**Task ID tham chiếu:** AUTH-09-T2  
**Sprint Task:** AUTH-09

**Objective:** Triển khai split-screen AuthLayout và AuthHeroPanel.

**Dependencies:**
- Task 1, Task 2

**Related requirements:** FR-AUTH-UI-01, NFR-UI-01

**Deliverables:**

1. **`src/layouts/AuthLayout.tsx`:**
   ```
   Structure:
   <div class="auth-root">           ← min-h-screen, flex
     <div class="form-side">         ← flex 1, max-w-sm, padding, centered
       <Logo />
       <slot children />
     </div>
     <div class="hero-side">         ← hidden lg:flex, flex 1, indigo gradient
       <AuthHeroPanel />
     </div>
   </div>
   ```

2. **`src/features/auth/components/AuthHeroPanel.tsx`:**
   - Background gradient: `from-indigo-600 via-indigo-500 to-violet-600`
   - FlowPilot AI logo (white/light variant)
   - SVG Kanban board preview (geometric, không dùng screenshots)
   - Tagline: "Plan smarter. Build together."
   - Subtitle text
   - Responsive: hidden `< 1024px`

3. **`src/components/common/Logo.tsx`:**
   - Geometric SVG logo
   - Accepts `className` prop
   - `currentColor` cho màu

**Acceptance Criteria:**
- [ ] AuthLayout render đúng split-screen ở ≥ 1024px
- [ ] Hero panel ẩn ở < 1024px
- [ ] Logo SVG render trong cả light và dark theme
- [ ] Không có overflow ngang ở bất kỳ breakpoint nào
- [ ] `npm run typecheck` pass

---

## Task 4 — LoginForm và LoginPage
**Task ID tham chiếu:** AUTH-09-T3  
**Sprint Task:** AUTH-09

**Objective:** Triển khai LoginForm với React Hook Form, Zod, và tất cả UI states. Route `/login`.

**Dependencies:**
- Task 1, Task 2, Task 3

**Related requirements:** FR-AUTH-UI-01, FR-AUTH-UI-03, FR-AUTH-UI-04, FR-AUTH-UI-05, FR-AUTH-UI-07, NFR-UI-02

**Deliverables:**

1. **`src/features/auth/schemas/auth.schema.ts`:**
   - `loginSchema` (email, password validation)
   - `registerSchema` (displayName, email, password, confirmPassword)
   - `registerApiSchema` (omit confirmPassword)
   - Export types

2. **`src/features/auth/components/LoginForm.tsx`:**
   - React Hook Form + `zodResolver(loginSchema)`
   - Fields: email input, password input (with show/hide Eye icon button)
   - Submit button ("Sign In") với loading spinner (Lucide `Loader2`)
   - Form-level error alert (API errors)
   - Link → `/register`
   - `onSubmit` nhận callback prop từ page (form chỉ handle validation, page handle API)

3. **`src/pages/auth/LoginPage.tsx`:**
   - Compose: `AuthLayout` + `LoginForm`
   - `onSubmit` gọi `auth.api.ts` login function (stub nếu chưa có)
   - Handle API error → pass lại form

4. **Router update** (`src/app/router/AppRouter.tsx`):
   ```tsx
   <Route path="/login" element={<LoginPage />} />
   <Route path="/register" element={<RegisterPage />} />
   ```

**Acceptance Criteria:**
- [ ] Form render đúng fields theo OpenAPI /auth/login (email, password)
- [ ] Submit với email trống: error "Email is required" xuất hiện
- [ ] Submit với email sai format: error hiển thị
- [ ] Submit với password trống: error hiển thị
- [ ] Loading spinner hiển thị khi submitting
- [ ] Submit button disabled khi loading
- [ ] Link `/register` navigate đúng
- [ ] Keyboard: Tab qua form, Enter submit
- [ ] `aria-invalid`, `aria-describedby` trên field lỗi
- [ ] `npm run typecheck` pass; `npm test` pass

---

## Task 5 — RegisterForm và RegisterPage
**Task ID tham chiếu:** AUTH-09-T4  
**Sprint Task:** AUTH-09

**Objective:** Triển khai RegisterForm, password guidance, success state, route `/register`.

**Dependencies:**
- Task 1–4

**Related requirements:** FR-AUTH-UI-02, FR-AUTH-UI-03, FR-AUTH-UI-04, FR-AUTH-UI-05, FR-AUTH-UI-06

**Deliverables:**

1. **`src/features/auth/components/RegisterForm.tsx`:**
   - Fields: displayName, email, password, confirmPassword
   - Password guidance: 3 rules hiển thị dynamic:
     - ✓ Không được trống
     - ✓ ≤ 72 bytes (note: UTF-8)
     - ✓ Mật khẩu xác nhận khớp
   - Submit: "Create Account" + Loader2 spinner
   - Form-level error alert
   - Link → `/login`

2. **`src/pages/auth/RegisterPage.tsx`:**
   - Compose: `AuthLayout` + `RegisterForm`
   - Success state: thông báo thành công + link đến login

3. **API payload:** `omit({ confirmPassword: true })` trước khi gọi API

**Acceptance Criteria:**
- [ ] Tất cả 4 fields có visible label
- [ ] confirmPassword không được include trong API call payload
- [ ] Password rules indicator hiển thị/đổi màu theo input
- [ ] 409 error: "Email này đã được đăng ký"
- [ ] Success state hiển thị sau register
- [ ] `npm run typecheck` pass; `npm test` pass

---

## Task 6 — Authentication State và Protected Routes
**Task ID tham chiếu:** AUTH-10  
**Sprint Task:** AUTH-10

**Objective:** Triển khai Zustand auth store, protected routes, và session management.

**Dependencies:**
- Task 4, Task 5
- Zustand (cần install: `npm install zustand`)
- AUTH-07 cho GET /me endpoint (nếu available)

**Related requirements:** FR-AUTH-UI-07, NFR-UI-04

**Deliverables:**

1. **`src/app/store/auth.store.ts`:**
   ```typescript
   interface AuthState {
     accessToken: string | null;
     expiresAt: number | null;
     user: { id: string; email: string; displayName: string } | null;
     setAuth: (token: string, expiresIn: number, user: AuthState['user']) => void;
     clearAuth: () => void;
   }
   ```

2. **`src/app/router/ProtectedRoute.tsx`:**
   - Đọc `auth.store`
   - Nếu không có token: redirect `/login`
   - Nếu có token: render `<Outlet />`

3. **Router update:** wrap authenticated routes trong `ProtectedRoute`

4. **API interceptor** (axios): 401 → gọi `/auth/refresh` (single-flight), retry, nếu fail → clearAuth + redirect `/login`

**Acceptance Criteria:**
- [ ] Unauthenticated user truy cập `/` → redirect `/login`
- [ ] Authenticated user truy cập `/login` → redirect `/`
- [ ] Logout clears token và redirect `/login`
- [ ] `npm test` pass

---

## Task 7 — Frontend–Backend Integration
**Task ID tham chiếu:** AUTH-11  
**Sprint Task:** AUTH-11

**Objective:** Kết nối forms với backend APIs, verify full login/register/logout flow.

**Dependencies:**
- Task 1–6
- AUTH-02, AUTH-03 (backend APIs): COMPLETED
- AUTH-05 (logout): COMPLETED

**Related requirements:** FR-AUTH-UI-01, FR-AUTH-UI-02, FR-AUTH-UI-06, NFR-UI-04

**Deliverables:**

1. **`src/features/auth/api/auth.api.ts`:**
   ```typescript
   export async function login(payload: LoginInput): Promise<AuthResponse>
   export async function register(payload: RegisterInput): Promise<RegisterResponse>
   export async function logout(): Promise<void>
   export async function refreshToken(): Promise<AuthResponse>
   ```

2. **`src/features/auth/types/auth.types.ts`:**
   - `AuthResponse`: `{ accessToken: string; expiresIn: number }`
   - `LoginInput`, `RegisterInput`

3. **LoginForm/RegisterForm update:** gọi API thực, handle response, update auth.store

4. **Verify:** Login với credentials đúng → token trong store; refresh cookie set bởi backend

**Acceptance Criteria:**
- [ ] Login với backend thực → accessToken trong store
- [ ] Register với email mới → success response
- [ ] Register với email trùng → 409 error hiển thị đúng
- [ ] Login sai credentials → 401 hiển thị đúng
- [ ] Logout → token cleared, redirect `/login`
- [ ] `npm run build` pass

---

## Task 8 — Component Tests
**Task ID tham chiếu:** AUTH-12-T1  
**Sprint Task:** AUTH-12

**Objective:** Viết Vitest + RTL tests cho auth components.

**Dependencies:**
- Task 1–7

**Related requirements:** NFR-UI-02 (accessibility testing)

**Deliverables:**

Tests tối thiểu:

1. **`tests/features/auth/LoginForm.test.tsx`:**
   - Render: 2 fields, submit button, register link hiển thị
   - Validation: submit empty → errors
   - Loading: button disabled khi submitting
   - API error: error message hiển thị

2. **`tests/features/auth/RegisterForm.test.tsx`:**
   - Render: 4 fields đúng
   - Validation: confirmPassword không khớp → error
   - API payload: confirmPassword bị strip

3. **`tests/features/auth/auth.schema.test.ts`:**
   - loginSchema parse valid/invalid
   - registerSchema refine confirmPassword

**Acceptance Criteria:**
- [ ] `npm test` pass (tất cả tests xanh)
- [ ] Coverage includes happy path và error paths
- [ ] Không có RTL `act()` warnings

---

## Thứ tự triển khai đề xuất

```
Task 1 (Tokens) → Task 2 (shadcn/ui) → Task 3 (AuthLayout)
  → Task 4 (LoginForm) → Task 5 (RegisterForm)
  → Task 6 (Auth State) → Task 7 (Integration) → Task 8 (Tests)
```

**Task 1–3** là phạm vi AUTH-08 (design + foundation). Task 4+ là AUTH-09 trở đi.

**AUTH-08 deliverable chính:** spec files này, design documentation, và Task 1 (CSS tokens).
