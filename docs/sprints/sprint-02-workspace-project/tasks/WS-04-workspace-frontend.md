# WS-04 — Workspace và invitation UI

## Thông tin Task

Sprint 02 · US-WS-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Đưa các luồng quản lý workspace và lời mời lên trình duyệt.

## Related Requirements

`FR-WS-01`, `UC-WS-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-02, WS-03, AUTH-11.

## Scope

Nối workspace switcher, quản lý thành viên, form mời và trang chấp nhận lời mời vào API.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

Owner/Admin thao tác theo quyền đã định. Người được mời có thể hoàn tất luồng qua phiên đã đăng nhập. UI xử lý loading, empty, lỗi quyền và lời mời không hợp lệ.

## Testing Requirements

Vitest/RTL và browser smoke trên môi trường test cho quản lý workspace và chấp nhận lời mời. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report WS-04](../../../reports/02-workspace-project/WS-04-workspace-frontend.md)
