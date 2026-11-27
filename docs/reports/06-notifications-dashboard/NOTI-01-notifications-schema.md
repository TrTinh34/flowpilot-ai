# NOTI-01 — Schema và Migration Notifications

## 1. Thông tin Task

- **Task ID**: `NOTI-01`
- **Tên Task**: Schema và migration Notifications
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../../sprints/sprint-09-notifications-dashboard-audit/README.md)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task NOTI-01](../../sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-01-notifications-schema.md), [FR-NOTI-01](../../02-SRS.md), [UC-NOTI-01](../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo triển khai mới kèm kiểm chứng trực tiếp Prisma migration và PostgreSQL test database.

## 2. Tóm tắt triển khai

- Bổ sung enum `NotificationType` (`TASK_ASSIGNED`, `TASK_COMMENT`, `TASK_MENTION`, `INVITATION`) và model `Notification` (`notifications`) trong `backend/prisma/schema.prisma`, đồng thời nối quan hệ đối ứng với `User`, `Project`, `Task` và `OutboxEvent`.
- Tạo migration SQL `backend/prisma/migrations/20261128000000_notifications/migration.sql` với ràng buộc `CHECK ("message" ~ '[^[:space:]]')`, khóa ngoại `ON DELETE RESTRICT ON UPDATE CASCADE`, partial index cho thông báo chưa đọc (`WHERE "read_at" IS NULL`) và unique constraint `(outbox_event_id, user_id)` chống nhân đôi khi worker retry.
- Tạo integration test `backend/tests/integration/notifications-schema.postgres.test.ts` kiểm chứng khóa ngoại, non-blank message, default `read_at IS NULL` và idempotency trên PostgreSQL test DB.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/prisma/schema.prisma` | Modified | Thêm enum `NotificationType`, model `Notification` và quan hệ ngược trên `User`, `Project`, `Task`, `OutboxEvent`. |
| `backend/prisma/migrations/20261128000000_notifications/migration.sql` | Added | Migration tạo `notification_type`, bảng `notifications`, constraints và các indexes inbox/unread/idempotency. |
| `backend/tests/integration/notifications-schema.postgres.test.ts` | Added | Integration test kiểm tra schema, ràng buộc và chống trùng outbox trên PostgreSQL test DB. |
| `docs/sprints/sprint-09-notifications-dashboard-audit/README.md` | Modified | Cập nhật tiến độ Sprint 09 (`1/7 task`) và trạng thái `NOTI-01` -> `COMPLETED`. |
| `docs/sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-01-notifications-schema.md` | Modified | Cập nhật trạng thái task và liên kết báo cáo. |

## 4. Quyết định kỹ thuật

- **Dùng `UNIQUE ("outbox_event_id", "user_id")` thay vì `UNIQUE ("outbox_event_id")`**: Một `OutboxEvent` loại `COMMENT_MENTIONED` mang mảng `recipientIds` có thể phát sinh nhiều bản ghi `Notification` (mỗi người nhận 1 dòng). Khóa kết hợp `(outbox_event_id, user_id)` cho phép 1 outbox event gửi tới nhiều user khác nhau nhưng chặn tuyệt đối việc tạo trùng cho cùng user khi retry, đồng thời PostgreSQL vẫn cho phép nhiều notification có `outbox_event_id IS NULL`.
- **Dùng `read_at TIMESTAMPTZ(6)` nullable**: Cho phép vừa biểu diễn trạng thái đọc/chưa đọc vừa lưu dấu thời gian đọc, kết hợp partial index `notifications_user_id_unread_idx` tối ưu đếm/lọc unread.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prisma Client generate | `npm --prefix backend run prisma:generate` (`7.10.1`) | `PASSED` |
| Test DB migration | `npm --prefix backend run test:db:migrate` (apply `20261128000000_notifications` lên `flowpilot_ai_test`, status up to date) | `PASSED` |
| Dev DB migration | `prisma migrate deploy` trong `backend/` (apply `20261128000000_notifications` lên `flowpilot_ai`) | `PASSED` |
| Prettier format | `npm --prefix backend run format:write` | `PASSED` |
| TypeScript check | `npm --prefix backend run typecheck` (`0` errors) | `PASSED` |
| ESLint | `npm --prefix backend run lint` (`0` errors) | `PASSED` |
| Clean Architecture fitness | `npm --prefix backend run test:architecture` (`5 passed (5)`) | `PASSED` |
| PostgreSQL schema test | `vitest run tests/integration/notifications-schema.postgres.test.ts` với `REQUIRE_TEST_DATABASE=1` (`1 passed (1)`) | `PASSED` |
| Full backend regression suite | Chưa chạy toàn bộ suite cũ trong task schema-only này | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| `prisma migrate status` và `prisma generate` thành công không lỗi trên dev DB và test DB | `PASSED` | Đã apply và kiểm tra status sạch trên cả hai database ở `localhost:5434`. |
| Schema hỗ trợ phân biệt loại thông báo, trạng thái đọc theo `userId` và chống trùng outbox | `PASSED` | Xác minh qua migration SQL và `notifications-schema.postgres.test.ts`. |

## 7. Vấn đề và blocker

- Không có blocker. Toàn bộ backend regression suite sẽ chạy sau khi có API & worker ở `NOTI-02` hoặc theo yêu cầu kiểm chứng đầy đủ.

## 8. Ghi chú cho developer

- File `backend/src/generated/prisma/` là generated client output (gitignored, tái tạo bằng `npm --prefix backend run prisma:generate`).
- Khi implement `NOTI-02`, repository tạo notification từ outbox có thể dùng `createMany({ ..., skipDuplicates: true })` hoặc `ON CONFLICT ("outbox_event_id", "user_id") DO NOTHING` để tận dụng constraint vừa tạo.

## 9. Task tiếp theo

- [NOTI-02 — Notification REST API và Outbox Worker](../../sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-02-notification-api-outbox.md)
