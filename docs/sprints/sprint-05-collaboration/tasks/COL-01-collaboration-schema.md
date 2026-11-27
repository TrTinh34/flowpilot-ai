# COL-01 — Schema và migration

## Thông tin Task

Sprint 05. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Tạo bảng comments và attachments theo Database Design.

## Related Requirements

[FR-COL-01](../../../02-SRS.md) · [UC-COL-01](../../../03-Use-Cases.md)

## Dependencies

TASK-01.

## Scope

Prisma schema, PostgreSQL migration và kiểm thử ràng buộc.

## Out of Scope

Task API, mention, storage và UI.

## Implementation Requirements

Dùng UUID, timestamptz, FK tới task và user. Giữ object key duy nhất và giới hạn kích thước từ 1 đến 10.485.760 byte. Tham chiếu [Database Design](../../../05-Database-Design.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Acceptance Criteria

Migration deploy/status đạt. PostgreSQL từ chối FK sai, nội dung trắng, object key trùng và kích thước ngoài giới hạn.

## Testing Requirements

Chạy migration, PostgreSQL integration và architecture tests.

## Definition of Done

Kiểm chứng tiêu chí nghiệm thu và cập nhật báo cáo triển khai.

## Development Report Reference

[Báo cáo COL-01](../../../reports/05-collaboration/COL-01-collaboration-schema.md).
