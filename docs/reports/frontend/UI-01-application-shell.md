# UI-01 — Application Shell và Navigation

## 1. Thông tin Task

- Task ID — UI-01
- Tên Task — Application Shell và Navigation
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — NFR-05, FR-WS-01
- Loại báo cáo — Ghi ngay sau triển khai

## 2. Tóm tắt triển khai

Hoàn thiện `AppShellLayout` với Sidebar đầy đủ (220px desktop, collapsible 52px, mobile overlay drawer) và Header (hamburger mobile, sidebar toggle desktop, NotificationBell). Tạo `WorkspaceSwitcher` dropdown hoàn chỉnh thay thế TODO stub. Tạo `workspace.store.ts` Zustand persist cho active workspace. Tất cả protected routes được wrap trong `AppShellRoute` → `AppShellLayout`.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/layouts/AppShellLayout.tsx` | Cập nhật | Full implementation: Sidebar + Header, collapse, mobile drawer, user menu |
| `frontend/src/app/router/AppShellRoute.tsx` | Tạo | Outlet wrapper cho AppShellLayout |
| `frontend/src/app/router/AppRouter.tsx` | Cập nhật | Toàn bộ routes dùng AppShellRoute, default redirect `/` → `/dashboard` |
| `frontend/src/app/store/workspace.store.ts` | Tạo | Zustand persist store cho activeWorkspaceId |
| `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` | Cập nhật | Dropdown hoàn chỉnh, auto-select workspace đầu tiên |
| `frontend/src/features/auth/hooks/useLogout.ts` | Cập nhật | Thêm clearActiveWorkspace khi logout |
| `frontend/src/pages/errors/NotFoundPage.tsx` | Cập nhật | 404 page hoàn chỉnh thay thế TODO stub |

## 4. Quyết định kỹ thuật

- **AppShellRoute pattern:** Dùng `<Outlet />` trong `AppShellLayout` thay vì wrap từng page riêng → tránh re-mount layout khi navigate.
- **Sidebar collapse:** `useUiStore.isSidebarOpen` → 220px khi mở, 52px icon-only khi đóng. Transition 200ms.
- **Mobile drawer:** State local `mobileOpen`, không persist. Đóng khi click NavLink (`onNavigate` callback) hoặc backdrop.
- **WorkspaceSwitcher useMemo:** `data?.data` wrap bằng `useMemo` để tránh re-render effect.
- **Logout clear workspace:** `useLogout` gọi `clearActiveWorkspace()` trước khi navigate `/login`.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Tests | `npm test` → 69/69 passed | PASSED |
| Build | `npm run build` → exit 0 | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Sidebar hiển thị đúng desktop ≥ 1024px | PASSED | 220px, collapsible |
| Sidebar ẩn trên mobile, hamburger hiện drawer | PASSED | lg:hidden / overlay |
| Active nav item highlight | PASSED | NavLink isActive → bg-primary/10 text-primary |
| Logout hoạt động | PASSED | clearAuth + clearWorkspace + navigate /login |
| Header breadcrumb | NOT IMPLEMENTED | Deferred — dùng page title thay thế |
| Typecheck và lint pass | PASSED | — |

## 7. Vấn đề và blocker

- Breadcrumb động chưa implement — PageHeader với title tĩnh theo từng page thay thế.
- Bundle size ~635KB cần code splitting ở Sprint 06.

## 8. Ghi chú cho developer

`AppShellRoute` wrap mọi protected page. Để thêm route mới: thêm `<Route path="..." element={<NewPage />} />` bên trong `<Route element={<AppShellRoute />}>` trong `AppRouter.tsx`.

## 9. Task tiếp theo

UI-02 — Shared UI Component Library.
