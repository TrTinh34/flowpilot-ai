# DASH-01 — Audit Log Schema và Emission Ports

## 1. Thông tin Task

- **Task ID**: `DASH-01`
- **Tên Task**: Audit Log Schema và Emission Ports
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../../sprints/sprint-09-notifications-dashboard-audit/README.md)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task DASH-01](../../sprints/sprint-09-notifications-dashboard-audit/tasks/DASH-01-audit-schema-ports.md), [FR-DASH-01](../../02-SRS.md), [UC-DASH-01](../../03-Use-Cases.md#uc-dash-01--dashboard-tiến-độ-my-tasks-audit-log)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo triển khai mới kèm kiểm chứng trực tiếp Prisma migration, architecture fitness, unit tests và toàn bộ PostgreSQL integration regression.

## 2. Tóm tắt triển khai

- Bổ sung model `AuditLog` (`audit_logs`) và các quan hệ trên `User`, `Workspace`, `Project` trong `backend/prisma/schema.prisma` cùng migration `backend/prisma/migrations/20261128000100_audit_logs/migration.sql`.
- Tổ chức lại module `backend/src/modules/audit/` theo Clean Architecture (`domain/`, `application/ports/audit.port.ts`, `infrastructure/prisma-audit.repository.ts`, `audit.module.ts`, `index.ts`) và xóa 6 placeholder `// TODO:` cũ.
- Tích hợp `AuditLoggerPort` (`createAuditLogger(tx)`) vào trong transaction của `task` (`CreateTaskUseCase`, `UpdateTaskUseCase`, `MoveTaskUseCase` thông qua `PrismaTaskUnitOfWork`) và `project` (`createProject`, `updateProject`, `addProjectMember`).
- Bổ sung `modules/audit` vào [clean-architecture.test.ts](../../../backend/tests/architecture/clean-architecture.test.ts) để đảm bảo Dependency Rule và chặn deep-import.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/prisma/schema.prisma` | Modified | Thêm model `AuditLog` và quan hệ đối ứng trên `User`, `Workspace`, `Project`. |
| `backend/prisma/migrations/20261128000100_audit_logs/migration.sql` | Added | Tạo bảng `audit_logs`, checks non-blank (`action`, `target_type`), FKs `RESTRICT` và indexes `project_id`/`workspace_id`/`actor_id`. |
| `backend/src/modules/audit/` (`domain/`, `application/`, `infrastructure/`, `audit.module.ts`, `index.ts`) | Added | Port `AuditLoggerPort`, `AuditLogReaderPort`, `PrismaAuditLogger` và `PrismaAuditReader`. |
| `backend/src/modules/audit/audit.*.ts` (6 files cũ) | Deleted | Xóa các placeholder phẳng trước đây. |
| `backend/src/modules/task/` (`task-unit-of-work.port.ts`, `prisma-task-unit-of-work.ts`, `create-task`, `update-task`, `move-task`) | Modified | Ghi `TASK_CREATED`, `TASK_UPDATED`, `TASK_MOVED` atomically trong `TaskUnitOfWork`. |
| `backend/src/modules/project/project.service.ts` | Modified | Ghi `PROJECT_CREATED`, `PROJECT_UPDATED`, `PROJECT_ARCHIVED`, `PROJECT_MEMBER_ADDED` bằng transaction client `tx`. |
| `backend/tests/architecture/clean-architecture.test.ts` | Modified | Thêm `modules/audit` vào bộ kiểm tra Clean Architecture và chống deep-import. |
| `backend/tests/unit/audit.use-cases.test.ts` | Added | Unit tests xác minh emission và không ghi audit khi conflict version thất bại. |
| `backend/tests/integration/audit-schema-tx.postgres.test.ts` | Added | Kiểm tra ràng buộc DB và atomicity khi thực hiện tạo/move/conflict trên PostgreSQL test DB. |
| `backend/tests/integration/{project-api,task-api}.postgres.test.ts` | Modified | Bổ sung xóa `auditLog` trước `project`/`workspace` trong `afterAll` để giữ clean DB hygiene. |
| `docs/sprints/sprint-09-notifications-dashboard-audit/` | Modified | Cập nhật trạng thái `DASH-01` -> `COMPLETED` (`4/7 task`). |

## 4. Quyết định kỹ thuật

- **Optional `audit?: AuditLoggerPort` trong `TaskTransactionRepositories`**: Giữ tương thích ngược cho bộ unit tests `task.use-cases.test.ts` hiện hành đồng thời luôn inject `createAuditLogger(tx)` tại `PrismaTaskUnitOfWork`.
- **Chỉ ghi bằng `tx` (transaction-scoped Prisma client)**: Đảm bảo nếu mutation nghiệp vụ bị lỗi hoặc gặp xung đột `409` (`TASK_VERSION_CONFLICT`), không phát sinh bản ghi audit mồ côi.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prisma Client & DB Migrations | `prisma:generate`, `test:db:migrate` (`flowpilot_ai_test`), `prisma migrate deploy` (`flowpilot_ai`) | `PASSED` |
| Backend format, lint, typecheck, build | `format:write`, `lint` (sau edit cuối), `typecheck`, `build` | `PASSED` |
| Clean Architecture fitness | `npm --prefix backend run test:architecture` (`5 passed (5)`) | `PASSED` |
| Backend unit tests | `npm --prefix backend run test:unit` (`12/12` files, `81/81` tests) | `PASSED` |
| PostgreSQL integration regression | `npm --prefix backend run test:integration` sau edit cuối (`17/17` files, `45/45` tests) | `PASSED` |
| GitHub Actions CI | Chưa push lên remote để chạy CI cloud | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Migration `audit_logs` apply thành công trên dev và test PostgreSQL DB | `PASSED` | Đã apply `20261128000100_audit_logs` trên cả 2 DB ở `localhost:5434`. |
| Bản ghi audit tạo chính xác trong cùng transaction và rollback khi nghiệp vụ thất bại | `PASSED` | Xác minh trong `audit-schema-tx.postgres.test.ts` (`409` không tạo row `TASK_MOVED`). |

## 7. Vấn đề và blocker

- Endpoint đọc `GET /api/v1/projects/:projectId/audit` và `GET /api/v1/projects/:projectId/dashboard` thuộc phạm vi `DASH-02`.

## 8. Ghi chú cho developer

- `PrismaAuditReader` đã sẵn sàng trong `backend/src/modules/audit/infrastructure/` với phương thức `findProjectAccess` và `listByProject` để tái sử dụng trực tiếp ở `DASH-02`.

## 9. Task tiếp theo

- [DASH-02 — Dashboard Metrics và Audit Query API](../../sprints/sprint-09-notifications-dashboard-audit/tasks/DASH-02-dashboard-audit-api.md)
