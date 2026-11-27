# REDESIGN-03 — Shared UI Components

## 1. Thông tin Task

- Sprint 06 · Timebox A · 2026-11-27 · COMPLETED
- Baseline `284a51f`. Phạm vi shared UI và caller hiện có.

## 2. Tóm tắt

Projects, My Tasks và Project Tasks dùng chung PageHeader, loading skeleton, empty/error state và phân trang. Projects dùng dialog cho tạo mới và badge cho trạng thái. FieldLabel liên kết trường nhập với nhãn trong Create Project và Task Form.

## 3. File thay đổi

- `frontend/src/components/common/` chứa header, page states và pagination.
- `frontend/src/components/ui/` chứa Dialog, FieldLabel và Badge.
- `frontend/src/features/project/components/CreateProjectDialog.tsx` giữ draft và trạng thái submit.
- `frontend/src/pages/` lắp ghép vào Projects, My Tasks và Project Tasks.
- `frontend/tests/integration/shared-components.test.tsx` kiểm tra caller thật qua API mocks.

## 4. Quyết định kỹ thuật

Dùng Radix Dialog cho modal, focus trap và focus restore. Busy khóa đóng dialog và submit lặp. Pagination nhận page và hasNext từ caller, tránh suy diễn tổng số trang khi API thiếu total. Query state và API nằm ngoài shared UI.

## 5. Kết quả kiểm chứng

Typecheck, lint, format, build và 78 test frontend đều đạt. 4 ca mới kiểm tra Projects và My Tasks. Lint có hai cảnh báo Fast Refresh hiện có. Vite báo bundle vượt 500 kB.

Edge chạy Projects trước và sau tại 1440 px với cùng fixture dữ liệu. Dialog ở 360 px có lề 16 px hai bên, document width bằng viewport. Khi mở, focus vào Project name. Escape đóng và trả focus về Create project.

[Projects trước](evidence/redesign-03/before-projects-1440.png) · [Projects sau](evidence/redesign-03/after-projects-1440.png) · [Create Project ở 360 px](evidence/redesign-03/after-project-dialog-360.png)

## 6. Acceptance Criteria

- Projects và task lists render loading, empty và error thành trạng thái riêng. Retry gọi lại query gốc.
- Create Project mở bằng bàn phím, giữ focus trong modal và trả focus khi đóng. API lỗi giữ form draft. Submit lặp trong lúc pending bị chặn.
- Quyền tạo project tiếp tục dựa trên role hiện có. Badge chứa chữ Active hoặc Archived.

## 7. Vấn đề và blocker

Browser smoke dùng fixture. Lỗi schema local của My Tasks theo ENV-01. Shared error state hiển thị và cho phép thử lại request thật.

## 8. Ghi chú cho developer

[Component Inventory](../../design/frontend/component-inventory.md) ghi props, caller và quy ước dùng lại.

## 9. Task tiếp theo

REDESIGN-04 — Application Shell & Navigation.
