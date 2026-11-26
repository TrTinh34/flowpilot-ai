# AUTH-06 — Authentication Middleware

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Thiết lập danh tính xác thực tại protected route.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

JWT verifier từ AUTH-04, route của AUTH-07 cho nghiệm thu tích hợp.

## Scope

Parse Bearer, verify JWT và gắn req.auth.userId. RBAC thuộc phạm vi các Sprint sau.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Tuân thủ hợp đồng và quyết định kỹ thuật ở tài liệu liên quan. Xem báo cáo để đối chiếu với implementation thực tế.

## Acceptance Criteria

Token hợp lệ đi tiếp với verified subject, token thiếu hoặc không hợp lệ trả 401. Public endpoints hoạt động và middleware được kiểm chứng trên route ứng dụng.

## Testing Requirements

13 ca qua Express test harness đã đạt. Còn thiếu integration qua protected route. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-06](../../../reports/01-authentication/AUTH-06-authentication-middleware.md) · [Bằng chứng integration](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
