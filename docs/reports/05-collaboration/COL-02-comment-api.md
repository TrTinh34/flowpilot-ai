# COL-02 — Comment API và mention

## 1. Thông tin Task

- Sprint 05 · 2026-11-27 · COMPLETED
- FR-COL-01, UC-COL-01
- Bằng chứng từ unit tests và HTTP integration trên PostgreSQL test.

## 2. Tóm tắt triển khai

`GET /api/v1/tasks/:taskId/comments` trả danh sách phân trang. `POST` tạo bình luận và trả tên hiển thị của tác giả. Khi có mention hợp lệ, transaction ghi thêm một sự kiện `COMMENT_MENTIONED` với danh sách người nhận đã loại trùng.

## 3. File thay đổi

| Đường dẫn | Thay đổi |
|---|---|
| `backend/src/modules/collaboration/` | Use cases, ports, Prisma adapter và HTTP routes |
| `backend/src/modules/task/index.ts`, `backend/src/routes/index.ts` | Chia sẻ quyền truy cập task và đăng ký router |
| `backend/prisma/schema.prisma`, `backend/prisma/migrations/20261127000100_outbox_events/` | Lưu sự kiện outbox |
| `backend/tests/` | Unit, HTTP integration, rollback và architecture fitness |
| `docs/06-API-Specification.yaml` | Contract bình luận, phân trang và validation |

## 4. Quyết định kỹ thuật

- Dùng quyền đọc task hiện hành cho bình luận. Khóa workspace rồi project và kiểm tra lại quyền trước khi ghi. Cho phép đọc lịch sử ở project đã lưu trữ.
- Mention yêu cầu membership hiện hành ở cả project và workspace. ID trùng được gộp sau khi chuẩn hóa chữ thường. Giới hạn 100 ID mỗi request và 100 bình luận mỗi trang.
- Lưu một outbox event mỗi bình luận có mention. Payload chứa ID của bình luận, task, project, tác giả và người nhận. Worker Notification sẽ xử lý sự kiện ở task sau.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Prisma Client và migration PostgreSQL | PASSED · `prisma:generate`, `test:db:migrate` áp dụng migration thứ sáu |
| Đối chiếu Prisma schema | PASSED · `prisma migrate diff --exit-code` xác nhận schema khớp PostgreSQL test |
| Backend regression | PASSED · 73 unit, 40 integration PostgreSQL và 5 architecture |
| Backend code quality | PASSED · typecheck, lint, format và build |

## 6. Acceptance Criteria

| Tiêu chí | Bằng chứng |
|---|---|
| Quyền đọc và ghi bình luận | PASSED · Member và Manager hợp lệ, 403 ngoài project, 404 ngoài tenant, 409 khi ghi vào project đã lưu trữ |
| Mention và outbox | PASSED · 422 cho mention ngoài project, loại trùng người nhận, dữ liệu bình luận và event cùng rollback |
| Validation và phân trang | PASSED · body trắng hoặc size vượt giới hạn trả 400, hai trang chứa hai bình luận đã tạo |

## 7. Vấn đề và blocker

Việc phát thông báo tới inbox hoặc qua real-time thuộc Notification. Migration được áp dụng trên PostgreSQL test.

## 8. Ghi chú cho developer

Client gửi `mentionIds: []` khi không có mention. Phân trang mặc định `page=0&size=20`, thứ tự theo thời điểm tạo rồi ID.

## 9. Task tiếp theo

COL-03 — Attachment API và lưu trữ.
