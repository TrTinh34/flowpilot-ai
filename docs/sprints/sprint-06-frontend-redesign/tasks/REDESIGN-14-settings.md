# REDESIGN-14 — Profile & Settings

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-14 |
| Task Name | Profile & Settings |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 4h |
| Dependencies | REDESIGN-04, REDESIGN-07 |
| Related Requirements | Profile · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Thông tin từ auth store, không update API.

## Existing UI Problems
Ảnh D lặp thông tin và placeholder action.

## Objective
Account settings rõ và có lối tới Workspace settings.

## Scope
Identity header, read-only fields, settings navigation.

## Out of Scope
Password, 2FA, avatar upload, edit profile.

## Proposed UI/UX Design
Reading width, sections Account / Workspace.

## Technical Design
Reuse auth query/store, giữ logout behavior.

## Component Requirements
Avatar, SectionHeader, read-only fields.

## Layout Requirements
Settings tối đa 760px.

## Responsive Requirements
390 single column và email wrap.

## Accessibility Requirements
Heading, links có tên, no tab stops giả.

## API Integration Requirements
GET /auth/me hỗ trợ read.

## Implementation Checklist
- [ ] Nhóm dữ liệu
- [ ] nav thật
- [ ] màn hẹp

## Expected Deliverables
Profile/Settings UI.

## Acceptance Criteria
Không hiện action edit giả, link Workspace Settings đúng, email không tràn.

## Testing Requirements
RTL auth states và mobile browser.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
