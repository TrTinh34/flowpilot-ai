# REDESIGN-06 — Dashboard

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-06 |
| Task Name | Dashboard |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-04 |
| Related Requirements | Dashboard · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Page đọc dashboard/activity fixtures trực tiếp.

## Existing UI Problems
KPI thiếu mode rõ và dễ lệch fixture.

## Objective
Tạo workspace overview đọc được nhanh.

## Scope
KPI, progress, due dates, quick links, Demo adapter.

## Out of Scope
Dashboard/audit backend và chart dependencies.

## Proposed UI/UX Design
Grid KPI 4/2/1, progress và activity theo ngữ cảnh.

## Technical Design
Derive KPI từ cùng dataset; production chỉ render khả năng thật.

## Component Requirements
StatCard, dashboard sections và shared states.

## Layout Requirements
Workspace-width, không card lồng.

## Responsive Requirements
Mobile single column, không page overflow.

## Accessibility Requirements
Chart có text/legend, focus theo hierarchy.

## API Integration Requirements
OpenAPI dashboard/audit chưa mount; demo dev-only.

## Implementation Checklist
- [ ] Tách adapter
- [ ] derive metrics
- [ ] verify mode

## Expected Deliverables
Dashboard và fixture tests.

## Acceptance Criteria
KPI khớp dữ liệu, CTA đúng đích, demo off không hiện số giả.

## Testing Requirements
RTL mode on/off và browser 390/1440.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
