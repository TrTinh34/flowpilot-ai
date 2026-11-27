# REDESIGN-10 — Kanban Board & Task Details

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-10 |
| Task Name | Kanban Board & Task Details |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 8h |
| Dependencies | REDESIGN-09 |
| Related Requirements | Board và Task Detail · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Drag native, select/button fallback, version và subtasks thật.

## Existing UI Problems
Feedback drag và hierarchy detail còn cơ bản.

## Objective
Dùng chung task presentation và giữ concurrency.

## Scope
Board cards, drop feedback, detail metadata/subtasks.

## Out of Scope
Thay drag lib, đổi version hoặc route.

## Proposed UI/UX Design
Columns/count, desktop detail rail, mobile stack.

## Technical Design
Giữ vị trí, version và 409 handling, reuse task types.

## Component Requirements
KanbanCard/Board, StatusBadge, Detail layout.

## Layout Requirements
Board scroll nội bộ; detail hai vùng.

## Responsive Requirements
360 board horizontally contained.

## Accessibility Requirements
Move bằng keyboard và focus hợp lý.

## API Integration Requirements
PATCH move thật, 409 tải lại; preserve access.

## Implementation Checklist
- [x] Style cards
- [x] feedback
- [x] detail
- [x] conflict smoke

## Expected Deliverables
Board và Detail UI.

## Acceptance Criteria
Move keyboard/drag giữ thứ tự server; 409 reconcile, subtask không mất.

## Testing Requirements
RTL/a11y và browser board.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

[Báo cáo triển khai](../../../reports/frontend-redesign/REDESIGN-10-kanban.md).

## Next Task
REDESIGN-11.
