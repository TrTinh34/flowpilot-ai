# COL-INT-01 — Kiểm thử tích hợp và Sprint Review

## Thông tin Task

Sprint 05. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Kiểm chứng luồng Collaboration để nghiệm thu Sprint.

## Related Requirements

[FR-COL-01](../../../02-SRS.md) · [UC-COL-01](../../../03-Use-Cases.md)

## Dependencies

COL-01–04.

## Scope

PostgreSQL, fake storage, browser smoke, review và CI.

## Out of Scope

Notification delivery, Dashboard và AI.

## Implementation Requirements

Đối chiếu SRS, OpenAPI và Database Design với luồng thật. Tham chiếu [Database Design](../../../05-Database-Design.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Acceptance Criteria

Regression, quyền truy cập, tenant isolation, giới hạn file, cleanup object và CI đều đạt.

## Testing Requirements

Chạy regression, kiểm thử browser và theo dõi GitHub Actions.

## Definition of Done

Kiểm chứng tiêu chí nghiệm thu và cập nhật báo cáo triển khai.

## Development Report Reference

[Báo cáo COL-INT-01](../../../reports/05-collaboration/COL-INT-01-integration-review.md).
