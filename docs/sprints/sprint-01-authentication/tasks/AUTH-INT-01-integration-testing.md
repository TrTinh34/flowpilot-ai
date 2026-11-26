# AUTH-INT-01 — Authentication Integration Testing

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Kiểm chứng vòng đời Authentication trên database thật.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-02–07, PostgreSQL test riêng.

## Scope

Migration test, safety guard, constraints, toàn luồng HTTP và regression gồm transaction, concurrency.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Dùng PostgreSQL test riêng, xác nhận tên database trước khi ghi và giữ fixture độc lập.

## Acceptance Criteria

Test database tách biệt. Các luồng Register, Login, Refresh, Logout, protected Current User và lifecycle có bằng chứng trên PostgreSQL.

## Testing Requirements

88/88 regression đã ghi nhận. Protected route và lifecycle qua Current User còn chờ hợp đồng. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-INT-01](../../../reports/01-authentication/AUTH-INT-01-integration-testing.md)
