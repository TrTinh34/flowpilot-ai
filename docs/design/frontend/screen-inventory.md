# Screen Inventory · Baseline redesign

Nguồn route: `frontend/src/app/router/AppRouter.tsx`. Danh sách dưới đây theo nhóm feature; xem [specs](screen-specifications.md) cho bố cục và [API matrix](api-readiness-matrix.md) cho mức readiness. Inventory Sprint 04 giữ làm lịch sử.

| Nhóm | Route / entry | Tình trạng |
|---|---|---|
| Auth | /login · /register | AuthLayout và form thật; phiên restore dùng ProtectedRoute |
| Dashboard | /dashboard | Fixture trực tiếp, card và activity chưa có dữ liệu thật |
| Workspace | /workspaces · /invitations/accept | Switcher và forms thật; layout chưa phân lớp |
| Projects | /workspaces/:workspaceId/projects · /projects/:projectId | Ảnh C; form inline, pagination khi trống |
| My Tasks và Project Tasks | /my-tasks · /projects/:projectId/tasks | Ảnh A; 500 local, rows thiếu hierarchy |
| Board | /projects/:projectId/board | Native drag/drop, fallback button và version contract đang chạy |
| Task Detail và Subtasks | /tasks/:taskId | Route thật, tabs; page thân rộng hẹp và form lẫn metadata |
| Collaboration | Task Detail · Comments, Attachments | API thật COL-04; timeline/audit chưa nối |
| Notifications | /notifications · Header bell | Ảnh B; fixtures và unread state tách |
| AI Planner | /ai/planner | Fixture generate/edit/confirm kiểu prototype |
| Profile và Settings | /settings/profile | Ảnh D; thông tin account lặp; không có API update |
| Route states | * · auth restore · resource 403/404 | NotFoundPage đã nối, ForbiddenPage có file nhưng không có /403 route |
