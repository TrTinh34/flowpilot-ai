# Design — Frontend Design Foundation

**Spec ID:** frontend-design-foundation  
**Task ID:** AUTH-08

---

## 1. Product Visual Identity

**FlowPilot AI** được thiết kế như một premium commercial SaaS — minimalist, productivity-focused, professional. Visual identity riêng, không copy Linear/Notion/Vercel nhưng học hỏi sự compact, sạch và nhất quán từ họ.

**Nguyên tắc:**
1. **Compact nhưng readable** — density cao như Linear, nhưng vẫn dễ đọc
2. **Subtle borders** — 1px solid border, không dùng shadow heavy
3. **Restrained color** — indigo primary dùng ít, chủ yếu cho CTAs và active states
4. **Clear hierarchy** — typography scale và spacing rõ ràng
5. **Violet accent** — chỉ dùng cho AI-related features

---

## 2. Brand Identity

**Logo:** Geometric SVG inline. Hình dạng: 3 đường song song chéo (flow/stream) tạo cảm giác forward movement, kèm đường kết nối (collaboration). Hoạt động ở light và dark theme qua `currentColor`.

**Sử dụng logo:**
- Auth screens: ~32px height, brand color
- Sidebar: 24px height, cạnh chữ "FlowPilot AI" (semibold)

---

## 3. Design System

### 3.1 Color Tokens

Định nghĩa đầy đủ trong `frontend/src/styles/index.css`. Structure:

```css
:root {
  /* Brand */
  --color-primary: #6366F1;
  --color-primary-hover: #4F46E5;
  --color-secondary: #8B5CF6;
  --color-accent-ai: #A78BFA;

  /* Surfaces — Light */
  --background: #F8FAFC;
  --surface: #FFFFFF;
  --surface-secondary: #F1F5F9;
  --border: #E2E8F0;

  /* Text — Light */
  --foreground: #0F172A;
  --foreground-secondary: #64748B;
  --foreground-muted: #94A3B8;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Layout */
  --sidebar-bg: #FFFFFF;
  --sidebar-border: #E2E8F0;
  --focus-ring: rgba(99, 102, 241, 0.4);
}

.dark {
  --background: #09090B;
  --surface: #18181B;
  --surface-secondary: #111113;
  --border: #27272A;
  --foreground: #FAFAFA;
  --foreground-secondary: #A1A1AA;
  --foreground-muted: #71717A;
  --sidebar-bg: #111113;
  --sidebar-border: #27272A;
}
```

**Tailwind CSS v4 extension** (trong `index.css` qua `@theme`):

```css
@theme {
  --color-primary: #6366F1;
  --color-primary-hover: #4F46E5;
  --color-secondary: #8B5CF6;
  --color-accent-ai: #A78BFA;
  /* … semantic colors … */
}
```

Component dùng: `className="bg-[var(--surface)] text-[var(--foreground)]"` hoặc `bg-primary` nếu Tailwind theme đã map.

### 3.2 Contrast Verification (WCAG AA)

- Primary #6366F1 on white: 4.6:1 (AA pass cho text 14px+)
- Foreground #0F172A on #F8FAFC: 17.9:1
- Secondary #64748B on #FFFFFF: 4.7:1
- Foreground #FAFAFA on #09090B: 19.3:1
- Error #EF4444 on white: 3.9:1 (dùng cho text 14px bold hoặc ≥ 18px; cho body text error dùng #DC2626)

**Lưu ý:** Error text 14px regular dùng `#DC2626` thay vì `#EF4444` để đạt 4.5:1.

### 3.3 Typography

Font: **Inter** (variable, self-hosted qua `@fontsource-variable/inter` hoặc Google Fonts CDN).

