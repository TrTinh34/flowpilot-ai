# NOTI-02 — Notification REST API và Outbox Worker

## Thông tin Task

- **Task ID**: `NOTI-02`
- **Tên Task**: Notification REST API và Outbox Worker
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`COMPLETED`)
- **Ưu tiên**: P0 · **Ước lượng**: 7h
- **Nguồn**: [US-NOTI-01](../../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time)

## Objective

Triển khai module `backend/src/modules/notification/` theo chuẩn Clean Architecture 4 tầng cùng `outbox.worker.ts` trong `backend/src/jobs/` để biến sự kiện outbox (mention/giao việc) thành bản ghi `notifications` và phục vụ REST endpoints inbox cho người dùng.

## Related Requirements

- [FR-NOTI-01](../../../02-SRS.md)
- [UC-NOTI-01](../../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time)
- [OpenAPI Spec](../../../06-API-Specification.yaml) (`/notifications`, `/notifications/{notificationId}/read`)

## Dependencies

- `NOTI-01` (schema `notifications` & `outbox_events`).
- `COL-02` (sự kiện mention ghi vào `outbox_events`).
- `AUTH-06` (`requireAuth` middleware).

## Scope

- Tổ chức `backend/src/modules/notification/` theo 4 tầng (`domain/`, `application/`, `infrastructure/`, `presentation/`) + `notification.module.ts` & `index.ts` (xóa các file placeholder `// TODO:` cũ).
- REST endpoints dưới `/api/v1/notifications`:
  - `GET /notifications` (phân trang, lọc `unreadOnly`, trả thêm `unreadCount` theo hợp đồng).
  - `PATCH /notifications/:notificationId/read` (chỉ owner của notification mới đánh dấu được; trả `404` nếu không tồn tại hoặc thuộc user khác theo chính sách isolation).
  - Đồng bộ hợp đồng `PATCH /notifications/read-all` (mark all read) trong `docs/06-API-Specification.yaml` nếu cần giữ nút "Mark all read" ở frontend.
- Triển khai `backend/src/jobs/outbox.worker.ts` (kết nối `job-runner.ts`): poll `outbox_events` có locking/lease, sinh notification records idempotent, backoff khi lỗi, và gọi `NotificationRealtimePort` để đẩy signal real-time (được implement ở `NOTI-03`).

## Out of Scope

- Socket.IO server handshake/rooms và tích hợp frontend (`NOTI-03`).

## Implementation Requirements

- Tuân thủ tuyệt đối Clean Architecture rule trong [AGENTS.md](../../../../AGENTS.md): `domain/` không import framework ngoài; `application/` dùng Ports và không trả HTTP status hay Prisma generated models; dependency injection tường minh tại `notification.module.ts`.
- Không deep-import từ module khác vào nội bộ `notification/`.

## Acceptance Criteria

- User A không thể xem hoặc đánh dấu đã đọc notification của User B (`404`/`403` nhất quán, không rò rỉ dữ liệu).
- Tạo comment có mention từ `COL-02` -> outbox worker xử lý thành 1 notification trong DB cho đúng người được mention (chạy worker lặp lại không tạo bản ghi trùng).
- `npm --prefix backend run test:architecture` đạt.

## Testing Requirements

- Unit tests Use Cases dùng fake Ports (`NotificationRepositoryPort`, `OutboxRepositoryPort`).
- Supertest integration tests trên PostgreSQL test DB cho phân trang, filter unread, ownership isolation, và outbox worker idempotency/retry.

## Definition of Done

- Architecture fitness, unit tests, PostgreSQL integration tests đạt; OpenAPI Spec đồng bộ; tạo Development Report tại `docs/reports/06-notifications-dashboard/NOTI-02-notification-api-outbox.md`.

## Development Report Reference

[Báo cáo NOTI-02](../../../reports/06-notifications-dashboard/NOTI-02-notification-api-outbox.md)
