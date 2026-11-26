# AUTH-04 — Access Token & Refresh Token Management

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Cấp access token và quản lý vòng đời refresh token.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-01, logic xác thực credentials từ AUTH-03.

## Scope

JWT, cookie HttpOnly, persistence theo hash, hạn dùng, rotation, reuse detection và transaction.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Tuân thủ hợp đồng và quyết định kỹ thuật ở tài liệu liên quan. Xem báo cáo để đối chiếu với implementation thực tế.

## Acceptance Criteria

JWT verify đúng claims và chữ ký. Rotation giữ family và thời hạn, reuse thu hồi đúng family, concurrent refresh và lỗi DB giữ tính nhất quán.

## Testing Requirements

JWT unit tests và PostgreSQL integration cho hash, cookie, expiry, rotation, reuse, concurrency và rollback. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-04](../../../reports/01-authentication/AUTH-04-token-management.md) · [Bằng chứng integration](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
