# REDESIGN-09 — My Tasks & Task Management

## 1. Thông tin Task

- Sprint 07 · Timebox B
- Ngày triển khai — 2026-11-28
- Trạng thái — COMPLETED
- Phạm vi — My Tasks và Project Tasks
- Nguồn bằng chứng — RTL, Edge và API local với PostgreSQL test

## 2. Tóm tắt triển khai

My Tasks và Project Tasks dùng chung danh sách, metadata và bộ lọc. Project Manager có thể mở dialog tạo task.

## 3. File thay đổi

- `frontend/src/features/task/components/MyTasks.tsx`
- `frontend/src/features/task/components/ProjectTasks.tsx`
- `frontend/src/features/task/components/TaskList.tsx`
- `frontend/src/features/task/components/TaskMetadata.tsx`
- `frontend/src/features/task/types/task.types.ts`
- `frontend/src/pages/task/MyTasksPage.tsx`
- `frontend/src/pages/task/ProjectTasksPage.tsx`
- `frontend/tests/integration/task-ui.test.tsx`

## 4. Quyết định kỹ thuật

Lọc title, status và priority trên trang API hiện tại. Giữ cache theo phiên, project và page. My Tasks liên kết lại project của task.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng | Kết quả |
|---|---|---|
| Frontend | `typecheck`, `lint`, `format`, `test` (88 test), `build` | PASSED |
| Backend | `npm --prefix backend run test:integration` (41 test) | PASSED |
| RTL | RTL kiểm tra loading, lỗi và Retry, danh sách rỗng, quyền và tạo task. | PASSED |
| Edge + PostgreSQL | My Tasks và Project Tasks tải dữ liệu từ PostgreSQL test. My Tasks vừa màn hình 360 px. | PASSED |
| Responsive | Root không tràn ngang ở 360, 390, 768, 1024, 1280, 1440 và 1920 px. | PASSED |

Ảnh dùng cùng dữ liệu test. Bản trước lấy source đã commit tại `a6c1d82`.

| Màn hình và chiều rộng | Trước | Sau |
|---|---|---|
| my-tasks-360 px | [Trước](evidence/redesign-09/before-my-tasks-360.png) | [Sau](evidence/redesign-09/after-my-tasks-360.png) |
| my-tasks-390 px | [Trước](evidence/redesign-09/before-my-tasks-390.png) | [Sau](evidence/redesign-09/after-my-tasks-390.png) |
| my-tasks-1440 px | [Trước](evidence/redesign-09/before-my-tasks-1440.png) | [Sau](evidence/redesign-09/after-my-tasks-1440.png) |
| project-tasks-390 px | [Trước](evidence/redesign-09/before-project-tasks-390.png) | [Sau](evidence/redesign-09/after-project-tasks-390.png) |
| project-tasks-1440 px | [Trước](evidence/redesign-09/before-project-tasks-1440.png) | [Sau](evidence/redesign-09/after-project-tasks-1440.png) |

## 6. Tiêu chí nghiệm thu

| Tiêu chí | Kết quả |
|---|---|
| API lỗi có Retry, empty có thông báo riêng, status/priority có nhãn và My Tasks vừa màn hình 360 px. | PASSED |
| Kiểm tra tương phản toàn màn hình, zoom 200% và reduced motion theo quality gates | NOT VERIFIED |

## 7. Vấn đề và blocker

Lint có hai cảnh báo Fast Refresh hiện hữu. Build báo chunk JS vượt 500 kB. Developer Review đang chờ.

## 8. Ghi chú cho developer

My Tasks mở từ sidebar. Project Tasks mở từ card project hoặc Project Settings. Bộ lọc áp dụng cho các kết quả đã tải.

## 9. Task tiếp theo

REDESIGN-10.
