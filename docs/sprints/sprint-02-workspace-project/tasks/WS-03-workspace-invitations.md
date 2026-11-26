# WS-03 — Mời và chấp nhận thành viên

## Thông tin Task

Sprint 02 · US-WS-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Cho phép workspace mở rộng thành viên bằng lời mời.

## Related Requirements

`FR-WS-01`, `UC-WS-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-01, WS-02.

## Scope

Triển khai phát hành và chấp nhận lời mời theo OpenAPI. Dùng abstraction gửi email đã có trong thiết kế.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

Lời mời hết hạn sau 48 giờ. Chỉ tài khoản khớp email được chấp nhận một lần. Chấp nhận hợp lệ tạo membership và cập nhật lời mời trong cùng transaction.

## Testing Requirements

Supertest với PostgreSQL cho đúng/sai email, hết hạn, replay, request đồng thời và vai trò thiếu quyền. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report WS-03](../../../reports/02-workspace-project/WS-03-workspace-invitations.md)
