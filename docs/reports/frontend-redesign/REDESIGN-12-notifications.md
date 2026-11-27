# REDESIGN-12 — Notification Center

## 1. Thông tin Task

- **Task ID:** REDESIGN-12
- **Tên Task:** Notification Center
- **Sprint:** Sprint 08 · Timebox C
- **Ngày triển khai:** 2026-11-28
- **Trạng thái:** COMPLETED (code + RTL tests + production bundle check `PASSED`; live browser visual QA gộp vào `REFINE-07` / `REDESIGN-15–16`)
- **Yêu cầu liên quan:** [REDESIGN-12 Spec](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-12-notifications.md) · [Screen Specs §9](../../design/frontend/screen-specifications.md)
- **Nguồn bằng chứng:** Vitest/RTL, `typecheck`, `lint`, `format`, `build`, bundle grep check

## 2. Tóm tắt triển khai

Đồng bộ hoàn toàn trạng thái giữa `NotificationBell` (header) và `NotificationsPage` (`/notifications`) thông qua một Zustand store dùng chung (`notification-demo.store.ts`), áp dụng Design System V2 (`PageHeader`, `Tabs`, `Badge`, `EmptyState`, `LoadingState`, `max-w-[820px]`), nhóm thông báo `Latest` / `Earlier`, loại bỏ link tới fake task IDs và đảm bảo mock fixture không rò rỉ vào production bundle.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/features/notification/store/notification-demo.store.ts` | Created | Nguồn state dùng chung cho Bell & Inbox, lazy-load fixture chỉ trong `DEV && VITE_USE_MOCK_API === 'true'` |
| `frontend/src/features/notification/components/NotificationBell.tsx` | Modified | Nối `useNotificationDemoStore`, `Demo` badge, `z-[var(--z-popover)]`, accessible labels |
| `frontend/src/pages/notification/NotificationsPage.tsx` | Modified | Reading column `max-w-[820px]`, `PageHeader`, `Tabs` All/Unread, nhóm `Latest`/`Earlier`, `Badge` type, `EmptyState` |
| `frontend/tests/integration/notifications-ui.test.tsx` | Created | Kiểm chứng đồng bộ unread/read giữa Bell & Inbox, tabs, Demo off và production flag |

## 4. Quyết định kỹ thuật

- Đặt guard `if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API !== 'true')` trực tiếp tại call-site `import('@/mocks/fixtures/notification.fixtures')` để Vite/Rollup tree-shake hoàn toàn chunk fixture khỏi production `dist/`.
- Không render link `/tasks/mock-task-*` từ fixture mẫu nhằm tuân thủ quy tắc không dẫn tới ID giả.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Frontend checks | `npm --prefix frontend run typecheck; lint; format; test; build` (16 files, 97 tests, 0 lint warnings) | PASSED |
| Notification integration | `tests/integration/notifications-ui.test.tsx` (2 tests: Demo off/prod guard + Bell/Inbox sync) | PASSED |
| Production bundle isolation | `Select-String` trên `frontend/dist/assets/*.js` cho chuỗi `"Alice assigned you"` (0 matches) | PASSED |
| Live browser QA (`360/1440px`, contrast, zoom 200%) | Chưa chạy headless browser mới trong phiên | NOT VERIFIED (`REFINE-07` / `REDESIGN-15–16`) |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Mark read ở Bell cập nhật Inbox ngay và ngược lại | PASSED | Verified qua `notifications-ui.test.tsx` |
| Demo off / production không seed `mockNotifications` | PASSED | Verified qua test và kiểm tra `dist/assets/*.js` |
| Zero hardcoded colors hay `rounded-xl` trên panel | PASSED | Dùng tokens Design System V2 (`rounded-[var(--radius-md)]`, `border-border`) |

## 7. Task tiếp theo

`REDESIGN-13` (AI Planner), `REDESIGN-14` (Profile & Settings), và `REFINE-07` / `REDESIGN-15–16` (Browser & Visual QA).
