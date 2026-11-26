# TASK-03 — Task detail, subtask và My Tasks UI

## Thông tin Task

Sprint 03. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Task detail, subtask và My Tasks UI theo phạm vi Sprint 03.

## Related Requirements

[FR-TASK-01, FR-BOARD-01 và NFR-07](../../../02-SRS.md) · [Use Cases](../../../03-Use-Cases.md)

## Dependencies

TASK-02, PROJ-03.

## Scope

Tích hợp các luồng task, assignee, deadline, priority và My Tasks vào frontend.

## Out of Scope

Collaboration, AI và chức năng của các Sprint sau.

## Implementation Requirements

Bám [OpenAPI](../../../06-API-Specification.yaml) và [Database Design](../../../05-Database-Design.md). Tái sử dụng quyền theo workspace/project và giữ hành vi 404/403 theo SRS.

## Acceptance Criteria

UI xử lý loading, empty, lỗi quyền và version conflict. My Tasks hiển thị nhiệm vụ đã giao.

## Testing Requirements

Chạy kiểm thử liên quan trên môi trường test và ghi bằng chứng. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí và cập nhật báo cáo triển khai.

## Development Report Reference

Chưa triển khai.
