# REDESIGN-09 — My Tasks & Task Management

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-09 |
| Task Name | My Tasks & Task Management |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P0 |
| Status | PENDING |
| Estimated Effort | 7h |
| Dependencies | REDESIGN-03, REDESIGN-08, ENV-01 |
| Related Requirements | My Tasks và Project Tasks · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Task list thật; local 500 đã tái hiện.

## Existing UI Problems
Metadata và pagination chưa rõ.

## Objective
Cho quét task nhanh và phân biệt lỗi/rỗng.

## Scope
Shared task rows, filter hỗ trợ, retry và create CTA trong project.

## Out of Scope
Backend fix ngoài ENV-01, search server mới, My Tasks create vô ngữ cảnh.

## Proposed UI/UX Design
Rows title, priority, status, deadline và linked context có dữ liệu.

## Technical Design
TanStack query theo session/project/page; không dùng fixture.

## Component Requirements
TaskRow, TaskFilters, state panels.

## Layout Requirements
Full workspace, header cùng Projects.

## Responsive Requirements
Stacked mobile rows, title không mất.

## Accessibility Requirements
Filter label, badge text, retry và aria-live.

## API Integration Requirements
Task API thật; 500 giữ error state.

## Implementation Checklist
- [ ] Map metadata
- [ ] thay list/state
- [ ] lỗi và regression

## Expected Deliverables
My Tasks/Project Tasks và screenshots.

## Acceptance Criteria
500 có Retry, empty khác error, status/priority có label; 360 không overflow.

## Testing Requirements
RTL 500→retry, success/empty và browser thật.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-10.
