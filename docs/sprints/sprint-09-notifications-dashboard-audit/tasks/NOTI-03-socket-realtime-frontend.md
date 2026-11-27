# NOTI-03 — Socket.IO Server Real-time và tích hợp Notification UI

## Thông tin Task

- **Task ID**: `NOTI-03`
- **Tên Task**: Socket.IO Server Real-time và tích hợp Notification UI
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`COMPLETED`)
- **Ưu tiên**: P0 · **Ước lượng**: 6h
- **Nguồn**: [US-NOTI-01](../../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time)

## Objective

Xây dựng Socket.IO server với xác thực JWT lúc handshake và server-managed rooms (`user:{userId}`, `project:{projectId}`), kết nối với `NotificationRealtimePort` của `NOTI-02` và tích hợp frontend ([NotificationBell.tsx](../../../../frontend/src/features/notification/components/NotificationBell.tsx), [NotificationsPage.tsx](../../../../frontend/src/pages/notification/NotificationsPage.tsx), [useNotificationSocket.ts](../../../../frontend/src/features/notification/hooks/useNotificationSocket.ts)) vào API/WebSocket thật.

## Related Requirements

- [FR-NOTI-01](../../../02-SRS.md) (bao gồm Authorization matrix cho WebSocket)
- [UC-NOTI-01](../../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time)
- [Screen Specs · Notification Center](../../../design/frontend/screen-specifications.md)

## Dependencies

- `NOTI-02` (Notification REST API & `outbox.worker.ts`).
- `REDESIGN-12` (Notification Center UI & `notifications-ui.test.tsx`).

## Scope

- Socket.IO server gắn cùng Express HTTP server (`backend/src/sockets/` hoặc presentation adapter tương ứng):
  - Xác thực access token (JWT) trong `socket.handshake.auth` (từ chối kết nối thiếu/sai token).
  - Server tự join room `user:{userId}` dựa trên `userId` đã verify từ JWT (không tin payload client gửi lên để join room user khác).
  - Join room `project:{projectId}` chỉ khi kiểm tra membership project hợp lệ trong DB.
  - Khi reconnect, client tự đồng bộ lại `GET /notifications` để không bỏ lỡ sự kiện trong lúc mất kết nối.
- Frontend integration (`frontend/src/features/notification/`, `frontend/src/sockets/`):
  - Kết nối `notification.api.ts` + TanStack Query + `useNotificationSocket` với endpoint thật.
  - Giữ ranh giới Demo: chế độ Demo chỉ kích hoạt khi `import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'` và khi không dùng API thật; đảm bảo production build không đóng gói fixture demo.

## Out of Scope

- Email SMTP delivery thực tế ngoài môi trường test/dev.

## Implementation Requirements

- Kiểm tra quyền thành viên project từ backend trước khi cho join room `project:{projectId}`; không dùng query parameter để tin cậy `userId`.
- Giữ thiết kế UI, accessibility và trạng thái Empty/Error/Loading của `REDESIGN-12` + `REFINE-04`.

## Acceptance Criteria

- Kết nối Socket.IO không có JWT hoặc JWT hết hạn bị từ chối.
- User A không nhận được sự kiện phát tới room `user:{UserB}` hoặc `project:{OtherProject}`.
- Reconnect khôi phục danh sách thông báo chưa đọc mới nhất từ REST API; bấm "Mark read" / "Mark all read" cập nhật DB và đồng bộ badge chuông theo thời gian thực.

## Testing Requirements

- Backend Socket.IO integration test (JWT auth, room isolation, reconnect/event delivery).
- Frontend Vitest + RTL tests (`notifications-ui.test.tsx`) cho cả Live API & Demo mode + Chrome live verification.

## Definition of Done

- Backend Socket.IO tests + Frontend `typecheck`/`lint`/`format`/`test`/`build` pass; tạo Development Report tại `docs/reports/06-notifications-dashboard/NOTI-03-socket-realtime-frontend.md`.

## Development Report Reference

[Báo cáo NOTI-03](../../../reports/06-notifications-dashboard/NOTI-03-socket-realtime-frontend.md)
