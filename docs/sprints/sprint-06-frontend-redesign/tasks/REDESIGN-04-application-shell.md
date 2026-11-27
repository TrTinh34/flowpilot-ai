# REDESIGN-04 — Application Shell & Navigation

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-04 |
| Task Name | Application Shell & Navigation |
| Sprint ID | Sprint 06 · Timebox A |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 9h |
| Dependencies | REDESIGN-03 |
| Related Requirements | Protected shell · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Shell, workspace switcher, user menu và bell đang mount.

## Existing UI Problems
Header ít context, shell lồng main.

## Objective
Điều hướng nhất quán và dùng đủ chiều rộng.

## Scope
Sidebar, breadcrumb, rail, mobile drawer.

## Out of Scope
Global search, routes mới.

## Proposed UI/UX Design
Shell wireframe đã duyệt.

## Technical Design
Route-derived breadcrumb; Zustand chỉ lưu UI preference.

## Component Requirements
Sidebar, Header, WorkspaceSwitcher, Drawer.

## Layout Requirements
232–248px desktop, rail 60–64px.

## Responsive Requirements
Drawer dưới 1024; header không tràn tại 360.

## Accessibility Requirements
Skip link, aria-current, trap/restore focus.

## API Integration Requirements
Dùng workspace query/auth hiện hành, không tạo request trùng.

## Implementation Checklist
- [x] Map routes và breadcrumb
- [x] Thêm shell, desktop rail và drawer
- [x] Kiểm thử workspace switch, route history và focus

## Expected Deliverables
Shell và screenshots.

## Acceptance Criteria
Một main, keyboard drawer đóng đúng, route và back/forward giữ context.

## Testing Requirements
Router/RTL, browser 390/1440/1920.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

[Báo cáo REDESIGN-04](../../../reports/frontend-redesign/REDESIGN-04-application-shell.md).

## Next Task
REDESIGN-05.
