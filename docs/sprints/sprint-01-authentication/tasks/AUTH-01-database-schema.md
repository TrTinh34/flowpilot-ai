# AUTH-01 — Database Schema & Migration

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Khôi phục từ Development Report, thiết kế và implementation hiện có. Các tiêu chí bên dưới tóm tắt tiêu chí đã ghi trong báo cáo.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Định nghĩa và áp dụng schema User và RefreshToken.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [Database Design](../../../05-Database-Design.md)

## Dependencies

Prisma/PostgreSQL nền tảng.

## Scope

UUID, quan hệ, unique index LOWER(email), migration và Prisma Client theo Database Design.

## Out of Scope

Tính năng ngoài trách nhiệm của Task này và thay đổi hợp đồng hoặc schema chưa được thống nhất.

## Implementation Requirements

Tuân thủ hợp đồng và quyết định kỹ thuật ở tài liệu liên quan. Xem báo cáo để đối chiếu với implementation thực tế.

## Acceptance Criteria

Migration đã áp dụng trên development. Schema, khóa, index và health check đã được đối chiếu.

## Testing Requirements

Prisma validate, migrate status, catalog PostgreSQL, backend smoke. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

[Development Report AUTH-01](../../../reports/01-authentication/AUTH-01-database-schema.md)
