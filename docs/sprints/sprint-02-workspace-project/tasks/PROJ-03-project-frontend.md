# PROJ-03 — Project list và settings UI

## Thông tin Task

Sprint 02 · US-PROJ-01. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Đưa các luồng quản lý project lên trình duyệt.

## Related Requirements

`FR-PROJ-01`, `UC-PROJ-01`. Xem [SRS](../../../02-SRS.md), [Use Cases](../../../03-Use-Cases.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Dependencies

WS-04, PROJ-02.

## Scope

Nối danh sách project, form tạo/chỉnh sửa, trạng thái lưu trữ và quản lý project members.

## Out of Scope

Các nghiệp vụ Task/Board và tính năng Sprint sau.

## Implementation Requirements

Đối chiếu [Database Design](../../../05-Database-Design.md) và [System Design](../../../04-System-Design.md). Giữ hợp đồng API hiện hành và kiểm tra tenant isolation theo `NFR-03`.

## Acceptance Criteria

UI hiển thị đúng project theo workspace, xử lý loading/error/empty và phản ánh hành vi chỉ đọc khi archived. Backend quyết định quyền truy cập.

## Testing Requirements

Vitest/RTL và browser smoke cho project list, quản lý project và trạng thái archived. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng tiêu chí bắt buộc liên quan và lưu kết quả trong Development Report.

## Development Report Reference

[Development Report PROJ-03](../../../reports/02-workspace-project/PROJ-03-project-frontend.md)
