# PROJ-02 — Project API và phân quyền tài nguyên

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED

## 2. Tóm tắt triển khai

Đã triển khai list/create, update/archive và add membership, kèm GET directory để UI đọc settings. Owner/Admin thấy mọi project trong workspace. Manager quản lý project được cấp và chỉ có thể thêm Member. Ngoài tenant trả 404, thiếu quyền trong tenant trả 403, project archived từ chối ghi với 409. Lấy cùng row lock với Workspace; khi rời workspace, xóa project membership liên quan trong transaction để không để quyền cũ tồn tại.

## 3. File thay đổi

- `backend/src/modules/project/`
- `backend/src/modules/workspace/workspace.repository.ts`
- `backend/src/modules/workspace/workspace.routes.ts`
- `backend/src/routes/index.ts`
- `backend/src/errors/error-codes.ts`
- `backend/tests/integration/project-api.postgres.test.ts`
- `docs/06-API-Specification.yaml`
- Sprint Backlog, Roadmap và Reports Index

## 4. Quyết định kỹ thuật

Xem phạm vi và quyết định trong đặc tả PROJ-02 và phần tóm tắt.

## 5. Kết quả kiểm chứng

35 integration test đạt trên PostgreSQL. Format, lint, typecheck, build backend đạt.

## 6. Acceptance Criteria

Đã đối chiếu các tiêu chí của [Task Spec](../../sprints/sprint-02-workspace-project/tasks/PROJ-02-project-api-authorization.md) với kết quả kiểm thử.

## 7. Vấn đề và blocker

Xem giới hạn môi trường hoặc phạm vi được ghi trong phần tóm tắt.

## 8. Ghi chú cho developer

Tra cứu các file thay đổi ở mục 3.

## 9. Task tiếp theo

Theo [Sprint Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog).
