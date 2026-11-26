# TASK-01 — Task schema và migration

## Thông tin Task

Sprint 03. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Task schema và migration theo phạm vi Sprint 03.

## Related Requirements

[FR-TASK-01, FR-BOARD-01 và NFR-07](../../../02-SRS.md) · [Use Cases](../../../03-Use-Cases.md)

## Dependencies

PROJ-01.

## Scope

Tạo model Task và migration cho task, parent, assignee, version và index.

## Out of Scope

Collaboration, AI và chức năng của các Sprint sau.

## Implementation Requirements

Bám [OpenAPI](../../../06-API-Specification.yaml) và [Database Design](../../../05-Database-Design.md). Chuẩn bị quan hệ và optimistic version. Kiểm tra độ sâu subtask thuộc TASK-02.

## Acceptance Criteria

PostgreSQL từ chối version âm, parent khác project và assignee ngoài project. Kiểm chứng default TODO/version 0.

## Testing Requirements

Prisma validate, migration status, PostgreSQL constraint tests và backend regression. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí và cập nhật báo cáo triển khai.

## Development Report Reference

[Development Report TASK-01](../../../reports/03-task-board/TASK-01-task-database.md)
