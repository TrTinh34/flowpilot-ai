# REDESIGN-12 — Notification Center

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-12 |
| Task Name | Notification Center |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-04 |
| Related Requirements | Bell và Inbox · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Hai state fixture riêng.

## Existing UI Problems
Unread count và links thiếu nhất quán.

## Objective
Đồng bộ Inbox với Header.

## Scope
Shared data source, grouped inbox, demo mode và label.

## Out of Scope
Notification backend, WebSocket, link giả.

## Proposed UI/UX Design
Reading column, All/Unread, action theo khả năng.

## Technical Design
Demo store source duy nhất, adapter chỉ bật dev flag.

## Component Requirements
Bell, NotificationRow, tabs, EmptyState.

## Layout Requirements
Reading width ≤820px.

## Responsive Requirements
360 rows wrap và mark action có chỗ.

## Accessibility Requirements
Unread có label, bell accessible name.

## API Integration Requirements
Demo khi có flag; routes OpenAPI chưa mount.

## Implementation Checklist
- [ ] Tách fixtures
- [ ] đồng bộ actions
- [ ] test mode

## Expected Deliverables
Inbox/Bell dùng cùng state.

## Acceptance Criteria
Mark read ở bell cập nhật inbox ngay; demo off không có fixture.

## Testing Requirements
RTL grouped/read sync, browser keyboard.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
