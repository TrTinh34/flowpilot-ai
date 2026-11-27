# REDESIGN-16 — Frontend Integration & Visual QA

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-16 |
| Task Name | Frontend Integration & Visual QA |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P0 |
| Status | PENDING |
| Estimated Effort | 8h |
| Dependencies | REDESIGN-05–15, REFINE-07 |
| Related Requirements | Toàn app · [SRS](../../../02-SRS.md), [Design System V2](../../../design/frontend/design-system.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
CI unit/RTL sẵn có và baseline mới.

## Existing UI Problems
Build/lint không chứng minh render.

## Objective
Nghiệm thu toàn initiative.

## Scope
Regression, E2E, API/mocks, visual review và report.

## Out of Scope
Bổ sung backend features và push khi chưa được giao.

## Proposed UI/UX Design
So sánh baseline và bản mới theo route/state.

## Technical Design
Dùng browser automation hiện có, lưu evidence đã khử PII.

## Component Requirements
Regression mọi shared states.

## Layout Requirements
Compare screenshots góc rộng và hẹp.

## Responsive Requirements
Ít nhất 390/1440 mỗi screen, overview 1920.

## Accessibility Requirements
Manual keyboard + checks WCAG mục tiêu.

## API Integration Requirements
Real integrations/permissions preserved; demo on/off.

## Implementation Checklist
- [ ] Chạy checks
- [ ] smoke
- [ ] compare
- [ ] publish report

## Expected Deliverables
QA matrix, screenshots, sign-off.

## Acceptance Criteria
Mỗi screen (`REDESIGN-05..14` + `REFINE-03..06`) có before/after, states/error, kiểm tra Live vs Demo mode (production không lộ mock fixture ở Notifications/Dashboard/AI), zero lỗi P0/P1 mở, zero ESLint warnings, bundle check và pass CI nếu được giao.

## Testing Requirements
typecheck/lint/format/build/test, browser network/keyboard và route regression.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
Developer sign-off.
