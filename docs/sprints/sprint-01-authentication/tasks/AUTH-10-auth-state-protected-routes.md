# AUTH-10 — Authentication State & Protected Routes

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Hạng mục dự kiến được tách từ US-AUTH-01 theo danh sách Task của Sprint 01.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Quản lý trạng thái phiên và điều hướng route được bảo vệ.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-04, AUTH-05, hợp đồng Current User từ AUTH-07 khi cần lấy hồ sơ.

## Scope

Access token trong memory, trạng thái phục hồi phiên và route guard phía React. Phân quyền Workspace/Project thuộc Sprint sau.

## Out of Scope

Tính năng ngoài luồng Authentication, RBAC và các module của Sprint sau.

## Implementation Requirements

Dùng thiết kế và hợp đồng API hiện có. Ghi nhận dependency chưa được giải quyết trước khi triển khai phần liên quan.

## Acceptance Criteria

Route protected xử lý đúng trạng thái đang khôi phục, đã xác thực và chưa xác thực. Logout hoặc phiên hết hiệu lực đưa UI về trạng thái chưa xác thực.

## Testing Requirements

Kiểm tra state transitions, redirect và khôi phục phiên. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

Chưa có báo cáo triển khai.
