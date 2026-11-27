# Báo cáo triển khai FlowPilot AI

Thư mục này lưu kết quả triển khai, quyết định kỹ thuật và bằng chứng kiểm chứng để tiếp tục công việc giữa các phiên. Phạm vi và thứ tự triển khai lấy từ [Product Backlog & Roadmap](../07-Backlog-Roadmap.md).

## Quy ước

- Dùng [REPORT-TEMPLATE.md](REPORT-TEMPLATE.md). Mỗi Task có một báo cáo chính.
- Trạng thái hiện tại của Task trong Sprint nằm tại [Sprint Index](../sprints/README.md). Cột trạng thái bên dưới phản ánh kết quả ghi nhận trong báo cáo.
- Gom báo cáo theo thư mục `NN-chu-de`. Dùng `TASK-ID-ten-task.md` nếu đã có Task ID, `ten-giai-doan.md` cho các báo cáo nền tảng khôi phục từ repo.
- `COMPLETED` nghĩa là phạm vi của Task đã hoàn thành. `PARTIAL` nghĩa là còn phần việc chưa hoàn thành. `BLOCKED` nghĩa là có trở ngại ngăn việc tiếp tục.
- Ghi nguồn và loại báo cáo. Dùng `NOT VERIFIED` khi có ghi nhận nhưng thiếu bằng chứng xác minh, và `UNKNOWN` khi không có thông tin.
- Trong bảng Changed Files, ghi đường dẫn từ repository root. Liên kết Markdown dùng đường dẫn tương đối từ file chứa liên kết.

## Danh sách báo cáo

