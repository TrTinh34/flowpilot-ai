# UI-01 — Application Shell và Navigation

## Thông tin Task

- Task ID — UI-01
- Tên Task — Application Shell và Navigation
- Sprint — [Sprint 04](../README.md)
- Priority — P0 (blocker cho tất cả Task còn lại)
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — AUTH-10 (ProtectedRoute, auth store), WS-04 (WorkspaceSwitcher, workspace API)
- Related Requirements — NFR-05 (responsive), FR-WS-01, FR-PROJ-01

## Objective

Hoàn thiện `AppShellLayout` với Sidebar đầy đủ (logo, workspace switcher, navigation items, user menu, collapse button) và Header (breadcrumb, page title, notification bell, user menu dropdown) làm wrapper nhất quán cho mọi màn hình protected.

## Context

`AppShellLayout.tsx` hiện là TODO stub. `WorkspaceSwitcher.tsx` đã tồn tại trong `features/workspace/components/`. Router đã có các protected routes. Auth store và user session đã hoạt động.

## Scope

### AppShellLayout

- Outer container: full-width `flex h-screen overflow-hidden`
- Sidebar (240px desktop, collapsible, hidden mobile)
- Main area: `flex-1 flex flex-col overflow-hidden` gồm Header + scrollable content

### Sidebar

- Logo `FlowPilot AI` (component `Logo` hiện có)
- `WorkspaceSwitcher` (reuse component hiện có)
- Navigation items:
  - Dashboard (`/dashboard`)
  - My Tasks (`/my-tasks`)
  - Notifications (`/notifications`)
  - Projects (expandable, list theo workspace hiện tại)
  - AI Planner (`/ai/planner`)
  - Settings (`/settings/profile`)
- Spacer + User account section ở bottom: avatar, display name, logout button
- Collapse button (icon only khi collapsed)

### Header

- Breadcrumb (dynamic theo route)
- Notification Bell (component `NotificationBell` placeholder)
- User menu dropdown (avatar + tên, link Profile, Logout)
- Mobile: hamburger button để toggle sidebar drawer

### Responsive

- Desktop ≥ 1024px: sidebar persistent 240px
- Mobile < 1024px: sidebar hidden, hamburger → overlay drawer

### Navigation state

- Active item highlight với `bg-surface-secondary text-primary`
- Keyboard navigable

## Out of Scope

- Notification count thực (UI-04)
- Dashboard content (UI-03)
- Workspace creation flow (đã có ở Sprint 02)

## Technical Design

### Files tạo / cập nhật

```
frontend/src/layouts/AppShellLayout.tsx       ← hoàn chỉnh thay thế TODO stub
frontend/src/features/auth/hooks/useLogout.ts ← reuse từ AUTH-10
frontend/src/app/router/AppRouter.tsx         ← wrap pages trong AppShellLayout
frontend/src/components/common/Breadcrumb.tsx ← mới
```

### Breadcrumb

Dùng `useMatches()` từ React Router + route handle:

```tsx
// Trong route definition:
<Route handle={{ breadcrumb: 'Dashboard' }} path="/dashboard" element={<DashboardPage />} />
```

### Sidebar state

`useUiStore` (đã có): `isSidebarOpen`, `toggleSidebar`.

### Workspace context

Lấy workspace hiện tại từ `useAuthStore` hoặc URL param. Fallback: load workspace list và chọn workspace đầu tiên.

## UI/UX Requirements

- Sidebar background: `var(--sidebar-bg)`, border-right: `var(--sidebar-border)` 1px
- Header height: 56px, border-bottom: `var(--border)` 1px
- Navigation item: 36px height, 12px horizontal padding, 8px radius
- Hover: `var(--surface-secondary)` background
- Active: `var(--color-primary)` text, `bg-primary/8` background
- Icon: Lucide icons, 16px
- Transitions: 150ms ease-out, `prefers-reduced-motion` respected
- Mobile drawer: overlay, 280px wide, close on backdrop click

## Implementation Checklist

- [ ] Implement `AppShellLayout.tsx` (Sidebar + Header + content slot)
- [ ] Sidebar navigation với active state, collapse behavior
- [ ] User menu dropdown (logout, profile link)
- [ ] Mobile hamburger + overlay drawer
- [ ] Breadcrumb component
- [ ] Wrap authenticated routes trong `AppShellLayout`
- [ ] `WorkspaceSwitcher` integration vào Sidebar
- [ ] Keyboard navigation trên Sidebar links
- [ ] `aria-label`, `aria-current="page"` cho active nav item
- [ ] Typecheck, lint pass

## Expected Deliverables

- `AppShellLayout.tsx` hoàn chỉnh
- `Breadcrumb.tsx` component
- Mọi protected page được bọc trong AppShellLayout
- Sidebar collapse/expand hoạt động
- Mobile drawer hoạt động

## Acceptance Criteria

- AC-01-01: Sidebar hiển thị đúng ở desktop ≥ 1024px
- AC-01-02: Sidebar ẩn trên mobile, hamburger hiện drawer
- AC-01-03: Active navigation item được highlight đúng
- AC-01-04: Logout hoạt động (clear store, redirect /login)
- AC-01-05: Header breadcrumb hiển thị theo route
- AC-01-06: Typecheck và lint pass

## Testing Requirements

- RTL: Sidebar render, navigation active state, mobile collapse, logout button
- Manual: 390px, 768px, 1024px, 1440px

## Definition of Done

Mọi AC pass, có RTL tests, không có console errors, link báo cáo.

## Development Report Reference

Chưa có — tạo tại `docs/reports/frontend/UI-01-application-shell.md`.

## Next Task

UI-02 — Shared UI Component Library.
