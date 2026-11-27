# DASH-01 — Audit Log Schema và Emission Ports

## Thông tin Task

- **Task ID**: `DASH-01`
- **Tên Task**: Audit Log Schema và Emission Ports
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`COMPLETED`)
- **Ưu tiên**: P0 · **Ước lượng**: 5h
- **Nguồn**: [US-DASH-01](../../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log)

## Objective

Tạo Prisma model & migration cho bảng `audit_logs`, xây dựng module `backend/src/modules/audit/` theo Clean Architecture 4 tầng và tích hợp ghi nhật ký kiểm toán (`AuditLoggerPort`) cho các hành động thay đổi trạng thái quan trọng trong workspace/project/task/board.

## Related Requirements

- [FR-DASH-01](../../../02-SRS.md)
- [UC-DASH-01](../../../03-Use-Cases.md#uc-dash-01--dashboard-tiến-độ-my-tasks-audit-log)

## Dependencies

- `WS-01`, `PROJ-01`, `TASK-01`, `BOARD-01` (các luồng tạo/cập nhật/di chuyển có UnitOfWork/transaction hiện có).

## Scope

- Thêm model `AuditLog` (`id`, `workspaceId`, `projectId`, `actorId`, `action`, `targetType`, `targetId`, `metadata`, `createdAt`) và indexes (`projectId`, `createdAt DESC`) trong `backend/prisma/schema.prisma` + migration mới.
- Tổ chức `backend/src/modules/audit/` theo Clean Architecture 4 tầng (`domain/`, `application/`, `infrastructure/`, `presentation/`, `audit.module.ts`, `index.ts`).
- Expose `AuditLoggerPort` (hoặc application service port qua `index.ts`) để ghi audit atomically cùng transaction khi thực hiện các thao tác chính (tạo/archive project, đổi member project, tạo/cập nhật/xóa task, move task trên board).

## Out of Scope

- Endpoint query audit & dashboard metrics (`DASH-02`) và giao diện (`DASH-03`).

## Implementation Requirements

- Ghi audit trong transaction bằng transaction-scoped Prisma client (`tx`), không dùng global `prisma` bên trong `prisma.$transaction`.
- Bảo vệ module boundaries: module khác chỉ gọi qua `audit/index.ts` hoặc Application Port; không deep-import vào `audit/infrastructure/`.
- Không lưu thông tin nhạy cảm (password, token, secret) vào cột `metadata` của `audit_logs`.

## Acceptance Criteria

- Migration `audit_logs` apply thành công trên dev và test PostgreSQL DB.
- Khi tạo/sửa/di chuyển task hoặc cập nhật project, bản ghi audit tương ứng được tạo chính xác trong cùng transaction (rollback nếu nghiệp vụ chính thất bại).

## Testing Requirements

- Unit tests Use Case/Port với fake storage + integration tests kiểm chứng ghi audit theo transaction trên PostgreSQL test DB + `test:architecture`.

## Definition of Done

- Migration, Clean Architecture fitness và transaction tests đạt; tạo Development Report tại `docs/reports/06-notifications-dashboard/DASH-01-audit-schema-ports.md`.

## Development Report Reference

[Báo cáo DASH-01](../../../reports/06-notifications-dashboard/DASH-01-audit-schema-ports.md)
