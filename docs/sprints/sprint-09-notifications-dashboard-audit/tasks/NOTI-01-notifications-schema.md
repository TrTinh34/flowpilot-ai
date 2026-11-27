# NOTI-01 — Schema và Migration Notifications

## Thông tin Task

- **Task ID**: `NOTI-01`
- **Tên Task**: Schema và migration Notifications
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`COMPLETED`)
- **Ưu tiên**: P0 · **Ước lượng**: 4h
- **Nguồn**: [US-NOTI-01](../../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time)

## Objective

Thiết kế và áp dụng Prisma schema + PostgreSQL migration cho bảng `notifications`, đồng thời đối chiếu và bổ sung indexes/ràng buộc trên `outbox_events` (đã tạo ở Sprint 05) để phục vụ lưu trữ thông báo theo từng người nhận và truy vấn inbox/unread nhanh.

## Related Requirements

- [FR-NOTI-01](../../../02-SRS.md)
- [UC-NOTI-01](../../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time)
- [System Design](../../../04-System-Design.md)

## Dependencies

- `COL-01` (`20261127000100_outbox_events` đã có model `OutboxEvent` trong `backend/prisma/schema.prisma`).
- PostgreSQL dev & test DB sẵn sàng chạy `prisma migrate`.

## Scope

- Thêm model `Notification` và enum/kiểu dữ liệu phù hợp (`id`, `userId`, `type`, `title`, `body`, `entityType`, `entityId`, `projectId`, `isRead`/`readAt`, `createdAt`) trong `backend/prisma/schema.prisma`.
- Quan hệ `Notification -> User` (cascade/restrict phù hợp) và `OutboxEvent` indexes cho worker polling (`status`, `availableAt`/`createdAt`) và idempotency key chống nhân đôi notification khi worker retry.
- Tạo Prisma migration trong `backend/prisma/migrations/` và kiểm tra áp dụng trên cả dev DB và test DB.

## Out of Scope

- REST endpoints, Socket.IO server và worker logic (`NOTI-02`, `NOTI-03`).

## Implementation Requirements

- Không chỉnh sửa trực tiếp các migration lịch sử đã apply từ Sprint 01–05; tạo migration mới sạch.
- Đảm bảo index tối ưu cho truy vấn phổ biến `WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC`.
- Có cơ chế `sourceOutboxId` (unique nullable hoặc khóa chống trùng) để worker xử lý idempotent.

## Acceptance Criteria

- `prisma migrate status` và `prisma generate` thành công không lỗi trên dev DB và test DB.
- Schema hỗ trợ lưu phân biệt các loại thông báo (`MENTION`, `TASK_ASSIGNED`, `TASK_UPDATED`, v.v.) và trạng thái đọc (`readAt`) theo từng `userId`.

## Testing Requirements

- Chạy migration check trên PostgreSQL test DB và xác minh schema/constraints/unique index bằng integration test.

## Definition of Done

- Migration đã review, kiểm chứng trên PostgreSQL test DB, cập nhật trạng thái trong Sprint 09 README và tạo Development Report theo `REPORT-TEMPLATE.md`.

## Development Report Reference

[Báo cáo NOTI-01](../../../reports/06-notifications-dashboard/NOTI-01-notifications-schema.md)
