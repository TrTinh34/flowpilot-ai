# BOARD-01 — Board move API

## Thông tin Task

Sprint 03. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Board move API theo phạm vi Sprint 03.

## Related Requirements

[FR-TASK-01, FR-BOARD-01 và NFR-07](../../../02-SRS.md) · [Use Cases](../../../03-Use-Cases.md)

## Dependencies

TASK-01, TASK-02.

## Scope

Triển khai move bằng transaction và khóa dòng project theo Database Design.

## Out of Scope

Collaboration, AI và chức năng của các Sprint sau.

## Implementation Requirements

Bám [OpenAPI](../../../06-API-Specification.yaml) và [Database Design](../../../05-Database-Design.md). Tái sử dụng quyền theo workspace/project và giữ hành vi 404/403 theo SRS.

## Acceptance Criteria

Move cập nhật thứ tự nguyên tử. Hai request cùng version không ghi đè nhau. Kiểm tra chính sách Member chỉ di chuyển task được giao.

## Testing Requirements

Chạy kiểm thử liên quan trên môi trường test và ghi bằng chứng. Xem [Test Plan](../../../08-Test-Plan.md).

## Definition of Done

Kiểm chứng các tiêu chí và cập nhật báo cáo triển khai.

## Development Report Reference

[Development Report BOARD-01](../../../reports/03-task-board/BOARD-01-board-move-api.md)
