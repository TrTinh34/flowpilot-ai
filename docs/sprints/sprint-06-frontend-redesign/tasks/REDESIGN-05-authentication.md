# REDESIGN-05 — Authentication Pages

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-05 |
| Task Name | Authentication Pages |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 5h |
| Dependencies | REDESIGN-04 |
| Related Requirements | Auth · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
AuthLayout/LoginForm/RegisterForm thật.

## Existing UI Problems
Hierarchy và states chưa cùng shell theme.

## Objective
Giữ brand và form auth dễ đọc.

## Scope
Layout, labels, validation, visibility, feedback.

## Out of Scope
Auth security và API changes.

## Proposed UI/UX Design
Form 420px, brand panel desktop, mobile một cột.

## Technical Design
Giữ RHF/Zod và auth store/session flow.

## Component Requirements
AuthLayout, password toggle, FormField.

## Layout Requirements
Full viewport kể cả khi validation dài.

## Responsive Requirements
360/390 và 1440, input không cắt.

## Accessibility Requirements
Autocomplete, label toggle, focus lỗi đầu.

## API Integration Requirements
Auth luôn thật.

## Implementation Checklist
- [x] Điều chỉnh layout
- [x] Xác minh states và focus
- [x] Chạy frontend regression, PostgreSQL và Edge

## Expected Deliverables
Auth UI và before/after.

## Acceptance Criteria
Login/Register hoàn thành 360px; API error hiển thị; refresh/logout giữ kết quả cũ.

## Testing Requirements
Auth regression và browser keyboard.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

[Báo cáo REDESIGN-05](../../../reports/frontend-redesign/REDESIGN-05-authentication.md).

## Next Task
REDESIGN-07.
