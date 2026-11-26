# WS-01 — Workspace schema và migration

## Thông tin Task

Sprint 02 · US-WS-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Chuẩn bị nền dữ liệu cho workspace và membership.

## Related Requirements

`FR-WS-01`, `UC-WS-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

AUTH-01.

## Scope

Tạo Prisma models và migration `workspace_invitations` cho `workspaces`, `workspace_members` và `invitations`.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

Giữ UUID và timestamp theo Database Design. Khóa ngoại liên kết user và workspace. Bảo đảm membership duy nhất, tên workspace khác rỗng, token hash duy nhất và partial unique index cho lời mời PENDING theo workspace và `LOWER(email)`.

## Testing Requirements

Prisma validate, migrate deploy trên PostgreSQL test, kiểm tra constraints và migration history. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report WS-01](../../../reports/02-workspace-project/WS-01-workspace-database.md)
