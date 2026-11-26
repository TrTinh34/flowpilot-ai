# WS-02 — Workspace API và RBAC

## Thông tin Task

Sprint 02 · US-WS-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Cho phép user thao tác workspace trong đúng phạm vi quyền.

## Related Requirements

`FR-WS-01`, `UC-WS-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-01, AUTH-06.

## Scope

Triển khai API workspace, membership và chuyển quyền sở hữu theo OpenAPI. Kiểm tra membership hiện hành trong database.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

Tạo workspace và owner trong một transaction. Owner cuối không được rời hoặc bị xóa. Chỉ Owner chuyển quyền. Resource ngoài workspace trả 404 và thiếu quyền trong phạm vi trả 403.

## Testing Requirements

Supertest với PostgreSQL cho create, phân quyền, chuyển quyền, Owner cuối và cách ly workspace. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report WS-02](../../../reports/02-workspace-project/WS-02-workspace-membership.md)
