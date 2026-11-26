# AUTH-05 — Logout & Token Revocation

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Kết thúc phiên hiện tại bằng refresh cookie.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-04.

## Scope

Thu hồi family, xóa cookie đúng phạm vi và giữ hành vi JWT stateless.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Tuân thủ hợp đồng và quyết định kỹ thuật ở tài liệu liên quan. Xem báo cáo để đối chiếu với implementation thực tế.

## Acceptance Criteria

Logout thành công trả 204. Refresh token của family bị từ chối sau commit, phiên khác vẫn hoạt động. JWT đã cấp còn hiệu lực đến hết hạn.

## Testing Requirements

Supertest và PostgreSQL cho replay, concurrency với Refresh, cookie và rollback. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-05](../../../reports/01-authentication/AUTH-05-logout-token-revocation.md) · [Bằng chứng integration](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