| Task ID | Task Name | Status | Report |
|---|---|---|---|
| — | Project Scaffolding | COMPLETED | [Báo cáo](00-initialization/project-scaffolding.md) |
| — | Project Initialization | COMPLETED | [Báo cáo](00-initialization/project-initialization.md) |
| — | DBCode PostgreSQL trong Antigravity | PARTIAL | [Báo cáo](00-initialization/dbcode-antigravity.md) |
| — | Sprint and Task Management Structure | COMPLETED | [Báo cáo](00-initialization/sprint-task-management.md) |
| AUTH-01 | Authentication Database Schema & Migration | COMPLETED | [Báo cáo](01-authentication/AUTH-01-database-schema.md) |
| AUTH-02 | User Registration API | COMPLETED | [Báo cáo](01-authentication/AUTH-02-user-registration.md) |
| AUTH-03 | User Login API | COMPLETED | [Báo cáo](01-authentication/AUTH-03-user-login.md) |
| AUTH-04 | Access Token & Refresh Token Management | COMPLETED | [Báo cáo](01-authentication/AUTH-04-token-management.md) |
| AUTH-05 | Logout & Token Revocation | COMPLETED | [Báo cáo](01-authentication/AUTH-05-logout-token-revocation.md) |
| AUTH-06 | Authentication Middleware | COMPLETED | [Báo cáo](01-authentication/AUTH-06-authentication-middleware.md) |
| AUTH-07 | Get Current User API | COMPLETED | [Báo cáo](01-authentication/AUTH-07-get-current-user.md) |
| AUTH-08 | Authentication UI/UX Design & Global Design Foundation | COMPLETED | [Báo cáo](01-authentication/AUTH-08-ui-ux-design.md) |
| AUTH-09 | Login & Register Frontend | COMPLETED | [Báo cáo](01-authentication/AUTH-09-login-register-frontend.md) |
| AUTH-10 | Authentication State & Protected Routes | COMPLETED | [Báo cáo](01-authentication/AUTH-10-auth-state-protected-routes.md) |
| AUTH-11 | Frontend & Backend Integration | COMPLETED | [Báo cáo](01-authentication/AUTH-11-frontend-backend-integration.md) |
| AUTH-12 | Testing & Code Review | COMPLETED | [Báo cáo](01-authentication/AUTH-12-testing-code-review.md) |
| AUTH-INT-01 | Authentication Integration Testing | COMPLETED | [Báo cáo](01-authentication/AUTH-INT-01-integration-testing.md) |
| WS-01 | Workspace schema và migration | COMPLETED | [Báo cáo](02-workspace-project/WS-01-workspace-database.md) |
| WS-02 | Workspace API và RBAC | COMPLETED | [Báo cáo](02-workspace-project/WS-02-workspace-membership.md) |
| WS-03 | Mời và chấp nhận thành viên | COMPLETED | [Báo cáo](02-workspace-project/WS-03-workspace-invitations.md) |
| WS-04 | Workspace và invitation UI | COMPLETED | [Báo cáo](02-workspace-project/WS-04-workspace-frontend.md) |
| PROJ-01 | Project schema và migration | COMPLETED | [Báo cáo](02-workspace-project/PROJ-01-project-database.md) |
| PROJ-02 | Project API và phân quyền tài nguyên | COMPLETED | [Báo cáo](02-workspace-project/PROJ-02-project-api-authorization.md) |
| PROJ-03 | Project list và settings UI | COMPLETED | [Báo cáo](02-workspace-project/PROJ-03-project-frontend.md) |
| WS-PROJ-INT-01 | Workspace & Project integration và review | COMPLETED | [Báo cáo](02-workspace-project/WS-PROJ-INT-01-integration-review.md) |
| TASK-01 | Task schema và migration | COMPLETED | [Báo cáo](03-task-board/TASK-01-task-database.md) |
| ARCH-01 | Migrate Backend Auth to Feature-based Clean Architecture | COMPLETED | [Báo cáo](architecture/clean-architecture-refactoring.md) |
| TASK-02 | Task và My Tasks API | COMPLETED | [Báo cáo](03-task-board/TASK-02-task-api.md) |
| BOARD-01 | Board move API | COMPLETED | [Báo cáo](03-task-board/BOARD-01-board-move-api.md) |
| TASK-03 | Task detail, subtask và My Tasks UI | COMPLETED | [Báo cáo](03-task-board/TASK-03-task-frontend.md) |
| BOARD-02 | Kanban và điều khiển di chuyển | COMPLETED | [Báo cáo](03-task-board/BOARD-02-board-frontend.md) |
| UI-01 | Application Shell và Navigation | COMPLETED | [Báo cáo](frontend/UI-01-application-shell.md) |
| UI-02 | Shared UI Component Library | COMPLETED | [Báo cáo](frontend/UI-02-shared-components.md) |
| UI-03 | Dashboard UI | COMPLETED | [Báo cáo](frontend/UI-03-dashboard-ui.md) |
| UI-04 | Notification Center UI | COMPLETED | [Báo cáo](frontend/UI-04-notification-ui.md) |
| UI-05 | Collaboration UI | COMPLETED | [Báo cáo](frontend/UI-05-collaboration-ui.md) |
| UI-06 | AI Planner UI | COMPLETED | [Báo cáo](frontend/UI-06-ai-planner-ui.md) |
| UI-07 | Settings & Profile UI | COMPLETED | [Báo cáo](frontend/UI-07-settings-profile-ui.md) |
| UI-08 | Design System Consistency Pass | COMPLETED | [Báo cáo](frontend/UI-08-design-system-pass.md) |
| UI-09 | Frontend Foundation Testing & Review | COMPLETED | [Báo cáo](frontend/UI-09-testing-review.md) |
| TASK-BOARD-INT-01 | Task & Board integration và review | COMPLETED | [Báo cáo](03-task-board/TASK-BOARD-INT-01-integration-review.md) |
| COL-01 | Schema và migration Collaboration | COMPLETED | [Báo cáo](05-collaboration/COL-01-collaboration-schema.md) |
| COL-02 | Comment API và mention | COMPLETED | [Báo cáo](05-collaboration/COL-02-comment-api.md) |
| COL-03 | Attachment API và lưu trữ | COMPLETED | [Báo cáo](05-collaboration/COL-03-attachment-api.md) |
| COL-04 | Tích hợp giao diện Collaboration | COMPLETED | [Báo cáo](05-collaboration/COL-04-collaboration-frontend.md) |
| COL-INT-01 | Kiểm thử tích hợp và Sprint Review | COMPLETED | [Báo cáo](05-collaboration/COL-INT-01-integration-review.md) |
| NOTI-01 | Schema và migration Notifications | COMPLETED | [Báo cáo](06-notifications-dashboard/NOTI-01-notifications-schema.md) |
| NOTI-02 | Notification REST API và Outbox Worker | COMPLETED | [Báo cáo](06-notifications-dashboard/NOTI-02-notification-api-outbox.md) |
| NOTI-03 | Socket.IO Server Real-time và tích hợp Notification UI | COMPLETED | [Báo cáo](06-notifications-dashboard/NOTI-03-socket-realtime-frontend.md) |
| DASH-01 | Audit Log Schema và Emission Ports | COMPLETED | [Báo cáo](06-notifications-dashboard/DASH-01-audit-schema-ports.md) |

