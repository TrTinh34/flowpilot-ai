# COL-02 — Comment API và mention

## Thông tin Task

Sprint 05. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Cho phép đọc, tạo bình luận và ghi nhận mention.

## Related Requirements

[FR-COL-01](../../../02-SRS.md) · [UC-COL-01](../../../03-Use-Cases.md)

## Dependencies

COL-01, TASK-02.

## Scope

Comment API theo task, kiểm tra mention, lưu sự kiện outbox.

## Out of Scope

Inbox và real-time delivery.

## Implementation Requirements

Kiểm tra quyền hiện hành và ghi bình luận cùng sự kiện trong transaction. Tham chiếu [Database Design](../../../05-Database-Design.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Acceptance Criteria

Member hợp lệ đọc và tạo bình luận. Mention ngoài project bị từ chối. Ngoài tenant trả 404.

## Testing Requirements

Unit tests và PostgreSQL API integration.

## Definition of Done

Kiểm chứng tiêu chí nghiệm thu và cập nhật báo cáo triển khai.

## Development Report Reference

Chờ báo cáo triển khai.
