# AUTH-07 — Get Current User API

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Trả hồ sơ công khai của user trong access token đã xác minh.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-01, AUTH-06 và hợp đồng Current User.

## Scope

Lookup UUID theo verified subject, public DTO và HTTP response theo hợp đồng được chốt. Cập nhật hồ sơ nằm ngoài phạm vi.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Chốt hợp đồng HTTP trước khi mount route. Lấy ID từ verified Bearer context và dùng public select.

## Acceptance Criteria

Route và envelope khớp hợp đồng. ID đến từ verified context, không lộ hash và phân biệt lỗi token, user không tồn tại và lỗi DB.

## Testing Requirements

Lookup PostgreSQL đã đạt. HTTP integration, cách ly danh tính qua request và response contract còn chờ route. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-07](../../../reports/01-authentication/AUTH-07-get-current-user.md) · [Bằng chứng integration](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
