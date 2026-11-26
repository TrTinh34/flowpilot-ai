# AUTH-09 — Login & Register Frontend

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Hạng mục dự kiến được tách từ US-AUTH-01 theo danh sách Task của Sprint 01.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Triển khai Login/Register UI theo thiết kế.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-08, request schema từ AUTH-02 và AUTH-03.

## Scope

Trang và form React Hook Form + Zod, validation và render trạng thái đã thiết kế. Kết nối luồng end-to-end thuộc AUTH-11.

## Out of Scope

Tính năng ngoài luồng Authentication, RBAC và các module của Sprint sau.

## Implementation Requirements

Dùng thiết kế và hợp đồng API hiện có. Ghi nhận dependency chưa được giải quyết trước khi triển khai phần liên quan.

## Acceptance Criteria

Form đúng các trường đã được OpenAPI quy định, chặn dữ liệu sai và phản hồi rõ khi gửi hoặc lỗi.

## Testing Requirements

Vitest và React Testing Library cho input, validation, submit và trạng thái lỗi. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

Chưa có báo cáo triển khai.
