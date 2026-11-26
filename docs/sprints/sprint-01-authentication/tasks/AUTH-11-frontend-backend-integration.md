# AUTH-11 — Frontend & Backend Integration

## Thông tin Task

- Sprint — [Sprint 01](../README.md)
- Nguồn — Hạng mục dự kiến được tách từ US-AUTH-01 theo danh sách Task của Sprint 01.
- Trạng thái — Tra cứu tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Nối UI và auth state với API đã thống nhất.

## Related Requirements

[FR-AUTH-01 và NFR liên quan](../../../02-SRS.md) · [UC-AUTH-01](../../../03-Use-Cases.md) · [System Design](../../../04-System-Design.md) · [OpenAPI](../../../06-API-Specification.yaml)

## Dependencies

AUTH-02–07, AUTH-09, AUTH-10.

## Scope

Register, Login, Refresh, Logout và tải Current User theo hợp đồng. Xử lý cookie/CORS, refresh coordination và trạng thái lỗi.

## Out of Scope

Tính năng ngoài luồng Authentication, RBAC và các module của Sprint sau.

## Implementation Requirements

Dùng thiết kế và hợp đồng API hiện có. Ghi nhận dependency chưa được giải quyết trước khi triển khai phần liên quan.

## Acceptance Criteria

Luồng đăng ký, đăng nhập, làm mới và đăng xuất hoạt động trong trình duyệt. Refresh đồng thời được điều phối để tránh kích hoạt reuse ngoài dự kiến.

## Testing Requirements

Kiểm tra browser flow trên môi trường test, gồm cookie, lỗi 401, email trùng và phục hồi phiên. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí bắt buộc của Task và lưu kết quả vào Development Report.

## Development Report Reference

Chưa có báo cáo triển khai.