**Fallback stack:** `Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.

| Token | Size | Line Height | Weight | Use |
|---|---|---|---|---|
| `text-display` | 36–48px | 1.1 | 700 | Auth hero heading |
| `text-page-title` | 28px | 1.2 | 600 | Page title trong app |
| `text-section-title` | 18px | 1.4 | 600 | Section header |
| `text-card-title` | 15px | 1.5 | 500 | Card title |
| `text-body` | 14px | 1.6 | 400 | Body text |
| `text-secondary` | 13px | 1.5 | 400 | Meta info |
| `text-caption` | 12px | 1.4 | 400 | Caption, timestamp |

### 3.4 Spacing

4px base. Tailwind default scale (1=4px, 2=8px, 4=16px, 6=24px, 8=32px).

- Page padding: 24px (mobile), 32px (desktop)
- Form field gap: 16px
- Card internal padding: 16–24px
- Sidebar width: 240px
- Topbar height: 56px

### 3.5 Component Sizing

| Element | Height | Radius | Border |
|---|---|---|---|
| Button (default) | 36px | 6px | 1px `--border` |
| Button (lg) | 40px | 6px | 1px |
| Input | 36px | 6px | 1px `--border` |
| Card | auto | 8px | 1px `--border` |
| Dialog | auto | 12px | 1px |
| Badge | 22px | 4px | none (pill) |

---

## 4. Component Architecture

### 4.1 Hierarchy

```
UI Primitives (shadcn/ui)      → Button, Input, Label, Card, Dialog, …
Shared Components (common/)    → ErrorBoundary, EmptyState, ErrorState, LoadingState
Layouts                         → AuthLayout, AppShellLayout
Feature Components (auth/)      → LoginForm, RegisterForm, AuthHeroPanel
Pages                           → LoginPage, RegisterPage (compose only)
```

### 4.2 Authentication Components

**`AuthLayout`** (`src/layouts/AuthLayout.tsx`):
- Split-screen: form area (left, 50%) + branded panel (right, 50%)
- Mobile: branded panel ẩn, form full-width
- Container: `max-w-md` form, centered vertically
- Logo ở top-left của form area

**`AuthHeroPanel`** (`src/features/auth/components/AuthHeroPanel.tsx`):
- Background: gradient indigo (#4F46E5 → #6366F1 → #8B5CF6)
- Geometric SVG composition — line-art Kanban board preview
- Tagline: "Plan smarter. Build together."
- Short description text
- Ẩn hoàn toàn ở < 1024px

**`LoginForm`** (`src/features/auth/components/LoginForm.tsx`):
- React Hook Form + Zod
- Fields: email, password (show/hide toggle)
- Submit button: "Sign In" + loading spinner
- API error banner (above submit button)
- Link: "Don't have an account? Create one"

**`RegisterForm`** (`src/features/auth/components/RegisterForm.tsx`):
- Fields: displayName, email, password, confirmPassword
- Password requirement guidance (dynamic checkmarks)
- Submit: "Create Account" + loading spinner
- API error banner
- Link: "Already have an account? Sign in"

### 4.3 Zod Schemas

```typescript
// src/features/auth/schemas/auth.schema.ts
import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const password = z
  .string()
  .min(1, 'Password is required')
  .refine((v) => Buffer.byteLength(v, 'utf8') <= 72, 'Password exceeds 72 bytes');

