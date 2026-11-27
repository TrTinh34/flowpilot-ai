# REDESIGN-08 — Project Management

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-08 |
| Task Name | Project Management |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 7h |
| Dependencies | REDESIGN-07 |
| Related Requirements | Projects · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
List và settings thật, inline form.

## Existing UI Problems
Ảnh C cho thấy form và empty lệch hierarchy.

## Objective
Tạo project dễ tìm và dùng đủ width.

## Scope
PageHeader, create dialog, list/grid, role/manage states.

## Out of Scope
Aggregation mới và search toàn workspace khi thiếu API.

## Proposed UI/UX Design
Title/actions, rows/cards, permission-aware empty CTA.

## Technical Design
Giữ managerId, filter page data phải ghi rõ; refresh query sau create.

## Component Requirements
ProjectCard/Row, CreateProjectDialog, EmptyState.

## Layout Requirements
Workspace full width; responsive grid.

## Responsive Requirements
390 một cột; 1920 tránh khoảng trống bất thường.

## Accessibility Requirements
Dialog focus, manager label, role/status text.

## API Integration Requirements
Project API thật; trường thiếu chỉ hiện khi có dữ liệu.

## Implementation Checklist
- [ ] Giữ field
- [ ] đổi dialog
- [ ] role/state test

## Expected Deliverables
Projects/settings UI.

## Acceptance Criteria
Create 201 cập nhật list, error giữ draft, page trống không có nút Next vô ích.

## Testing Requirements
RTL success/error và browse owner/member.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-09.
