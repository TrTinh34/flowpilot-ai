# API Readiness Matrix · Baseline redesign

API paths tương đối với `/api/v1`. Hợp đồng [OpenAPI](../../06-API-Specification.yaml), xác minh mount trong `backend/src/routes/index.ts` và callers trong `frontend/src/features/*/api`. Real ở đây nghĩa là có route + call site, không hàm ý mọi môi trường đã được migrate.

| Feature / màn | Hợp đồng | Backend / frontend | Mode và khoảng thiếu |
|---|---|---|---|
| Auth / Login, Register, Profile | POST /auth/register, /auth/login, /auth/refresh, /auth/logout; GET /auth/me | Mounted Auth, auth.api và session restore | Real; Profile chỉ đọc |
| Workspace / Settings, Invitation | /workspaces, /workspaces/:id/members, /workspaces/:id/invitations, /invitations/accept | Mounted Workspace/Invitation; workspace.api | Real; role mutation theo backend |
| Projects / List & Settings | /workspaces/:id/projects, /projects/:id, /projects/:id/members | Mounted Project; project.api | Real; không có progress aggregation ở list contract |
| Task / List, My Tasks, Detail | /projects/:id/tasks, /me/tasks, /tasks/:id | Mounted Task; task.api | Real; ENV-01 đã khôi phục schema và xác minh My Tasks trả 200 trên dev local |
| Board | PATCH /tasks/:id/move + project tasks list | Mounted Task; board.api | Real; 409 reconcile và keyboard fallback |
| Collaboration | GET/POST /tasks/:id/comments; GET/POST /tasks/:id/attachments; GET /attachments/:id/download | Mounted Collaboration; collaboration.api | Real; upload/download cần S3, mention outbox đã có, delivery chưa có |
| Dashboard / Activity | GET /projects/:projectId/dashboard và /projects/:projectId/audit | Có OpenAPI, chưa mount Dashboard/Audit; page đọc fixtures | Demo có chủ đích; audit timeline thật chờ endpoint |
| Notifications / Bell, Inbox | GET /notifications, PATCH /notifications/:notificationId/read; mark-all cần contract | Có OpenAPI một phần, chưa mount; hai fixture stores riêng | Demo; cập nhật unread cùng nguồn, không mở task ID giả |
| AI Planner | POST /projects/:projectId/ai/plans, GET /ai/plans/:planId, POST /ai/plans/:planId/confirm | Có OpenAPI, chưa mount; page đọc fixture | Demo; confirm không ghi task thật |

Đề xuất adapter feature tham chiếu flag dev `VITE_USE_MOCK_API` và loại demo khỏi production runtime. Real auth/workspace/project/task/board/collaboration luôn dùng API thật. Lỗi thật hiển thị error, retry có ngữ nghĩa; không fallback Demo. Fixtures tham chiếu các ID dùng chung trong demo, giữ nhất quán badge/metrics và test cả mode on/off. Không thêm API trong redesign.
