# TASK-01 — Task schema và migration

## 1. Thông tin Task

- Sprint — 03, Task & Board
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-TASK-01`, `FR-BOARD-01`, `NFR-07`

## 2. Tóm tắt triển khai

Đã mở Sprint 03 với 6 Task từ Product Backlog. Thêm Prisma model Task và áp dụng migration `20261126000200_tasks` trên PostgreSQL test. Prisma Client đã sinh lại.

## 3. File thay đổi

- `backend/prisma/schema.prisma` và `backend/prisma/migrations/20261126000200_tasks/migration.sql`
- Workspace repository, service và error codes cho quy tắc thành viên đang được giao task
- `backend/tests/integration/task-schema.postgres.test.ts` và Project API regression
- Sprint 03 Backlog, Task Specs, Sprint Index, Reports Index và Roadmap

## 4. Quyết định kỹ thuật

Task có UUID, timestamp theo quy ước Prisma, hạn dạng PostgreSQL DATE theo OpenAPI, status mặc định TODO và version mặc định 0. Composite FK bắt parent và assignee thuộc cùng project. Assignee tham chiếu Project Membership. Dùng Restrict cho các FK Task để bảo vệ quan hệ khi xóa hoặc cập nhật khóa. Việc gỡ thành viên có assignment trả 409. CHECK từ chối version âm và self-parent. TASK-02 sẽ kiểm tra quy tắc một cấp subtask.

## 5. Kết quả kiểm chứng

| Check | Evidence | Status |
|---|---|---|
| Schema và migration | Prisma format/validate, `test:db:migrate`, migrate status và generate Client | PASSED |
| Constraints | PostgreSQL từ chối parent/assignee khác project, version âm, self-parent và xóa Project Membership đang được giao task | PASSED |
| Workspace API regression | Gỡ thành viên đang được giao task trả 409. Sau khi bỏ assignment, gỡ thành công. | PASSED |
| Regression | 36 integration và 62 unit test | PASSED |
| Static checks | Format, lint, typecheck và build | PASSED |

## 6. Acceptance Criteria

Schema, migration, khóa ghép, index và mặc định Task đã kiểm chứng trên PostgreSQL test.

## 7. Vấn đề và blocker

Development database chưa áp dụng migration Task. Cần áp dụng trước khi chạy bản backend mới với thao tác gỡ thành viên. TASK-02 và BOARD-01 sẽ bổ sung API tạo/sửa và xử lý version conflict.

## 8. Ghi chú cho developer

[Schema](../../../backend/prisma/schema.prisma) định nghĩa quan hệ và index. [Migration](../../../backend/prisma/migrations/20261126000200_tasks/migration.sql) bổ sung CHECK. [Sprint 03 Backlog](../../sprints/sprint-03-task-board/README.md) là nguồn trạng thái Task.

## 9. Task tiếp theo

[TASK-02 — Task và My Tasks API](../../sprints/sprint-03-task-board/tasks/TASK-02-task-api.md).
