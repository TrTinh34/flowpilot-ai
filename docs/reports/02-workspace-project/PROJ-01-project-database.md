# PROJ-01 — Project schema và migration

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED

## 2. Tóm tắt triển khai

Thêm Project và ProjectMember, enum ACTIVE/ARCHIVED và MANAGER/MEMBER, FK User/Workspace và index. Migration `20261126000100_projects` tách khỏi bảng tasks thuộc Sprint 03. Ràng buộc thành viên project phải cùng workspace được thực thi qua service dùng cùng khóa workspace ở PROJ-02.

## 3. File thay đổi

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/20261126000100_projects/`
- `backend/tests/integration/project-schema.postgres.test.ts`
- `docs/05-Database-Design.md`
- Sprint Backlog, Roadmap và Reports Index

## 4. Quyết định kỹ thuật

Xem phạm vi và quyết định trong đặc tả PROJ-01 và phần tóm tắt.

## 5. Kết quả kiểm chứng

Prisma validate, migrate deploy/status trên flowpilot_ai_test và generate Client đạt. PostgreSQL test xác nhận default ACTIVE, index, unique membership và FK. Backend build đạt.

## 6. Acceptance Criteria

Đã đối chiếu các tiêu chí của [Task Spec](../../sprints/sprint-02-workspace-project/tasks/PROJ-01-project-database.md) với kết quả kiểm thử.

## 7. Vấn đề và blocker

Xem giới hạn môi trường hoặc phạm vi được ghi trong phần tóm tắt.

## 8. Ghi chú cho developer

Tra cứu các file thay đổi ở mục 3.

## 9. Task tiếp theo

Theo [Sprint Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog).
