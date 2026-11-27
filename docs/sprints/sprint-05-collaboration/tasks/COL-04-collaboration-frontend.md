# COL-04 — Tích hợp giao diện Collaboration

## Thông tin Task

Sprint 05. Xem trạng thái tại [Sprint Backlog](../README.md#sprint-backlog).

## Objective

Nối Task Detail với Comment và Attachment API.

## Related Requirements

[FR-COL-01](../../../02-SRS.md) · [UC-COL-01](../../../03-Use-Cases.md)

## Dependencies

COL-02, COL-03, UI-05.

## Scope

Danh sách bình luận, mention, tải lên và tải xuống.

## Out of Scope

Notification inbox và real-time.

## Implementation Requirements

Dùng TanStack Query, API client hiện có và điều khiển có nhãn. Tham chiếu [Database Design](../../../05-Database-Design.md) và [OpenAPI](../../../06-API-Specification.yaml).

## Acceptance Criteria

Người dùng thao tác được bằng bàn phím và thấy phản hồi khi tải, thành công hoặc lỗi.

## Testing Requirements

Vitest, RTL, lint, typecheck và build.

## Definition of Done

Kiểm chứng tiêu chí nghiệm thu và cập nhật báo cáo triển khai.

## Development Report Reference

[Báo cáo COL-04](../../../reports/05-collaboration/COL-04-collaboration-frontend.md).
