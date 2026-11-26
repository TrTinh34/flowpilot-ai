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

`AUTH-01` là Task ID của hạng mục database thuộc story `US-AUTH-01`.

## Tiến độ theo Sprint

Xem [biên bản mở Sprint 02](02-workspace-project/sprint-02-kickoff.md) cho phạm vi và dependencies đã đối chiếu.

| Giai đoạn | Tiến độ |
|---|---|
| Nền tảng | Scaffolding và Initialization đã hoàn thành theo README và hiện trạng repo |
| Sprint 1 — Foundation + AUTH | Hoàn thành 13/13 Task. Regression, PostgreSQL integration, browser smoke và GitHub Actions đều đạt. |
| Sprint 2 — Workspace & Project | WS-01 và WS-02 đã qua PostgreSQL test. |
