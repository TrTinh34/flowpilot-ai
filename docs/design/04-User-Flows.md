# 04 — User Flows (Authentication)

## Flow 1 — Login (Happy Path)

```
User truy cập /login
  │
  ├─ Session restored? (AUTH-10)
  │   └─ YES → redirect / (authenticated)
  │
  └─ NO → Render Login form
      │
      ├─ User nhập email hợp lệ + password
      ├─ Click "Sign In"
      │   ├─ Button disabled + spinner (loading state)
      │   ├─ POST /api/v1/auth/login { email, password }
      │   │
      │   ├─ 200 { accessToken, expiresIn }
      │   │   ├─ Store access token (in-memory, Zustand)
      │   │   ├─ Refresh cookie set bởi backend (HttpOnly)
      │   │   └─ Navigate to / (dashboard hoặc app shell)
      │   │
      │   ├─ 401 Invalid credentials
      │   │   └─ Form-level error: "Email hoặc mật khẩu không đúng"
      │   │
      │   ├─ 429 Rate limit
      │   │   └─ Form-level error: "Quá nhiều yêu cầu. Vui lòng đợi."
      │   │
      │   └─ Network error / 500
      │       └─ Form-level error: "Không thể kết nối. Vui lòng thử lại."
      │
      └─ Clear error khi user re-focus field / retry
```

## Flow 2 — Login (Validation Error)

```
User submit form với email trống
  │
  ├─ Client-side Zod validation fail
  │   ├─ Error: "Email is required" (dưới email input)
  │   ├─ aria-invalid="true" set
  │   └— Submit không gửi API request
  │
  └─ User fix field → error clears → resubmit
```

## Flow 3 — Register (Happy Path)

```
User truy cập /register
  │
  ├─ User nhập: displayName, email, password, confirmPassword
  ├─ Password guidance checkmarks update theo input
  ├─ Click "Create Account"
  │   ├─ Button disabled + spinner
  │   ├─ Client validation: confirmPassword match check
  │   ├─ Strip confirmPassword khỏi payload
  │   ├─ POST /api/v1/auth/register { displayName, email, password }
  │   │
  │   ├─ 201 Success
  │   │   ├─ Display success message: "Account created successfully"
  │   │   └─ Show "Sign In" CTA hoặc auto-redirect /login
  │   │
  │   ├─ 409 Email already registered
  │   │   └─ Form error: "Email này đã được đăng ký"
  │   │
  │   ├─ 400/422 Validation error (from backend)
  │   │   └─ Form error: API message
  │   │
  │   └─ Network/500 error
  │       └─ Form error: "Không thể kết nối. Vui lòng thử lại."
  │
  └─ User → /login → login flow
```

## Flow 4 — Register (Client Validation)

```
User nhập confirmPassword ≠ password
  │
  ├─ On blur confirmPassword
  │   └─ Error: "Passwords do not match"
  │
  └─ User fix → auto-clear khi field valid
```

## Flow 5 — Session Restoration (AUTH-10)

```
User quay lại app (tab mới / reload)
  │
  ├─ App mount
  ├─ Check auth store (in-memory — sẽ trống sau reload)
  ├─ Try POST /api/v1/auth/refresh (cookie tự gửi)
  │   ├─ 200 → accessToken mới → authenticated, continue
  │   └─ 401 (cookie expired/revoked) → unauthenticated
  ├─ Protected route?
  │   ├─ YES, unauthenticated → redirect /login
  │   └─ NO → render public page
  │
  └─ Session expired giữa session
      ├─ API call 401 → single-flight refresh
      │   ├─ Refresh success → retry original request
      │   └─ Refresh fail → clearAuth + redirect /login
      └─ Show "Session expired" toast → /login
```

## Flow 6 — Logout

```
User click "Logout" (user menu)
  │
  ├─ POST /api/v1/auth/logout (cookie)
  ├─ Backend revoke refresh token + clear cookie
  ├<arg_value> Clear access token từ store
  └─ Redirect /login
```

## Error States Matrix

| State | Trigger | UI Response | Recovery |
|---|---|---|---|
| Empty form | Submit không nhập | Inline field errors | User fix field |
| Invalid email | Blur / submit | "Enter a valid email address" | User fix |
| Password trống | Submit | "Password is required" | User nhập |
| Password >72 bytes | Submit | "Password exceeds 72 bytes" | User sửa ngắn lại |
| Confirm mismatch | Blur / submit | "Passwords do not match" | User nhập lại |
| 401 Login | API | Form-level error | Retry |
| 409 Register | API | "Email này đã được đăng ký" | Đổi email hoặc login |
| 429 Rate limit | API | "Quá nhiều yêu cầu" | Đợi rồi retry |
| Network error | API | "Không thể kết nối" | Retry |
| 500 Server | API | "Lỗi hệ thống" | Retry sau |
| Session expired | 401 + refresh fail | Redirect /login | Login lại |
| Unauthorized access | Protected route | Redirect /login | Login |

## Loading States

| Trigger | UI |
|---|---|
| Login submit | Button spinner, disabled, aria-busy |
| Register submit | Button spinner, disabled, aria-busy |
| Session restoring (AUTH-10) | Full-page spinner hoặc silent redirect |
| Route lazy-load | Skeleton / spinner |
