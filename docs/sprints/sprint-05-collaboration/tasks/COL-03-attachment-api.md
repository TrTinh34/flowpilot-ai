# COL-03 — Attachment API và lưu trữ

## Thông tin Task

Sprint 05. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Tải lên và cấp URL tải xuống cho tệp của task.

## Related Requirements

[FR-COL-01](../../../02-SRS.md) · [UC-COL-01](../../../03-Use-Cases.md)

## Dependencies

COL-01, TASK-02.

## Scope

Multipart upload, storage port, metadata và signed download.

## Out of Scope

Giao diện upload và quét malware ngoài MVP.

## Implementation Requirements

Kiểm tra quyền, giới hạn dung lượng và xác minh định dạng file. Cleanup object khi lưu metadata thất bại. Tham chiếu [Database Design](../../../05-Database-Design.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Acceptance Criteria

Tệp hợp lệ tải lên và tải xuống được. Tệp sai định dạng, quá cỡ hoặc yêu cầu ngoài phạm vi bị từ chối.

## Testing Requirements

Unit tests và API integration với fake storage.

## Definition of Done

Kiểm chứng tiêu chí nghiệm thu và cập nhật báo cáo triển khai.

## Development Report Reference

[Báo cáo COL-03](../../../reports/05-collaboration/COL-03-attachment-api.md).
