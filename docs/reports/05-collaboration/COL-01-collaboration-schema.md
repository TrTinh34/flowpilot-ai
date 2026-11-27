# COL-01 — Schema và migration Collaboration

## 1. Thông tin Task

- Sprint 05 · 2026-11-27 · COMPLETED
- FR-COL-01, UC-COL-01
- Báo cáo triển khai dựa trên migration, Prisma schema và kiểm thử PostgreSQL.

## 2. Tóm tắt triển khai

Thêm bảng `comments` và `attachments` cho task. Bình luận giữ tác giả và nội dung. Tệp đính kèm giữ người tải lên và metadata dùng để truy xuất object storage.

## 3. File thay đổi

| Đường dẫn | Thay đổi |
|---|---|
| `backend/prisma/schema.prisma` | Model và quan hệ với Task, User |
| `backend/prisma/migrations/20261127000000_collaboration/migration.sql` | DDL, indexes và ràng buộc PostgreSQL |
| `backend/tests/integration/collaboration-schema.postgres.test.ts` | Kiểm chứng insert, FK, dữ liệu sai và biên kích thước |
| `docs/sprints/sprint-05-collaboration/` | Sprint Backlog và task specs |

## 4. Quyết định kỹ thuật

- Kích thước từ 1 đến 10.485.760 byte, khớp giới hạn tối đa của giao diện upload hiện tại.
- Dùng `ON DELETE RESTRICT` để yêu cầu xử lý bình luận và metadata tệp trước khi xóa task hoặc user. Quyền ghi theo project thuộc application layer.
- Dùng index theo task để đọc bình luận và tệp. Object key duy nhất trên toàn bảng.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Migration PostgreSQL test | PASSED · `test:db:migrate` áp dụng migration thứ năm, status up to date |
| Prisma Client | PASSED · `prisma:generate` |
| Prisma schema với PostgreSQL test | PASSED · `prisma migrate diff ... --exit-code` không phát hiện khác biệt |
| Backend regression | PASSED · 68 unit, 39 integration PostgreSQL và 5 architecture |
| Backend code quality | PASSED · lint, typecheck, format và build |

## 6. Acceptance Criteria

| Tiêu chí | Bằng chứng |
|---|---|
| Deploy và status | PASSED · migration chạy trên PostgreSQL test |
| FK task và user hợp lệ | PASSED · PostgreSQL chấp nhận bản ghi hợp lệ, từ chối ID không tồn tại cho cả hai bảng |
| Body và uniqueness | PASSED · từ chối body chỉ có khoảng trắng và object key trùng |
| Giới hạn kích thước | PASSED · chấp nhận 1 và 10.485.760 byte, từ chối 0, số âm và vượt mức tối đa |

## 7. Vấn đề và blocker

Migration được xác minh trên PostgreSQL test. Database development cần áp dụng migration trước khi chạy Comment hoặc Attachment API.

## 8. Ghi chú cho developer

PostgreSQL kiểm tra tham chiếu tới task và user. Comment và Attachment API cần dùng quyền theo task để kiểm tra membership và tenant scope trước khi ghi.

## 9. Task tiếp theo

COL-02 — Comment API và mention.
