# Sprint 02 — Workspace & Project

## Sprint Information

- Sprint ID — Sprint 02
- Ngày mở — 2026-11-26
- Trạng thái — COMPLETED
- Tiến độ — 8/8 Task hoàn thành
- Nguồn — [Product Backlog & Roadmap](../../07-Backlog-Roadmap.md)

## Sprint Goal

Cho phép người dùng đã xác thực tạo workspace, mời thành viên và quản lý project trong đúng phạm vi quyền.

## Scope

`US-WS-01` và `US-PROJ-01` gồm schema, migration, API, RBAC, tenant isolation, UI và kiểm thử. Task, assignment và Board thuộc Sprint 03.

## Sprint Backlog

Các Task ID bên dưới được mở khi phân rã hai story hiện có.

| Task ID | Task | Trạng thái | Dependencies |
|---|---|---|---|
| WS-01 | [Workspace schema và migration](tasks/WS-01-workspace-database.md) | COMPLETED | AUTH-01 |
| WS-02 | [Workspace API và RBAC](tasks/WS-02-workspace-membership.md) | COMPLETED | WS-01, AUTH-06 |
| WS-03 | [Mời và chấp nhận thành viên](tasks/WS-03-workspace-invitations.md) | COMPLETED | WS-01, WS-02 |
| WS-04 | [Workspace và invitation UI](tasks/WS-04-workspace-frontend.md) | COMPLETED | WS-02, WS-03, AUTH-11 |
| PROJ-01 | [Project schema và migration](tasks/PROJ-01-project-database.md) | COMPLETED | WS-01 |
| PROJ-02 | [Project API và phân quyền tài nguyên](tasks/PROJ-02-project-api-authorization.md) | COMPLETED | WS-02, PROJ-01, AUTH-06 |
| PROJ-03 | [Project list và settings UI](tasks/PROJ-03-project-frontend.md) | COMPLETED | WS-04, PROJ-02 |
| WS-PROJ-INT-01 | [Workspace & Project integration và review](tasks/WS-PROJ-INT-01-integration-review.md) | COMPLETED | Regression, browser smoke và GitHub Actions đạt |

## Dependencies

- [Sprint 01](../sprint-01-authentication/README.md) đã nghiệm thu 13/13 Task. Sprint 02 tái sử dụng Bearer middleware, User schema và phiên frontend.
- Schema Workspace đi trước Workspace API và Project schema. Invitation và Project API phụ thuộc kiểm tra workspace membership.
- Integration cần PostgreSQL test riêng và hợp đồng trong [OpenAPI](../../06-API-Specification.yaml).

## Acceptance Criteria

- Migration Workspace, Membership, Invitation và Project được review và kiểm chứng.
- Lời mời hết hạn sau 48 giờ, được chấp nhận một lần bởi tài khoản khớp email. Owner cuối vẫn được bảo vệ.
- Project thuộc đúng workspace. Project lưu trữ chỉ đọc. Kiểm tra DB membership và vai trò cho tài nguyên thuộc phạm vi Sprint.
- Integration test xác nhận 404 ngoài tenant, 403 khi thiếu quyền trong tenant, và UI smoke kiểm chứng luồng Workspace & Project.

## Definition of Done

Theo [Definition of Done của Backlog](../../07-Backlog-Roadmap.md#definition-of-done). Cần migration được review, contract khớp implementation, integration và browser evidence, self-review và GitHub Actions xanh.

## Risks and Blockers

- PROJ-01 đã tách migration `projects` khỏi bảng `tasks`. Task schema vẫn thuộc Sprint 03.
- Acceptance của `US-PROJ-01` và `TC-PROJ-01` có bước Manager tạo task. Sprint 02 kiểm chứng quyền và API Project. Bước tạo task thực tế dùng để kiểm chứng liên Sprint khi Task API đã có.
- Môi trường production cần adapter gửi email thật để phát lời mời.

## Sprint Review

Đã nghiệm thu 8/8 Task. Supertest/PostgreSQL xác nhận tenant isolation, phân quyền, chấp nhận lời mời một lần, bảo vệ Owner cuối và Project archive. Edge đã qua luồng Workspace → lời mời → Project. Backend Checks và Frontend Checks đều đạt trên commit `2da836e`. Xem [báo cáo tích hợp](../../reports/02-workspace-project/WS-PROJ-INT-01-integration-review.md) và [GitHub Actions](https://github.com/TrTinh34/flowpilot-ai/actions/runs/45853025353).

## Sprint Retrospective

Browser smoke phát hiện đường dẫn lời mời bị mất khi đăng nhập. Đã sửa và kiểm chứng lại. Giữ browser smoke cùng PostgreSQL test cho các thay đổi qua cả frontend và backend.
