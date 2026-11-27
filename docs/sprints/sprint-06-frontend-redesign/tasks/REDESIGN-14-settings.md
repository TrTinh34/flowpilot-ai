# REDESIGN-14 — Profile & Settings

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-14 |
| Task Name | Profile & Settings |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | PENDING |
| Estimated Effort | 4h |
| Dependencies | REDESIGN-04, REDESIGN-07, REFINE-03, REFINE-04 |
| Related Requirements | Profile · [SRS](../../../02-SRS.md), [Design System V2](../../../design/frontend/design-system.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

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
PageHeader, Avatar (`size="lg"`), Card (`rounded-[var(--radius-md)] border-border`), read-only `<dl>` account fields, link tới Workspace Settings (`/workspaces`).

## Layout Requirements
Settings tối đa 760px, tuân thủ Design System V2 (xóa inline avatar tự chế, `rounded-xl`, và các đoạn text hứa hẹn tính năng tương lai).

## Responsive Requirements
390/360 single column và email wrap (`[overflow-wrap:anywhere]`).

## Accessibility Requirements
Heading một cấp `<h1>`, links có accessible name, no tab stops giả.

## API Integration Requirements
GET /auth/me hỗ trợ read.

## Implementation Checklist
- [ ] Bỏ thông tin lặp và bỏ text hứa hẹn tính năng chưa có
- [ ] Áp Design System V2 (`PageHeader`, `Avatar`, `Card`)
- [ ] Thêm link điều hướng Workspace Settings thật và test màn hẹp 360px

## Expected Deliverables
Profile/Settings UI theo Design System V2.

## Acceptance Criteria
Không hiện action edit giả hay lời hứa tính năng, link Workspace Settings đúng, email không tràn ở 360px, không lặp dữ liệu tên/email 2 lần.

## Testing Requirements
RTL auth states và mobile browser.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
