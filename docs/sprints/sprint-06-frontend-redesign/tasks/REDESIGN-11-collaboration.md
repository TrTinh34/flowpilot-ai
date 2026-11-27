# REDESIGN-11 — Collaboration & Activity

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-11 |
| Task Name | Collaboration & Activity |
| Sprint ID | [Sprint 08 · Timebox C](../../sprint-08-frontend-collaboration-quality/README.md) |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-10, COL-04 |
| Related Requirements | Comments/Attachments · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
API thật, activity chưa nối.

## Existing UI Problems
Composer và tệp chưa cùng ngôn ngữ thị giác.

## Objective
Collaboration rõ tác giả và feedback.

## Scope
Thread, mention, attachment states, timestamp.

## Out of Scope
Real-time, activity/audit backend.

## Proposed UI/UX Design
Thread với metadata và composer, danh sách file rõ trạng thái.

## Technical Design
Giữ query keys, FormData, URL signed; avoid duplicate requests.

## Component Requirements
Avatar, CommentRow, AttachmentRow, UploadState.

## Layout Requirements
Trong tab Task Detail.

## Responsive Requirements
360 composer và file name wrap.

## Accessibility Requirements
Mention keyboard, live status, file picker label.

## API Integration Requirements
Real COL; activity ẩn đến khi có contract; S3 cấu hình môi trường.

## Implementation Checklist
- [x] Áp tokens
- [x] Review states
- [x] Test upload/download

## Expected Deliverables
Collaboration group và screenshots.

## Acceptance Criteria
Mention, 413/422, download và archived read-only qua regression.

## Testing Requirements
RTL errors và Edge fake storage.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-12 theo Sprint 08. REDESIGN-16 tổng hợp kiểm chứng Visual QA. [Báo cáo triển khai](../../../reports/frontend-redesign/REDESIGN-11-collaboration.md)
