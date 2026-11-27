# REFINE-06 — Collaboration UI Refinement

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-06 |
| Task Name | Collaboration UI Refinement |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 4h |
| Dependencies | REFINE-04, REFINE-05B |
| Related Requirements | [Screen Specs §8](../../../design/frontend/screen-specifications.md), `REDESIGN-11` |

## Objective
Đồng bộ hoàn toàn `CommentSection` và `AttachmentUploader` với Design System V2 và các shared components (`Avatar`, `Textarea`, `FormErrorBanner`, `EmptyState`, `ErrorState`, semantic tokens).

## Scope
- **Comments (`CommentSection.tsx`):**
  - Thay inline avatar bằng shared `Avatar size="sm"`.
  - Thay `<textarea>` thô bằng shared `Textarea`; chuẩn hóa `rounded-[var(--radius-md)]`.
  - Thay `<p role="alert">` và `<p role="status">Comment posted.</p>` bằng `FormErrorBanner` và status notice banner chuẩn; dùng `EmptyState compact` khi chưa có bình luận.
  - Tinh chỉnh mention disclosure panel (`<details>`) với counter badge và spacing rõ ràng.
- **Attachments (`AttachmentUploader.tsx`):**
  - Thêm trạng thái `isDragging` cho vùng dropzone (`border-action bg-action/5`) khi kéo file vào.
  - Phân biệt icon cho file ảnh (`Image`) vs PDF (`FileText`), hiển thị kích thước `tabular-nums`, dùng `EmptyState compact` khi chưa có tệp.
  - Chuẩn hóa upload/download status feedback banner.
- **Activity Timeline:** Giữ ẩn/scope-out theo API readiness vì `GET /projects/:id/audit` chưa mount ở backend.

## Out of Scope
- Không thêm real-time WebSocket delivery hoặc thay đổi endpoint/storage S3.

## Acceptance Criteria
- Không còn inline avatar lặp, `<textarea>` thô hay `rounded-xl` trong module `collaboration`.
- Dropzone phản hồi trực quan khi drag-over; lỗi 413/422 và draft comment vẫn hoạt động đúng qua regression tests.

## Testing Requirements
- `collaboration-ui.test.tsx` (mention keyboard, giữ draft khi lỗi, 413/422 upload, archived read-only), browser `360/1440px`.
