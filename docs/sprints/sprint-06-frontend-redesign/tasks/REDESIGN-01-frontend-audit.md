# REDESIGN-01 — Frontend Audit & UI/UX Direction

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-01 |
| Task Name | Frontend Audit & UI/UX Direction |
| Sprint ID | Sprint 06 · Timebox A |
| Priority | P0 |
| Status | IN_REVIEW |
| Estimated Effort | 6h |
| Dependencies | Sprint 04–05 |
| Related Requirements | Toàn app · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Ảnh A–D, source, inventory và ma trận đã đối chiếu.

## Existing UI Problems
Widths, shell, mock boundaries và My Tasks 500.

## Objective
Duyệt direction trước khi thiết kế thực thi.

## Scope
Audit, tokens đề xuất, wireframes và baseline.

## Out of Scope
Triển khai UI và chỉnh database.

## Proposed UI/UX Design
Duyệt 4 điểm ở Visual Direction; bổ sung baseline 390/1440 nếu có phiên test.

## Technical Design
Đối chiếu source và screenshot; ghi bằng chứng độc lập cho mỗi lỗi.

## Component Requirements
Inventory, audit, screen specs.

## Layout Requirements
Đối chiếu full workspace và reading width.

## Responsive Requirements
Review shell ở 390/1440.

## Accessibility Requirements
Review focus, contrast và motion.

## API Integration Requirements
Giữ API thật; xác nhận mode bằng route mounts.

## Implementation Checklist
- [ ] Đối chiếu ảnh
- [ ] rà route
- [ ] chốt direction với developer

## Expected Deliverables
Audit và quyết định duyệt.

## Acceptance Criteria
Có 4 ảnh tham chiếu, mapping toàn route và quyết định duyệt palette/shell/layout/demo được ghi.

## Testing Requirements
Review docs, contrast và HTTP probe.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-02.
