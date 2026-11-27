# REDESIGN-15 — Responsive Design & Accessibility

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-15 |
| Task Name | Responsive Design & Accessibility |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 7h |
| Dependencies | REDESIGN-05–14, REFINE-07 |
| Related Requirements | Toàn app · [SRS](../../../02-SRS.md), [Design System V2](../../../design/frontend/design-system.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Chưa có chứng cứ đủ viewport/a11y.

## Existing UI Problems
Potential overflow, focus/trap và contrast chưa đo.

## Objective
Xác minh và xử lý lỗi cross-screen.

## Scope
Viewport matrix, keyboard reflow, contrast và reduced motion.

## Out of Scope
Chứng nhận WCAG toàn sản phẩm.

## Proposed UI/UX Design
Cùng hierarchy ở mobile, scroll nội bộ khi cần.

## Technical Design
Đo computed styles/scrollWidth, kiểm tra semantics và screenshot.

## Component Requirements
Rà các primitives và route states.

## Layout Requirements
Đo shell, overlays, list và board.

## Responsive Requirements
360/390/768/1024/1280/1440/1920.

## Accessibility Requirements
WCAG 2.2 AA target (bao gồm mục tiêu `ui-ux-pro-max` CRITICAL/HIGH): contrast `>= 4.5:1` text / `>= 3:1` UI controls cho cả Light & Dark, focus-not-obscured (`scroll-padding-top`), keyboard-only navigation, dialog focus trap/return, 200% zoom, `prefers-reduced-motion`, không dùng emoji làm icon.

## API Integration Requirements
Verify states real/demo bằng fixtures/test env.

## Implementation Checklist
- [x] Capture
- [x] audit
- [x] fix
- [x] retest

## Expected Deliverables
Checklist và screenshots.

## Acceptance Criteria
Document không tràn, focus không bị che, mọi flow chính có keyboard route.

## Testing Requirements
Browser, automated scan khi có và manual keyboard.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