export const loginSchema = z.object({ email, password });

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Display name is required'),
    email,
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// API payload — confirmPassword bị strip trước khi gửi
export const registerApiSchema = registerSchema.omit({ confirmPassword: true });
```

**Lưu ý:** Không thêm password strength requirements (uppercase, symbol, …) vì backend không enforce. Chỉ enforce: non-empty, ≤ 72 bytes (bcrypt limit). Confirm password chỉ validate client-side.

---

## 5. Application Layout (Authenticated Shell — Sprint 2+)

**Layout:** Sidebar (240px) + Topbar (56px) + Main content.

**Sidebar contents:** Logo, workspace switcher, navigation (Overview, My Tasks, Inbox, Projects, Members, AI Planner, Workspace Settings), user account menu, collapse button.

**Chỉ render navigation items cho features đã implemented.** Future items chỉ xuất hiện khi Sprint tương ứng hoàn tất.

---

## 6. Navigation Architecture

### Sprint 1 routes:

```
/               → InitStatusPage (dev) → sau AUTH-10: redirect nếu authenticated
/login          → LoginPage (public)
/register       → RegisterPage (public)
*               → NotFoundPage
```

### Sprint 2+ (planned, không implement):

```
/workspace/:id              → WorkspaceDashboard
/workspace/:id/projects     → ProjectList
/project/:id/board         → KanbanBoard
/my-tasks                  → MyTasksPage
/inbox                     → NotificationInbox
/ai/planner                → AiPlannerPage
```

---

## 7. Responsive Strategy

**Breakpoints (Tailwind default):**
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px

**Auth screens:**
- < 1024px: single column, form full-width (max-w-md), hero panel ẩn
- ≥ 1024px: split-screen 2 cột

**App shell (Sprint 2+):**
- ≥ 1024px: sidebar persistent
- < 1024px: sidebar chuyển thành drawer (trigger từ hamburger button)
- < 768px: bottom nav hoặc compact drawer

---

## 8. Theme Strategy

- `.dark` class trên `<html>` element
- Default: theo `prefers-color-scheme`
- Theme switcher (Sprint 2): toggle trong topbar, persist qua localStorage (không phải token, chỉ theme — được phép)
- TanStack Query và Zustand không liên quan theme

---

## 9. State Management Boundaries

| State | Owner | Ví dụ |
|---|---|---|
| Access token | Zustand auth.store (in-memory) | accessToken, expiresAt |
| User profile | Zustand auth.store (hoặc TanStack Query nếu có GET /me) | user |
| Form state | React Hook Form | values, errors, isSubmitting |
| Server data | TanStack Query | workspaces, projects, tasks |
| UI state (sidebar) | Zustand ui.store | isSidebarOpen, activeWorkspaceId |
| Theme | CSS + localStorage | dark/light |

---

## 10. API Integration Strategy (Sprint 1 scope)

- Axios client (`api-client.ts`) đã cấu hình: `baseURL = VITE_API_BASE_URL`, `withCredentials: true`
- Auth endpoints qua `features/auth/api/auth.api.ts` (chưa implement — AUTH-09/11)
- Login response: `{ accessToken, expiresIn }` — accessToken vào Zustand, refresh tự động qua HttpOnly cookie
- **Single-flight refresh:** interceptor trên axios — nếu 401 và có refresh cookie, gọi `/auth/refresh` một lần (mutex/promise sharing), retry request gốc. Concurrent 401s share cùng promise.

---

## 11. Error Handling

**Form-level:** alert/banner component hiển thị API error message.

**Mapping (theo backend error-codes):**

| HTTP | Case | User message |
|---|---|---|
| 401 login | Sai credentials | "Email hoặc mật khẩu không đúng" |
| 409 register | Email exists | "Email này đã được đăng ký" |
| 400/422 | Validation | API message |
| 429 | Rate limit | "Quá nhiều yêu cầu. Vui lòng đợi." |
| Network | Không kết nối | "Không thể kết nối. Vui lòng thử lại." |
| 500+ | Server | "Lỗi hệ thống. Vui lòng thử lại sau." |

---

## 12. Accessibility Strategy

- Form labels: `<Label htmlFor>` cho mọi input
- Error: `aria-describedby="field-error"` + `aria-invalid`
- Global error: `role="alert"` hoặc `aria-live="assertive"`
- Loading: `aria-busy` trên form + visually-hidden "Signing in…"
- Focus management: dialog mở → focus vào first focusable; đóng → restore
- Password toggle: `aria-label="Show password"` / `aria-label="Hide password"`
- Contrast: đã verify ở 3.2

---

## 13. Testing Strategy

- **Unit (Vitest):** Zod schemas — valid/invalid cases cho login và register
- **Component (RTL):** form render, validation error hiển thị, submit flow, loading state, API error mapping
- **E2E (Playwright, Sprint 6):** full login/register flows
- **Accessibility:** axe-core trong RTL tests (nếu được thêm) hoặc manual keyboard/screen reader check

**Backend tests không bị ảnh hưởng** — frontend-only spec này.

---

## 14. Wireframes

Xem `docs/design/wireframes/` cho auth screens ASCII/SVG mockups.
