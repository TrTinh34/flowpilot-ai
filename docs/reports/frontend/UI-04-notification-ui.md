# UI-04 — Notification Center UI

## 1. Thông tin Task

- Task ID — UI-04
- Tên Task — Notification Center UI
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-NOTI-01, UC-NOTI-01

## 2. Tóm tắt triển khai

Triển khai `NotificationBell` trong Header (unread badge + dropdown preview 5 items) và `NotificationsPage` (full inbox, All/Unread filter, mark read). Tất cả dùng mock data vì backend Notification API chưa có. Socket.IO real-time defer đến Sprint 05.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/features/notification/components/NotificationBell.tsx` | Cập nhật | Bell + badge + dropdown — thay thế TODO stub |
| `frontend/src/pages/notification/NotificationsPage.tsx` | Cập nhật | Full inbox page — thay thế TODO stub |
| `frontend/src/mocks/fixtures/notification.fixtures.ts` | Tạo (UI-02) | Mock notifications |
| `frontend/src/layouts/AppShellLayout.tsx` | Cập nhật | Import và render `NotificationBell` trong Header |

## 4. Quyết định kỹ thuật

- **Local state:** `useState<NotificationItem[]>` cho mock data — simulates read/unread toggle mà không cần API.
- **Bell badge:** Hiển thị khi `unread > 0`, max `9+`.
- **Dropdown:** `useRef` + `mousedown` listener để đóng khi click outside.
- **Polling:** Chưa implement — khi backend ready thêm `refetchInterval: 30_000` vào `useQuery`.
- **Socket.IO:** `socket-client.ts` đã có, chờ backend Sprint 05 để connect.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Build | `npm run build` → exit 0 | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| Bell icon với unread badge | PASSED |
| Dropdown top 5 notifications | PASSED |
| Click notification → mark read | PASSED |
| "Mark all read" | PASSED |
| NotificationsPage full list | PASSED |
| All/Unread filter | PASSED |
| Empty state | PASSED |

## 7. Vấn đề và blocker

- Mock data — backend `/notifications` API chưa có (Sprint 05).
- Real-time Socket.IO chưa connect — polling sẽ được thêm khi backend sẵn sàng.

## 9. Task tiếp theo

UI-05 — Collaboration UI.
