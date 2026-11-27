# REDESIGN-07 — Workspace & Member Management

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-07 |
| Task Name | Workspace & Member Management |
| Sprint ID | Sprint 07 · Timebox B |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-04 |
| Related Requirements | Workspace/Invitations · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Workspace settings và invitation API thật.

## Existing UI Problems
Forms inline, role và permission states yếu.

## Objective
Cho quản lý workspace theo role hiệu quả.

## Scope
Create/invite dialog, sections members/settings và status.

## Out of Scope
Vai trò, permission và API mới.

## Proposed UI/UX Design
Avatar, role badge, create/invite đúng quyền.

## Technical Design
Tách composition feature tương ứng, invalidate keys hữu quan.

## Component Requirements
Workspace header, MemberRow, InviteDialog.

## Layout Requirements
Workspace-width, profile-like settings sections.

## Responsive Requirements
Rows đổi thành stacked tại mobile.

## Accessibility Requirements
Focus restore, confirm action destructive.

## API Integration Requirements
Dùng Workspace/Invitation APIs và server role.

## Implementation Checklist
- [ ] Map current actions
- [ ] component
- [ ] verify Owner/Member

## Expected Deliverables
Workspace UI và invite regression.

## Acceptance Criteria
Owner và Member khác quyền; expired notice rõ; CTA chỉ khi hợp lệ.

## Testing Requirements
RTL role, API error và browser invite.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-08.
