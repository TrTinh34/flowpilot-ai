# REDESIGN-10 — Kanban Board & Task Details

## 1. Thông tin Task

- Sprint 07 · Timebox B
- Ngày triển khai — 2026-11-28
- Trạng thái — COMPLETED
- Phạm vi — Kanban và Task Detail
- Nguồn bằng chứng — RTL, Edge và API local với PostgreSQL test

## 2. Tóm tắt triển khai

Kanban cuộn ngang trong vùng board và phản hồi khi kéo thẻ qua đích. Task Detail hiển thị metadata ở cột riêng trên desktop, cùng các tab và subtasks.

## 3. File thay đổi

- `frontend/src/features/board/components/KanbanBoard.tsx`
- `frontend/src/features/board/components/KanbanCard.tsx`
- `frontend/src/features/task/components/TaskDetailDrawer.tsx`
- `frontend/src/pages/task/ProjectBoardPage.tsx`
- `frontend/tests/integration/kanban-board.test.tsx`

## 4. Quyết định kỹ thuật

Dùng native drag/drop và điều khiển bằng bàn phím. Giữ server ordering, `version`, quyền di chuyển và đồng bộ lại cache sau 409.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng | Kết quả |
|---|---|---|
| Frontend | `typecheck`, `lint`, `format`, `test` (88 test), `build` | PASSED |
| Backend | `npm --prefix backend run test:integration` (41 test) | PASSED |
| RTL | RTL kiểm tra kéo thả, phản hồi drop target, version/order sau conflict, role và subtasks. | PASSED |
| Edge + PostgreSQL | Bàn phím chuyển cột, khôi phục focus, gặp HTTP 409 do version cũ, tải lại và di chuyển thành công. Task Detail hiển thị subtask. | PASSED |
| Responsive | Root không tràn ngang ở 360, 390, 768, 1024, 1280, 1440 và 1920 px. | PASSED |

Ảnh dùng cùng dữ liệu test. Bản trước lấy source đã commit tại `a6c1d82`.

| Màn hình và chiều rộng | Trước | Sau |
|---|---|---|
| board-360 px | [Trước](evidence/redesign-10/before-board-360.png) | [Sau](evidence/redesign-10/after-board-360.png) |
| board-390 px | [Trước](evidence/redesign-10/before-board-390.png) | [Sau](evidence/redesign-10/after-board-390.png) |
| board-1440 px | [Trước](evidence/redesign-10/before-board-1440.png) | [Sau](evidence/redesign-10/after-board-1440.png) |
| task-detail-390 px | [Trước](evidence/redesign-10/before-task-detail-390.png) | [Sau](evidence/redesign-10/after-task-detail-390.png) |
| task-detail-1440 px | [Trước](evidence/redesign-10/before-task-detail-1440.png) | [Sau](evidence/redesign-10/after-task-detail-1440.png) |

## 6. Tiêu chí nghiệm thu

| Tiêu chí | Kết quả |
|---|---|
| Di chuyển giữ thứ tự server, 409 tải lại và cho phép thử lại, subtasks và điều khiển theo quyền vẫn hoạt động. | PASSED |
| Kiểm tra tương phản toàn màn hình, zoom 200% và reduced motion theo quality gates | NOT VERIFIED |

## 7. Vấn đề và blocker

Lint có hai cảnh báo Fast Refresh hiện hữu. Build báo chunk JS vượt 500 kB. Developer Review đang chờ. Native drag/drop được kiểm tra trong RTL. Edge dùng bàn phím với API thật.

## 8. Ghi chú cho developer

Dùng select có nhãn để đổi cột và các nút mũi tên để đổi vị trí trong cột. Task Detail mở từ thẻ hoặc hàng task.

## 9. Task tiếp theo

REDESIGN-06 — Dashboard, task còn lại của Sprint 07.
