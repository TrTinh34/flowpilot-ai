# WS-04 — Workspace và invitation UI

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED

## 2. Tóm tắt triển khai

Đã nối tạo và chuyển workspace, xem thành viên, đổi role, remove/leave, transfer, mời và chấp nhận lời mời. Thêm GET directory theo workspace vào OpenAPI để UI lấy display name và role của thành viên đã được xác thực trong đúng workspace. Login giữ fragment lời mời và quay lại đúng trang.

## 3. File thay đổi

- `backend/src/modules/workspace/workspace.controller.ts`
- `backend/src/modules/workspace/workspace.repository.ts`
- `backend/src/modules/workspace/workspace.routes.ts`
- `backend/src/modules/workspace/workspace.service.ts`
- `backend/tests/integration/workspace-membership.postgres.test.ts`
- `docs/06-API-Specification.yaml`
- `frontend/src/app/router/AppRouter.tsx`
- `frontend/src/app/router/ProtectedRoute.tsx`
- `frontend/src/features/workspace/api/workspace.api.ts`
- `frontend/src/pages/InitStatusPage.tsx`
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/pages/workspace/`
- `frontend/tests/integration/workspace-ui.test.tsx`
- Sprint Backlog, Roadmap và Reports Index

## 4. Quyết định kỹ thuật

Xem phạm vi và quyết định trong đặc tả WS-04 và phần tóm tắt.

## 5. Kết quả kiểm chứng

57 frontend test đạt trước chỉnh redirect. Sau chỉnh redirect, 13 test Workspace/guard đạt. Typecheck, lint và build frontend đạt. PostgreSQL test xác nhận member directory và 404 ngoài tenant. Edge headless xác nhận tạo workspace, mời, Login qua link và chấp nhận membership.

## 6. Acceptance Criteria

Đã đối chiếu các tiêu chí của [Task Spec](../../sprints/sprint-02-workspace-project/tasks/WS-04-workspace-frontend.md) với kết quả kiểm thử.

## 7. Vấn đề và blocker

Xem giới hạn môi trường hoặc phạm vi được ghi trong phần tóm tắt.

## 8. Ghi chú cho developer

Tra cứu các file thay đổi ở mục 3.

## 9. Task tiếp theo

Theo [Sprint Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog).
