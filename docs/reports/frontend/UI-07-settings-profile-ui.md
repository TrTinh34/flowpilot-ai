# UI-07 — Settings & Profile UI

## 1. Thông tin Task

- Task ID — UI-07
- Tên Task — Settings & Profile UI
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-AUTH-01

## 2. Tóm tắt triển khai

Tạo `ProfilePage` tại `/settings/profile` hiển thị avatar (initials), display name và email từ `useAuthStore().user`. Thêm route vào `AppRouter`. Thêm link "Profile" vào user menu trong Sidebar.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/pages/settings/ProfilePage.tsx` | Tạo | User profile page |
| `frontend/src/app/router/AppRouter.tsx` | Cập nhật | Thêm `/settings/profile` route |
| `frontend/src/layouts/AppShellLayout.tsx` | Cập nhật | User menu link "Profile" → `/settings/profile` |

## 4. Quyết định kỹ thuật

- **Data source:** `useAuthStore().user` (từ login response). Không gọi API vì GET /me HTTP route chưa mount.
- **Avatar:** Initials từ `displayName[0]`, fallback `'U'`. Background `var(--color-primary)`.
- **Edit form:** Hiển thị note "Profile editing will be available in a future release." — không implement edit khi chưa có PATCH /me endpoint.
- **Directory:** `src/pages/settings/` tạo mới cho các settings pages tương lai.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Route `/settings/profile` | Có trong AppRouter | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| ProfilePage hiển thị display name và email | PASSED |
| Không lộ sensitive data | PASSED |
| Accessible tại `/settings/profile` | PASSED |

## 7. Vấn đề và blocker

- Profile edit chưa có — cần `PATCH /me` endpoint và `GET /me` HTTP route trước.
- Nếu user là `null` (refresh chưa trả user profile), page hiển thị `—` placeholder.

## 9. Task tiếp theo

UI-08 — Design System Consistency Pass.
