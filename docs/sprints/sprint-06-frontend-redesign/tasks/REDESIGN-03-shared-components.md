# REDESIGN-03 — Shared UI Components

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-03 |
| Task Name | Shared UI Components |
| Sprint ID | Sprint 06 · Timebox A |
| Priority | P0 |
| Status | PENDING |
| Estimated Effort | 8h |
| Dependencies | REDESIGN-02 |
| Related Requirements | Shared components · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
CVA button, Input, Label, Card, Tabs đã có.

## Existing UI Problems
Control và page states lặp.

## Objective
Tạo shared primitives dùng ngay trong các màn.

## Scope
PageHeader, state panels, pager, field labels, Dialog, badges.

## Out of Scope
Data grid hoặc primitive chưa có caller.

## Proposed UI/UX Design
Variants dùng cùng hệ spacing và role.

## Technical Design
Dùng Radix/Tailwind và giữ props tương thích.

## Component Requirements
Theo Component Inventory, ưu tiên caller thực.

## Layout Requirements
Slots actions wrap, cards không nested vô lý.

## Responsive Requirements
State panels và dialog vừa 360px.

## Accessibility Requirements
Accessible names, Escape, focus restore, live region.

## API Integration Requirements
Components chỉ nhận props/status.

## Implementation Checklist
- [ ] Rà callers
- [ ] bổ sung variants/states
- [ ] RTL

## Expected Deliverables
Primitives và ví dụ thật.

## Acceptance Criteria
Pending khóa double submit; lỗi và empty có role/action riêng; keyboard dialog đạt.

## Testing Requirements
RTL render/interaction/error, keyboard, lint/build.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-04.
