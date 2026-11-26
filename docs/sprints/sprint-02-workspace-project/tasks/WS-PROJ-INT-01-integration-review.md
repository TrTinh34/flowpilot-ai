# WS-PROJ-INT-01 — Workspace & Project integration và review

## Thông tin Task

Sprint 02 · US-WS-01 + US-PROJ-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Thu thập bằng chứng để nghiệm thu Sprint 02.

## Related Requirements

`FR-WS-01`, `UC-WS-01` và `FR-PROJ-01`, `UC-PROJ-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-01–04, PROJ-01–03.

## Scope

Kiểm chứng vòng đời workspace, invitation và project qua API/UI, rồi review Sprint.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

PostgreSQL integration xác nhận tenant isolation, vai trò, lời mời dùng một lần, Owner cuối, project membership và archive. Browser smoke và GitHub Actions có bằng chứng.

## Testing Requirements

Regression Auth, Vitest/Supertest, frontend tests, browser smoke, self-review và CI. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report WS-PROJ-INT-01](../../../reports/02-workspace-project/WS-PROJ-INT-01-integration-review.md)
