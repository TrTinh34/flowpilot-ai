# PROJ-02 — Project API và phân quyền tài nguyên

## Thông tin Task

Sprint 02 · US-PROJ-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Cho phép quản lý project với kiểm tra quyền theo tài nguyên.

## Related Requirements

`FR-PROJ-01`, `UC-PROJ-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-02, PROJ-01, AUTH-06.

## Scope

Triển khai API tạo, cập nhật, lưu trữ và quản lý thành viên project theo OpenAPI.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

Owner/Admin tạo project trong workspace phù hợp. Manager chỉ quản lý project được cấp quyền, project member thuộc cùng workspace và project archived chỉ đọc. Giữ 404 ngoài workspace, 403 khi thiếu quyền.

## Testing Requirements

Supertest với PostgreSQL cho workspace scope, ma trận quyền, membership và write bị chặn khi archived. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report PROJ-02](../../../reports/02-workspace-project/PROJ-02-project-api-authorization.md)
