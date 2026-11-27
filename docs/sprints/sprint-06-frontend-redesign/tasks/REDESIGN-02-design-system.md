# REDESIGN-02 — Design System & Theme Enhancement

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-02 |
| Task Name | Design System & Theme Enhancement |
| Sprint ID | Sprint 06 · Timebox A |
| Priority | P0 |
| Status | PENDING |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-01 |
| Related Requirements | Theme · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
CSS variables và Tailwind theme hiện có.

## Existing UI Problems
Semantic và utility colors không thống nhất.

## Objective
Áp dụng tokens đã duyệt.

## Scope
Colors, typography, spacing, focus, reduced motion.

## Out of Scope
Dark theme mới và dependency.

## Proposed UI/UX Design
Token preview trên các variants có thật.

## Technical Design
Map CSS variables vào @theme, giữ alias cần cho callers.

## Component Requirements
Button/Input/Card/Tabs sample.

## Layout Requirements
Gutter 16/24/32.

## Responsive Requirements
360–1920, kiểm tra text zoom.

## Accessibility Requirements
Đo contrast từng foreground/background và focus.

## API Integration Requirements
Không gọi API.

## Implementation Checklist
- [ ] Kiểm kê alias
- [ ] thêm tokens
- [ ] so sánh before/after

## Expected Deliverables
CSS và bảng mapping.

## Acceptance Criteria
Chữ thường ≥4.5:1, controls ≥3:1, không hardcode mới ngoài theme.

## Testing Requirements
typecheck, lint, format, test, build; ghi contrast.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-03.
