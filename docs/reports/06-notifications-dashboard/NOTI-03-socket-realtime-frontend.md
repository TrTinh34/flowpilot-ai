# NOTI-03 — Socket.IO Server Real-time và tích hợp Notification UI

## 1. Thông tin Task

- **Task ID**: `NOTI-03`
- **Tên Task**: Socket.IO Server Real-time và tích hợp Notification UI
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../../sprints/sprint-09-notifications-dashboard-audit/README.md)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task NOTI-03](../../sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-03-socket-realtime-frontend.md), [FR-NOTI-01](../../02-SRS.md), [UC-NOTI-01](../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time), [Screen Specs](../../design/frontend/screen-specifications.md)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo triển khai mới kèm kiểm chứng thực tế Socket.IO integration trên PostgreSQL, Backend Checks và Frontend Checks + production build.

## 2. Tóm tắt triển khai

- **Backend Socket.IO Server**:
  - Cài đặt `socket.io` (và `socket.io-client` devDependency cho test), triển khai [socket-auth.middleware.ts](../../../backend/src/sockets/socket-auth.middleware.ts) xác thực JWT qua `AccessTokenVerifier`, từ chối handshake thiếu/sai token (`Unauthorized`).
  - Triển khai [socket-rooms.handler.ts](../../../backend/src/sockets/socket-rooms.handler.ts): server tự động join room `user:{userId}` dựa trên `userId` đã verify và kiểm tra quyền DB qua `canAccessProject` trước khi cho phép join `project:{projectId}` (trả `FORBIDDEN` nếu ngoài quyền).
  - Triển khai [socket.server.ts](../../../backend/src/sockets/socket.server.ts) và gắn vào HTTP server + `JobRunner` tại [server.ts](../../../backend/src/server.ts) để sự kiện `outbox.worker` đẩy `'notification:new'` trực tiếp tới `user:{userId}`.
