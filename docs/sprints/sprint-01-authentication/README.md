# Sprint 01 — Foundation + AUTH

## Sprint Information

- Sprint ID — Sprint 01
- Trạng thái — IN_PROGRESS
- Tiến độ — 12/13 Task `COMPLETED`, 1 `PARTIAL`
- Nguồn phạm vi — [Roadmap và US-AUTH-01](../../07-Backlog-Roadmap.md)

## Sprint Goal

Hoàn thành nền tảng monorepo, CI và luồng đăng ký, đăng nhập, refresh, logout của MVP.

## Scope

Foundation, migration Authentication, Auth APIs và tích hợp frontend. Workspace, Project và RBAC theo Roadmap của Sprint sau.

## Sprint Backlog

Bảng này quản lý trạng thái hiện tại của từng Task. Các ID AUTH-01 đến AUTH-07 và AUTH-INT-01 lấy từ báo cáo. AUTH-08 đến AUTH-12 là các mục kế hoạch trong danh sách Sprint hiện tại, tách từ phạm vi UI, tích hợp và review của US-AUTH-01. Roadmap hiện dùng ID ở cấp story cho phần này.

| Task ID | Task | Trạng thái | Dependencies |
|---|---|---|---|
| AUTH-01 | [Database Schema & Migration](tasks/AUTH-01-database-schema.md) | COMPLETED | Prisma/PostgreSQL nền tảng |
| AUTH-02 | [User Registration API](tasks/AUTH-02-user-registration.md) | COMPLETED | AUTH-01 |
| AUTH-03 | [User Login API](tasks/AUTH-03-user-login.md) | COMPLETED | AUTH-02, tích hợp cấp token từ AUTH-04 |
| AUTH-04 | [Access Token & Refresh Token Management](tasks/AUTH-04-token-management.md) | COMPLETED | AUTH-01, logic xác thực credentials từ AUTH-03 |
| AUTH-05 | [Logout & Token Revocation](tasks/AUTH-05-logout-token-revocation.md) | COMPLETED | AUTH-04 |
| AUTH-06 | [Authentication Middleware](tasks/AUTH-06-authentication-middleware.md) | COMPLETED | JWT verifier từ AUTH-04, route AUTH-07 |
| AUTH-07 | [Get Current User API](tasks/AUTH-07-get-current-user.md) | COMPLETED | AUTH-01, AUTH-06 và OpenAPI |
| AUTH-INT-01 | [Authentication Integration Testing](tasks/AUTH-INT-01-integration-testing.md) | COMPLETED | AUTH-02–07, PostgreSQL test riêng |
| AUTH-08 | [Authentication UI/UX Design](tasks/AUTH-08-ui-ux-design.md) | COMPLETED | FR-AUTH-01, UC-AUTH-01 và NFR-05 |
| AUTH-09 | [Login & Register Frontend](tasks/AUTH-09-login-register-frontend.md) | COMPLETED | AUTH-08, request schema từ AUTH-02 và AUTH-03 |
| AUTH-10 | [Authentication State & Protected Routes](tasks/AUTH-10-auth-state-protected-routes.md) | COMPLETED | AUTH-04, AUTH-05, hợp đồng Current User từ AUTH-07 khi cần lấy hồ sơ |
| AUTH-11 | [Frontend & Backend Integration](tasks/AUTH-11-frontend-backend-integration.md) | COMPLETED | AUTH-07, AUTH-09, AUTH-10 |
| AUTH-12 | [Testing & Code Review](tasks/AUTH-12-testing-code-review.md) | PARTIAL | Chờ kết quả GitHub Actions cho thay đổi AUTH-12 |

## Dependencies

PostgreSQL, Prisma migration và CI cho nền tảng. Frontend tích hợp dựa trên OpenAPI và cấu hình cookie/CORS trong [System Design](../../04-System-Design.md).

## Acceptance Criteria

- Đáp ứng exit criteria của [Roadmap](../../07-Backlog-Roadmap.md) và `FR-AUTH-01`, `UC-AUTH-01`.
- Xác nhận email duy nhất, login hợp lệ trả token, credentials sai trả 401, refresh rotation và logout thu hồi phiên.
- Hoàn tất các tiêu chí bắt buộc trong Task Specs, gồm luồng trình duyệt và kiểm chứng qua protected route.

## Definition of Done

Đối chiếu [Definition of Done trong Backlog](../../07-Backlog-Roadmap.md#definition-of-done). Với Sprint này, cần bằng chứng review migration, API contract, unit/integration tests, UI states, PR self-review và CI xanh. Xử lý lỗi critical/high trước nghiệm thu.

## Risks and Blockers

- AUTH-12 đã qua kiểm thử local, review và browser smoke. Nghiệm thu chờ GitHub Actions chạy trên revision có thay đổi CI.

## Sprint Review

Regression ghi nhận 89 test backend và 55 test frontend đạt. Browser smoke xác nhận Register, Login, Current User, khôi phục phiên trên hai tab và Logout. Review đã xử lý fallback route và các lỗi Prettier chặn CI. Xem [AUTH-12](../../reports/01-authentication/AUTH-12-testing-code-review.md).

## Sprint Retrospective

Giữ PostgreSQL thật và cùng nhóm kiểm tra ở local lẫn CI. Chạy kiểm tra format trước review để phát hiện sớm lỗi chặn workflow. Theo dõi kết quả workflow trên chính revision sẽ nghiệm thu Sprint.
