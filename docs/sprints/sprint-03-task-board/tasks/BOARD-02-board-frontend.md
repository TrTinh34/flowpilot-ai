# BOARD-02 — Kanban và điều khiển di chuyển

## Thông tin Task

Sprint 03. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Kanban và điều khiển di chuyển theo phạm vi Sprint 03.

## Related Requirements

[FR-TASK-01, FR-BOARD-01 và NFR-07](../../../02-SRS.md) · [Use Cases](../../../03-Use-Cases.md)

## Dependencies

BOARD-01, TASK-03.

## Scope

Triển khai cột Kanban, kéo thả và thao tác bàn phím/nút thay thế theo thiết kế.

## Out of Scope

Collaboration, AI và chức năng của các Sprint sau.

## Implementation Requirements

Bám [OpenAPI](../../../06-API-Specification.yaml) và [Database Design](../../../05-Database-Design.md). Tái sử dụng quyền theo workspace/project và giữ hành vi 404/403 theo SRS.

## Acceptance Criteria

Có thể di chuyển bằng chuột và thao tác thay thế. UI phản ánh thứ tự từ server và xử lý 409 bằng tải lại.

## Testing Requirements

Chạy kiểm thử liên quan trên môi trường test và ghi bằng chứng. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí và cập nhật báo cáo triển khai.

## Development Report Reference

[Báo cáo triển khai BOARD-02](../../../reports/03-task-board/BOARD-02-board-frontend.md).