`AUTH-01` là Task ID của hạng mục database thuộc story `US-AUTH-01`.

## Tiến độ theo Sprint

Xem [biên bản mở Sprint 02](02-workspace-project/sprint-02-kickoff.md) cho phạm vi và dependencies đã đối chiếu.

| Giai đoạn | Tiến độ |
|---|---|
| Nền tảng | Scaffolding và Initialization đã hoàn thành theo README và hiện trạng repo |
| Sprint 1 — Foundation + AUTH | Hoàn thành 13/13 Task. Regression, PostgreSQL integration, browser smoke và GitHub Actions đều đạt. |
| Sprint 2 — Workspace & Project | Hoàn thành 8/8 Task. PostgreSQL regression, browser smoke và GitHub Actions đều đạt. |
| Sprint 3 — Task & Board | Hoàn thành 7/7 Task. Regression PostgreSQL, smoke test Edge và GitHub Actions đều đạt. |
| Sprint 4 — Frontend Foundation Planning | Sprint planning hoàn thành. 9 Task specs tạo, Screen Inventory, API Readiness Matrix và Navigation Map. |
| Sprint 4 — Frontend Foundation Implementation | 9/9 Tasks COMPLETED. AppShell, Dashboard, Notifications, Collaboration, AI Planner, Settings, 69 tests pass. |
| Sprint 5 — Collaboration | Hoàn thành 5/5 task. PostgreSQL, fake storage, Edge và GitHub Actions đều đạt. |
| Sprint 6 — Frontend Redesign Planning | Audit, direction và task specs chờ developer review. [Báo cáo planning](frontend-redesign/sprint-planning-report.md) |
| Sprint 6 — Frontend Redesign Implementation | Timebox A đạt 5/5 task. [REDESIGN-02 — Design System](frontend-redesign/REDESIGN-02-design-system.md) · [REDESIGN-03 — Shared UI](frontend-redesign/REDESIGN-03-shared-components.md) · [ENV-01 — My Tasks](frontend-redesign/ENV-01-my-tasks-local-schema.md) · [REDESIGN-04 — Shell](frontend-redesign/REDESIGN-04-application-shell.md) |
| Sprint 7 — Frontend Redesign Core flows | COMPLETED (Timebox B đạt 6/6 task, đã nghiệm thu): [REDESIGN-05 — Auth](frontend-redesign/REDESIGN-05-authentication.md) · [REDESIGN-06 — Dashboard](frontend-redesign/REDESIGN-06-dashboard.md) · [REDESIGN-07 — Workspace](frontend-redesign/REDESIGN-07-workspace.md) · [REDESIGN-08](frontend-redesign/REDESIGN-08-projects.md) · [REDESIGN-09](frontend-redesign/REDESIGN-09-task-management.md) · [REDESIGN-10](frontend-redesign/REDESIGN-10-kanban.md) |
| Sprint 8 — Frontend Redesign Collaboration & Quality | COMPLETED (Timebox C 6/6 & Timebox R 8/8, đã nghiệm thu): [REDESIGN-11](frontend-redesign/REDESIGN-11-collaboration.md) · [REDESIGN-12](frontend-redesign/REDESIGN-12-notifications.md) · [REDESIGN-13](frontend-redesign/REDESIGN-13-ai-planner.md) · [REDESIGN-14](frontend-redesign/REDESIGN-14-settings.md) · [REDESIGN-15](frontend-redesign/REDESIGN-15-responsive-accessibility.md) · [REDESIGN-16](frontend-redesign/REDESIGN-16-visual-qa.md) · [Re-audit](frontend-redesign/frontend-reaudit-report.md) · [Refinement Planning](frontend-redesign/refinement-planning-report.md) · [REFINE-03..06](frontend-redesign/REFINE-03-to-06-implementation.md) · [REFINE-07](frontend-redesign/REFINE-07-regression-visual-qa.md) |
| Sprint 9 — Notifications, Dashboard & Audit Log | Đang triển khai (`IN_PROGRESS`, 4/7 task): [Sprint 09 Backlog](../sprints/sprint-09-notifications-dashboard-audit/README.md) · [NOTI-01](06-notifications-dashboard/NOTI-01-notifications-schema.md) · [NOTI-02](06-notifications-dashboard/NOTI-02-notification-api-outbox.md) · [NOTI-03](06-notifications-dashboard/NOTI-03-socket-realtime-frontend.md) · [DASH-01](06-notifications-dashboard/DASH-01-audit-schema-ports.md) |
