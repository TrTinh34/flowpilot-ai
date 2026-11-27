# REDESIGN-11 — Collaboration & Activity

## 1. Thông tin Task

- Sprint 08 · Timebox C
- Ngày triển khai — 2026-11-28
- Trạng thái — COMPLETED
- Yêu cầu — Comments và Attachments trong Task Detail

## 2. Tóm tắt triển khai

Thread hiển thị avatar chữ cái, tác giả và thời gian. Composer có nhóm checkbox chọn người nhận mention bằng bàn phím, bộ đếm và giữ draft khi gửi lỗi. Danh sách tệp hiển thị tên, kích thước và ngày tải lên. Tên tệp dài xuống dòng trên mobile.

## 3. File thay đổi

- `frontend/src/features/collaboration/components/CommentSection.tsx` — Thread, composer, mention và trạng thái tải.
- `frontend/src/features/collaboration/components/AttachmentUploader.tsx` — Upload panel, hàng tệp, trạng thái và Retry tải danh sách.
- `frontend/tests/integration/collaboration-ui.test.tsx` — Kiểm thử bàn phím và lỗi upload 413/422.

## 4. Quyết định kỹ thuật

Giữ API, query keys và cơ chế phân trang. Mention tiếp tục gửi `mentionIds`; upload gửi `FormData`; download dùng URL do API cấp. Khóa đồng bộ khi post/upload đang chạy để tránh gửi lặp. Project archive vẫn cho đọc thread và tải tệp theo quyền hiện có. Activity phụ thuộc endpoint audit.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Frontend | PASSED · 93 test, lint, format và production build kèm TypeScript |
| Backend integration | PASSED · 41 test PostgreSQL, gồm lỗi 413/422 và cấp URL tải xuống |
| Edge + PostgreSQL + fake storage | PASSED · gửi mention, tải lên, tải xuống đúng nội dung và project archive chỉ đọc |
| Layout | PASSED · 360–1920 px, kiểm tra tên tệp dài |

| Màn hình | Trước | Sau |
|---|---|---|
| Comments | [390 px](evidence/redesign-11/before-comments-390.png) · [1440 px](evidence/redesign-11/before-comments-1440.png) | [390 px](evidence/redesign-11/after-comments-390.png) · [1440 px](evidence/redesign-11/after-comments-1440.png) |
| Attachments | [390 px](evidence/redesign-11/before-attachments-390.png) · [1440 px](evidence/redesign-11/before-attachments-1440.png) | [390 px](evidence/redesign-11/after-attachments-390.png) · [1440 px](evidence/redesign-11/after-attachments-1440.png) |

## 6. Tiêu chí nghiệm thu

| Tiêu chí | Kết quả |
|---|---|
| Mention có thể chọn bằng bàn phím, giữ draft khi post lỗi | PASSED |
| Upload phản hồi đúng lỗi 413/422, tải lại danh sách sau thành công | PASSED |
| Download và archived read-only | PASSED |
| Tương phản toàn màn hình, zoom 200% và reduced motion | NOT VERIFIED |

## 7. Vấn đề và blocker

Smoke test dùng fake storage. S3 triển khai chưa được kiểm chứng. Lint còn hai cảnh báo Fast Refresh hiện hữu. Build báo chunk vượt 500 kB.

## 8. Ghi chú cho developer

Mở Comments hoặc Attachments từ Task Detail. Dùng Enter để mở nhóm mention và Space để chọn người nhận.

## 9. Task tiếp theo

REDESIGN-12 — Notification Center, sau Developer Review.
