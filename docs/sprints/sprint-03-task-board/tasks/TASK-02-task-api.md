# TASK-02 — Task và My Tasks API

## Thông tin Task

Sprint 03. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Task và My Tasks API theo phạm vi Sprint 03.

## Related Requirements

[FR-TASK-01, FR-BOARD-01 và NFR-07](../../../02-SRS.md) · [Use Cases](../../../03-Use-Cases.md)

## Dependencies

TASK-01, PROJ-02.

## Scope

Triển khai task list, create, detail, update và My Tasks theo OpenAPI, với kiểm tra project membership và version.

## Out of Scope

Collaboration, AI và chức năng của các Sprint sau.

## Implementation Requirements

Bám [OpenAPI](../../../06-API-Specification.yaml) và [Database Design](../../../05-Database-Design.md). Tái sử dụng quyền theo workspace/project và giữ hành vi 404/403 theo SRS.

## Acceptance Criteria

Một cấp subtask, assignee hợp lệ, version conflict 409 và chỉ đọc khi project đã lưu trữ. My Tasks chỉ trả task của actor.

## Testing Requirements

Chạy kiểm thử liên quan trên môi trường test và ghi bằng chứng. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí và cập nhật báo cáo triển khai.

## Development Report Reference

Chưa triển khai.
