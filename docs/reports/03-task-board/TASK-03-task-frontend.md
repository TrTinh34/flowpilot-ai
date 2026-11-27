# TASK-03 — Task detail, subtask và My Tasks UI

## 1. Thông tin Task

- Sprint — 03, Task & Board
- Ngày — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-TASK-01`, `UC-TASK-01`, `NFR-07`

## 2. Tóm tắt triển khai

Đã thêm ba route được bảo vệ cho Project Tasks, Task Detail và My Tasks. Người có quyền có thể tạo task, chỉnh sửa tiêu đề, mô tả, assignee, deadline, priority và tạo subtask cấp một. My Tasks lấy danh sách đã giao từ API.

## 3. File thay đổi

- `frontend/src/features/task/` — Task API, types, form, task links và detail.
- `frontend/src/pages/task/`, router, Project Settings và trang gốc — phân trang và điều hướng.
- `frontend/tests/integration/task-ui.test.tsx` — ca UI với API mock.
- Sprint Backlog, Task Spec, Reports Index và Product Backlog.

## 4. Quyết định kỹ thuật

UI dùng quyền và trạng thái project từ API. Form chỉnh sửa gửi version đang hiển thị. Khi nhận `TASK_VERSION_CONFLICT`, UI khóa lưu tới khi người dùng tải phiên bản mới. Ngày gửi theo `YYYY-MM-DD` và lấy phần ngày từ response để tránh lệch ngày do múi giờ. Query keys chứa session revision, và mutation thành công invalidates dữ liệu liên quan.

## 5. Kết quả kiểm chứng

| Check | Evidence | Status |
|---|---|---|
| Frontend regression | `npm test`, 63 test đạt, gồm 5 test Task UI | PASSED |
| Static checks | Frontend format, lint, typecheck và build | PASSED |
| Browser smoke với PostgreSQL | Thuộc tích hợp cuối Sprint, chưa chạy trong phiên TASK-03 | NOT RUN |

## 6. Acceptance Criteria

| Criterion | Status | Evidence |
|---|---|---|
| Tạo và xem task, thêm subtask | PASSED | UI test xác nhận payload tạo, điều hướng detail và parentId |
| Loading, empty và lỗi quyền | PASSED | Có trạng thái loading/empty/error. UI test kiểm tra empty và phản hồi 403. |
| My Tasks hiển thị task được giao | PASSED | UI test kiểm tra task link và phân trang khi API trả trang trống |
| Version conflict | PASSED | UI test xác nhận gửi version cũ, khóa lưu, reload và gửi version mới |

## 7. Vấn đề và blocker

Lint còn warning Fast Refresh trong Button và build còn warning bundle trên 500 kB. Chưa kiểm chứng browser với backend thật trong Task này.

## 8. Ghi chú cho developer

Mở Project Settings → Project tasks, hoặc Home → My Tasks. Review [Task API](../../../frontend/src/features/task/api/task.api.ts) và [Task Detail](../../../frontend/src/features/task/components/TaskDetailDrawer.tsx).

## 9. Task tiếp theo

[BOARD-02 — Kanban và điều khiển di chuyển](../../sprints/sprint-03-task-board/tasks/BOARD-02-board-frontend.md).
