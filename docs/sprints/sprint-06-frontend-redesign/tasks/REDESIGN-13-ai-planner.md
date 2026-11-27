# REDESIGN-13 — AI Planner

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-13 |
| Task Name | AI Planner |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 7h |
| Dependencies | REDESIGN-04 |
| Related Requirements | AI Planner · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Prototype generate/edit/confirm đã có.

## Existing UI Problems
Form và xử lý trạng thái chưa thành workflow rõ.

## Objective
Định hình AI workflow dễ theo dõi.

## Scope
Brief, examples, progress, draft, confirm và retry demo.

## Out of Scope
AI backend và task thật từ fixture.

## Proposed UI/UX Design
Progress steps và violet accent theo token.

## Technical Design
Demo adapter giữ draft, reducer/state machine đơn giản nếu cần.

## Component Requirements
Brief, StepIndicator, DraftEditor, ConfirmDialog.

## Layout Requirements
Preview/brief chia pane desktop.

## Responsive Requirements
Mobile một cột, button wrap.

## Accessibility Requirements
Keyboard edit, status live, dialog focus.

## API Integration Requirements
Contract chưa mount; demo dev-only, không gửi confirm backend.

## Implementation Checklist
- [ ] Map steps
- [ ] tách adapter
- [ ] test fallback/error

## Expected Deliverables
AI prototype và trạng thái mode.

## Acceptance Criteria
Đủ 4 bước bằng bàn phím, lỗi giữ draft, confirm demo không ghi task.

## Testing Requirements
RTL workflow/errors/mode và browser 390/1440.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
