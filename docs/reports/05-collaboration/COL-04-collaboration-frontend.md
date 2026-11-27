# COL-04 — Tích hợp giao diện Collaboration

## 1. Thông tin Task

- Sprint 05 · 2026-11-27 · COMPLETED
- FR-COL-01, UC-COL-01
- Bằng chứng từ frontend regression và Edge smoke với API, PostgreSQL test và fake storage.

## 2. Tóm tắt triển khai

Task Detail đọc bình luận và metadata tệp qua API thật. Thành viên có quyền có thể đăng bình luận, chọn người được mention, tải lên và tải xuống tệp.

## 3. File thay đổi

- `frontend/src/features/collaboration/api/collaboration.api.ts` nối list, post, multipart upload và signed download.
- `frontend/src/features/collaboration/components/` hiển thị danh sách phân trang, biểu mẫu và phản hồi trạng thái.
- `frontend/src/features/task/components/TaskDetailDrawer.tsx` truyền task, danh sách thành viên và trạng thái project.
- `frontend/tests/integration/collaboration-ui.test.tsx` kiểm thử render, tương tác và lỗi.

## 4. Quyết định kỹ thuật

- TanStack Query phân biệt cache theo task và phiên đăng nhập. Mutation làm mới danh sách sau khi ghi.
- Dùng điều khiển HTML có nhãn cho nội dung, mention và file picker. Drag and drop dùng cùng kiểm tra phía client.
- Project đã lưu trữ cho đọc và tải xuống. Ẩn điều khiển tạo bình luận và upload.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Frontend regression | PASSED · 74 test, gồm 5 test Collaboration |
| Chất lượng frontend | PASSED · typecheck, lint, format, build. Hai cảnh báo Fast Refresh và cảnh báo bundle có sẵn |
| Edge + backend + PostgreSQL | PASSED · đăng nhập Member, gửi comment và mention, multipart upload, tải xuống đúng byte, đọc lịch sử sau khi archive |

## 6. Acceptance Criteria

| Tiêu chí | Bằng chứng |
|---|---|
| Thao tác Collaboration từ Task Detail | PASSED · Edge dùng API thật và fake storage |
| Điều khiển có nhãn, phản hồi thành công và lỗi | PASSED · Vitest/RTL kiểm tra gửi bình luận, giữ draft khi lỗi, upload và lỗi tải xuống |
| Tuân theo trạng thái project | PASSED · test read-only và Edge sau khi project chuyển archived |

## 7. Vấn đề và blocker

Edge smoke dùng fake storage. Tải lên hoặc cấp URL trong môi trường triển khai cần cấu hình S3.

## 8. Ghi chú cho developer

Mở Task Detail và chọn tab Comments hoặc Attachments. Tên người được mention lấy từ Project Members.

## 9. Task tiếp theo

COL-INT-01 — Kiểm thử tích hợp và Sprint Review.
