# NOTI-02 — Notification REST API và Outbox Worker

## 1. Thông tin Task

- **Task ID**: `NOTI-02`
- **Tên Task**: Notification REST API và Outbox Worker
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../../sprints/sprint-09-notifications-dashboard-audit/README.md)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task NOTI-02](../../sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-02-notification-api-outbox.md), [FR-NOTI-01](../../02-SRS.md), [UC-NOTI-01](../../03-Use-Cases.md#uc-noti-01--thông-báo-trong-app-và-real-time), [OpenAPI Spec](../../06-API-Specification.yaml)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo triển khai mới kèm kiểm chứng đầy đủ unit tests, Clean Architecture fitness và toàn bộ PostgreSQL integration regression suite.

## 2. Tóm tắt triển khai

- Thay thế các placeholder cũ trong `backend/src/modules/notification/` bằng module Clean Architecture 4 tầng hoàn chỉnh (`domain/`, `application/`, `infrastructure/`, `presentation/`, `notification.module.ts`, `index.ts`).
- Cung cấp 3 REST endpoint tại `/api/v1/notifications` (`backend/src/routes/index.ts`) và đồng bộ [OpenAPI Spec](../../06-API-Specification.yaml):
  - `GET /api/v1/notifications` (phân trang `page`/`size`, lọc `unreadOnly`, trả kèm `unreadCount`).
  - `PATCH /api/v1/notifications/read-all` (`204`, đánh dấu toàn bộ thông báo chưa đọc của người dùng hiện tại).
  - `PATCH /api/v1/notifications/:notificationId/read` (`204` idempotent cho chủ sở hữu, `404` nếu không tồn tại hoặc thuộc user khác).
- Triển khai `ProcessOutboxEvents` + `PrismaOutboxUnitOfWork` (`SELECT ... FOR UPDATE SKIP LOCKED`, `createManyAndReturn` với `skipDuplicates: true`, retry exponential backoff tối đa 5 lần rồi đánh dấu `FAILED`) cùng `backend/src/jobs/outbox.worker.ts` và `backend/src/jobs/job-runner.ts` chạy theo vòng đời server ở `backend/src/server.ts`.
- Mở rộng `backend/tests/architecture/clean-architecture.test.ts` để kiểm tra tách tầng và chặn deep-import vào nội bộ `modules/notification/`.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/src/modules/notification/domain/notification.ts` & `notification-failure.ts` | Added | Domain entities và `NotificationFailure` thuần TypeScript. |
| `backend/src/modules/notification/application/` | Added | `NotificationDto`, ports (`NotificationRepositoryPort`, `OutboxUnitOfWorkPort`, `NotificationRealtimePort`), và use cases (`ListNotifications`, `MarkNotificationRead`, `ProcessOutboxEvents`). |
| `backend/src/modules/notification/infrastructure/` | Added | `PrismaNotificationsRepository` và `PrismaOutboxUnitOfWork` dùng `FOR UPDATE SKIP LOCKED` + `skipDuplicates`. |
| `backend/src/modules/notification/presentation/` | Added | Zod schemas, HTTP failure mapper và routes `/notifications`. |
| `backend/src/modules/notification/notification.module.ts` & `index.ts` | Added | Composition Root tường minh và public API của module `notification`. |
| `backend/src/modules/notification/notification.*.ts` (6 files cũ) | Deleted | Xóa các placeholder `// TODO:` phẳng trước đây. |
| `backend/src/jobs/outbox.worker.ts` & `job-runner.ts` | Added / Modified | Polling worker và quản lý start/stop nền an toàn. |
| `backend/src/routes/index.ts`, `app.ts`, `server.ts` | Modified | Mount `/api/v1/notifications`, inject optional `NotificationRealtimePort`, start/stop `JobRunner` theo graceful shutdown. |
| `docs/06-API-Specification.yaml` | Modified | Thêm query `unreadOnly` cho `GET /notifications` và endpoint `PATCH /notifications/read-all`. |
| `backend/tests/architecture/clean-architecture.test.ts` | Modified | Thêm `modules/notification` vào kiểm tra Clean Architecture và chống deep-import. |
| `backend/tests/unit/notification.use-cases.test.ts` | Added | Unit tests cho `ListNotifications`, `MarkNotificationRead`, `ProcessOutboxEvents` (idempotency, retry backoff, `FAILED`). |
| `backend/tests/integration/notification-api.postgres.test.ts` | Added | PostgreSQL + Supertest test luồng comment mention -> outbox worker -> inbox -> ownership isolation -> mark read / read-all. |
| `docs/sprints/sprint-09-notifications-dashboard-audit/` | Modified | Cập nhật trạng thái `NOTI-02` -> `COMPLETED` (`2/7 task`). |

## 4. Quyết định kỹ thuật

- **Xử lý 1 outbox event trên mỗi UnitOfWork (`LIMIT 1 FOR UPDATE SKIP LOCKED`)**: Giúp mỗi event có giao dịch độc lập; lỗi xử lý ở một event không làm abort transaction PostgreSQL của các event khác, đồng thời dễ mở rộng nhiều worker song song.
- **Phát signal `NotificationRealtimePort` sau khi commit**: Chỉ gọi `emitToUser` sau khi transaction tạo notification & đánh dấu `PROCESSED` đã hoàn tất, tránh tình trạng client nhận tín hiệu Socket.IO trước khi dữ liệu sẵn sàng trong DB và không re-emit khi bị skip trùng.
- **Đặt `PATCH /read-all` trước `PATCH /:notificationId/read`**: Tránh Express khớp nhầm `"read-all"` vào tham số `:notificationId` (dù schema UUID sẽ từ chối `400`).

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prettier format | `npm --prefix backend run format:write` | `PASSED` |
| TypeScript check | `npm --prefix backend run typecheck` (`0` errors) | `PASSED` |
| ESLint | `npm --prefix backend run lint` (`0` errors) | `PASSED` |
| Backend build | `npm --prefix backend run build` (`tsc`) | `PASSED` |
| Clean Architecture fitness | `npm --prefix backend run test:architecture` (`5 passed (5)`) | `PASSED` |
| Unit tests | `npm --prefix backend run test:unit` (`11/11` files, `79/79` tests) | `PASSED` |
| PostgreSQL integration regression | `npm --prefix backend run test:integration` (`15/15` files, `43/43` tests) | `PASSED` |
| GitHub Actions CI | Chưa push lên remote để chạy CI cloud | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| User A không thể xem hoặc đánh dấu đã đọc notification của User B (`404`/`403`) | `PASSED` | Xác minh tại `notification-api.postgres.test.ts` (`404` cho user khác, inbox riêng tư từng actor). |
| Tạo comment có mention từ `COL-02` -> outbox worker tạo 1 notification đúng người nhận, retry không trùng | `PASSED` | Xác minh cả qua unit test và end-to-end PostgreSQL test. |
| `npm --prefix backend run test:architecture` đạt | `PASSED` | Đã bổ sung kiểm tra module `notification` trực tiếp vào fitness suite. |

## 7. Vấn đề và blocker

- Real-time delivery hiện nhận qua `NotificationRealtimePort` nhưng `Socket.IO` server thật và nối frontend thuộc phạm vi `NOTI-03`.

## 8. Ghi chú cho developer

- Khi triển khai `NOTI-03`, chỉ cần truyền adapter implement `NotificationRealtimePort` vào `createApp({ notificationRealtime })` và `createNotificationModule(prisma, authenticate, realtime)` trong `server.ts`.

## 9. Task tiếp theo

- [NOTI-03 — Socket.IO Server Real-time và tích hợp Notification UI](../../sprints/sprint-09-notifications-dashboard-audit/tasks/NOTI-03-socket-realtime-frontend.md)
