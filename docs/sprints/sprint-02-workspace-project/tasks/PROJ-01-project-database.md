# PROJ-01 — Project schema và migration

## Thông tin Task

Sprint 02 · US-PROJ-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Chuẩn bị nền dữ liệu cho project trong workspace.

## Related Requirements

`FR-PROJ-01`, `UC-PROJ-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-01.

## Scope

Chuẩn bị schema `projects` và `project_members` trong phạm vi Sprint 02.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`. Khi triển khai, chốt migration cho Project tách khỏi bảng tasks để bám ranh giới Sprint 02/03.

## Acceptance Criteria

Project có workspace hợp lệ, status theo thiết kế và index `(workspace_id, status)`. Membership duy nhất theo project/user. Đối chiếu cách bảo đảm project member thuộc cùng workspace tại ranh giới schema/service.

## Testing Requirements

Prisma validate, migrate deploy trên test và đối chiếu constraint, index, trạng thái. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report PROJ-01](../../../reports/02-workspace-project/PROJ-01-project-database.md)
