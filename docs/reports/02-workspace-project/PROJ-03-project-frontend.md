# PROJ-03 — Project list và settings UI

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED

## 2. Tóm tắt triển khai

Đã nối danh sách project theo workspace, chọn Manager khi tạo, chỉnh sửa, thêm thành viên và archive. Giao diện đọc quyền do API trả về và hiển thị archived ở chế độ chỉ đọc.

## 3. File thay đổi

- `frontend/src/app/router/AppRouter.tsx`
- `frontend/src/features/project/api/project.api.ts`
- `frontend/src/pages/project/`
- `frontend/src/pages/workspace/WorkspaceSettingsPage.tsx`
- `frontend/tests/integration/project-ui.test.tsx`
- Sprint Backlog, Roadmap và Reports Index

## 4. Quyết định kỹ thuật

Xem phạm vi và quyết định trong đặc tả PROJ-03 và phần tóm tắt.

## 5. Kết quả kiểm chứng

58 frontend test đạt. Format, lint, typecheck và build frontend đạt, với cảnh báo Fast Refresh và bundle đã có. Edge headless xác nhận tạo project, chỉ định Manager, thêm thành viên và archive.

## 6. Acceptance Criteria

Đã đối chiếu các tiêu chí của [Task Spec](../../sprints/sprint-02-workspace-project/tasks/PROJ-03-project-frontend.md) với kết quả kiểm thử.

## 7. Vấn đề và blocker

Xem giới hạn môi trường hoặc phạm vi được ghi trong phần tóm tắt.

## 8. Ghi chú cho developer

Tra cứu các file thay đổi ở mục 3.

## 9. Task tiếp theo

Theo [Sprint Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog).
