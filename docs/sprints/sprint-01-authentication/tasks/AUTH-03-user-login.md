# AUTH-03 — User Login API

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Xác thực credentials và trả session theo hợp đồng Login.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-02, tích hợp cấp token từ AUTH-04.

## Scope

Tra email đã chuẩn hóa, đối chiếu bcrypt, xử lý lỗi credentials chung, tích hợp response Login.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Tuân thủ hợp đồng và quyết định kỹ thuật ở tài liệu liên quan. Xem báo cáo để đối chiếu với implementation thực tế.

## Acceptance Criteria

Credentials đúng trả token theo OpenAPI. Email không tồn tại và mật khẩu sai cùng trả 401. Login thất bại không tạo refresh record.

## Testing Requirements

Unit test bcrypt và lỗi, integration Register → Login trên PostgreSQL. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-03](../../../reports/01-authentication/AUTH-03-user-login.md) · [Bằng chứng integration](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
