# BOARD-02 — Kanban và điều khiển di chuyển

## 1. Thông tin Task

- Sprint 03 · 2026-11-27 · COMPLETED
- FR-TASK-01, FR-BOARD-01, NFR-07
- Báo cáo triển khai dựa trên source code và kết quả chạy test tại workspace.

## 2. Tóm tắt triển khai

Project Tasks có liên kết mở Kanban với bốn cột trạng thái. Người có quyền có thể kéo thả hoặc dùng hộp chọn cột và nút lên/xuống. Khi gặp HTTP 409, board tải dữ liệu hiện tại và thông báo để người dùng kiểm tra trước khi di chuyển lại.

## 3. File thay đổi

| Đường dẫn | Thay đổi |
|---|---|
| `frontend/src/app/router/AppRouter.tsx`, `frontend/src/pages/task/` | Route Kanban, liên kết điều hướng, query và xử lý lỗi |
| `frontend/src/features/board/`, `frontend/src/features/task/api/task.api.ts` | Cột, thẻ, điều khiển và tải danh sách qua các trang API |
| `backend/src/modules/task/infrastructure/repositories/prisma-task.repository.ts` | Dùng ID làm tiêu chí cuối khi sắp xếp để ổn định phân trang |
| `frontend/tests/integration/kanban-board.test.tsx`, `frontend/vitest.config.ts` | Bật kiểm thử Kanban trong bộ test frontend |

## 4. Quyết định kỹ thuật

- Dùng HTML Drag and Drop và điều khiển HTML cho bàn phím và chạm, không thêm thư viện.
- Lấy thứ tự và version từ server sau mỗi lần di chuyển thành công hoặc xung đột.
- Dùng quyền quản lý project và assignee hiện tại để hiển thị điều khiển. Project đã lưu trữ chỉ hiển thị dữ liệu.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| `npm --prefix frontend test` | PASSED · 68 test, gồm 5 test Kanban |
| `npm --prefix frontend run lint` | PASSED · một cảnh báo Fast Refresh tại `button.tsx` |
| `npm --prefix frontend run build` | PASSED · gồm typecheck, Vite cảnh báo chunk lớn hơn 500 kB |
| `npm --prefix backend run test:architecture` | PASSED · 5 test |
| `npm --prefix backend run test:integration` | PASSED · 38 test PostgreSQL |

## 6. Acceptance Criteria

| Tiêu chí | Trạng thái | Bằng chứng |
|---|---|---|
| Di chuyển bằng chuột | PASSED | Test phát sự kiện drag/drop và kiểm tra vị trí gửi API |
| Di chuyển bằng điều khiển thay thế | PASSED | Test chọn cột, thao tác nút và quyền theo assignee/project |
| Hiển thị theo thứ tự server | PASSED | Test kiểm tra trạng thái mới sau tải lại |
| Tải lại khi 409 | PASSED | Test xác nhận thao tác sau dùng version mới |

## 7. Vấn đề và blocker

Browser smoke với frontend và backend chạy cùng nhau chưa được kiểm chứng trong task này. Test frontend dùng jsdom và API mock.

## 8. Ghi chú cho developer

Mở Project Tasks → Kanban board. Thả lên thẻ để chèn trước thẻ đó hoặc thả vào phần trống của cột để chuyển xuống cuối. Các nút lên/xuống đổi thứ tự trong cùng cột.

## 9. Task tiếp theo

TASK-BOARD-INT-01 — kiểm thử tích hợp Task & Board và Sprint Review.