- **Frontend API, Socket.IO Client & Notification UI**:
  - Cài đặt `socket.io-client`, triển khai [notification.types.ts](../../../frontend/src/features/notification/types/notification.types.ts), [notification.api.ts](../../../frontend/src/features/notification/api/notification.api.ts) và [socket-client.ts](../../../frontend/src/sockets/socket-client.ts) (dynamic import tách chunk riêng cho `socket.io-client`).
  - Triển khai [useNotificationSocket.ts](../../../frontend/src/features/notification/hooks/useNotificationSocket.ts) (gắn vào [AppShellLayout.tsx](../../../frontend/src/layouts/AppShellLayout.tsx)) để invalidate cache `['notifications']` khi nhận `'notification:new'` và khi `connect`/reconnect; gom logic đọc/đánh dấu dùng chung vào [useNotificationsFeed.ts](../../../frontend/src/features/notification/hooks/useNotificationsFeed.ts).
  - Cập nhật [NotificationBell.tsx](../../../frontend/src/features/notification/components/NotificationBell.tsx) và [NotificationsPage.tsx](../../../frontend/src/pages/notification/NotificationsPage.tsx) hỗ trợ Live API thật (pagination, filter unread, error/retry, link điều hướng `/tasks/:taskId`) và giữ Demo tách biệt ở `DEV && VITE_USE_MOCK_API === 'true'`.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/package.json` & `backend/package-lock.json` | Modified | Thêm `socket.io` và `socket.io-client` (dev). |
| `backend/src/sockets/{socket-auth.middleware,socket-rooms.handler,socket.server}.ts` | Modified | Hoàn thiện JWT handshake auth, server-managed rooms và adapter `NotificationRealtimePort`. |
| `backend/src/server.ts` | Modified | Gắn HTTP server + Socket.IO server và đóng gọn khi shutdown. |
| `backend/vitest.config.ts` | Modified | Gỡ exclude cho `notification-socket.integration.test.ts`. |
| `backend/tests/integration/notification-socket.integration.test.ts` | Modified | Test JWT rejection, isolation `user:{id}` / `project:{id}`, và luồng mention -> outbox -> Socket.IO live -> REST reconnect. |
| `frontend/package.json` & `frontend/package-lock.json` | Modified | Thêm `socket.io-client`. |
| `frontend/src/sockets/socket-client.ts` | Modified | Kết nối Socket.IO client qua dynamic import và dọn dẹp listener khi unmount/logout. |
| `frontend/src/features/notification/` (`types`, `api`, `hooks/useNotificationSocket.ts`, `hooks/useNotificationsFeed.ts`, `components/NotificationBell.tsx`) | Modified / Added | API client thật, hook realtime + reconnect invalidation, shared feed hook cho Bell & Page. |
| `frontend/src/pages/notification/NotificationsPage.tsx` & `frontend/src/layouts/AppShellLayout.tsx` | Modified | Tích hợp Live API, ErrorState/Retry, Pagination, task link và gắn `useNotificationSocket`. |
| `frontend/tests/integration/notifications-ui.test.tsx` | Modified | Test Live API + error/retry + mark-read/all, Socket.IO live/reconnect invalidation và Demo mode guard. |
| `docs/sprints/sprint-09-notifications-dashboard-audit/` | Modified | Cập nhật trạng thái `NOTI-03` -> `COMPLETED` (`3/7 task`). |

## 4. Quyết định kỹ thuật

- **Dynamic import `socket.io-client` trong `socket-client.ts`**: Tránh kéo thêm ~41 kB vào entry bundle công khai (`/login`, `/register`), giữ `index-*.js` ở mức `480.89 kB` (`< 500 kB`, 0 cảnh báo chunk) mà vẫn kết nối Socket.IO tức thì sau khi có `accessToken`.
- **Dùng chung query key (`page: 0, size: 20, unreadOnly: false`) giữa `NotificationBell` và `NotificationsPage`**: Cho phép TanStack Query dedupe tự động trong một request duy nhất và giữ badge chuông luôn đồng bộ tức thì với trang Notifications.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Backend format, typecheck, lint, build | `npm --prefix backend run format:write`, `typecheck`, `lint`, `build` | `PASSED` |
| Clean Architecture fitness | `npm --prefix backend run test:architecture` (`5 passed (5)`) | `PASSED` |
| Backend unit tests | `npm --prefix backend run test:unit` (`11/11` files, `79/79` tests) | `PASSED` |
| Backend PostgreSQL & Socket.IO tests | `npm --prefix backend run test:integration` (`16/16` files, `44/44` tests gồm `notification-socket.integration.test.ts`) | `PASSED` |
| Frontend format, typecheck, lint | `npm --prefix frontend run format:write`, `typecheck`, `lint` (`0` errors/warnings) | `PASSED` |
| Frontend Vitest + RTL | `npm --prefix frontend run test` (`16/16` files, `98/98` tests) | `PASSED` |
| Frontend build & fixture scan | `npm --prefix frontend run build` (`index-BQ8dimFP.js` = `480.89 kB`, `0` fixture matches in `dist/`) | `PASSED` |
| Live Chrome smoke sau NOTI-03 | Kiểm tra trình duyệt thật đầu-cuối sẽ tổng hợp tại `NOTI-DASH-INT-01` | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Kết nối Socket.IO không có JWT hoặc JWT sai bị từ chối | `PASSED` | Xác minh trong `notification-socket.integration.test.ts`. |
| User A không nhận được sự kiện room `user:{UserB}` hoặc `project:{OtherProject}` | `PASSED` | Xác minh `project:join` trả `FORBIDDEN` cho outsider và cô lập `notification:new`. |
| Reconnect khôi phục thông báo chưa đọc và đồng bộ badge chuông | `PASSED` | Xác minh cả qua `notification-socket.integration.test.ts` (REST reconnect) và `notifications-ui.test.tsx` (`onConnect` / `onNotification` invalidation). |

## 7. Vấn đề và blocker

- Tại môi trường dev local, `frontend/.env` có thể đặt `VITE_USE_MOCK_API=true` cho chế độ demo; khi test luồng Notifications thật trên trình duyệt trong `NOTI-DASH-INT-01`, cần kiểm chứng với `VITE_USE_MOCK_API=false`.

## 8. Ghi chú cho developer

- `NOTI-01`..`NOTI-03` (`US-NOTI-01`) đã hoàn thành đầy đủ từ schema, worker, REST API, Socket.IO đến UI. Chuyển sang nhánh `US-DASH-01` (`DASH-01`..`DASH-03`).

## 9. Task tiếp theo

- [DASH-01 — Audit Log Schema và Emission Ports](../../sprints/sprint-09-notifications-dashboard-audit/tasks/DASH-01-audit-schema-ports.md)
