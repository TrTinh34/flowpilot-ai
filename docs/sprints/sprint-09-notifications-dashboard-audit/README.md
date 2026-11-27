# Sprint 09 — Notifications, Dashboard & Audit Log

## Sprint Information

- Ngày mở — 2026-11-28
- Trạng thái — IN_PROGRESS
- Tiến độ — 4/7 task
- Nguồn — [US-NOTI-01](../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time) và [US-DASH-01](../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log) (tương ứng Sprint 4 trong bảng Roadmap gốc)

## Sprint Goal

Cung cấp thông báo trong ứng dụng + real-time qua Socket.IO (từ `outbox_events` có sẵn), API tổng hợp tiến độ Dashboard & Audit Log theo phân quyền, và nối giao diện frontend Sprint 08 với backend thật trên PostgreSQL.

## Scope

- **US-NOTI-01 (Notifications & Real-time)**: Schema & migration `notifications` (kế thừa `outbox_events` từ Sprint 05), module `backend/src/modules/notification/` theo Clean Architecture 4 tầng, worker `outbox.worker.ts`, Socket.IO server với JWT handshake + server-managed rooms (`user:{userId}`, `project:{projectId}`), và nối [NotificationBell.tsx](../../../frontend/src/features/notification/components/NotificationBell.tsx) + [NotificationsPage.tsx](../../../frontend/src/pages/notification/NotificationsPage.tsx) với API thật.
- **US-DASH-01 (Dashboard & Audit Log)**: Schema & migration `audit_logs`, module `backend/src/modules/audit/` & `backend/src/modules/dashboard/` theo Clean Architecture 4 tầng, ghi audit events cho nghiệp vụ cốt lõi, REST endpoints `GET /api/v1/projects/:projectId/dashboard` & `GET /api/v1/projects/:projectId/audit`, và nối Dashboard/Audit UI với dữ liệu thật.
- **Out of Scope**: `US-AI-01` (AI Planner Backend & Idempotent Confirm — Sprint tiếp theo) và Release E2E toàn hệ thống. Chế độ Demo ở frontend (`VITE_USE_MOCK_API=true` trong dev) chỉ giữ cho phần chưa có API thật (`AI Planner`) hoặc fallback dev khi được bật rõ ràng.

## Sprint Backlog

| Task ID | Task | Trạng thái | Dependencies |
|---|---|---|---|
| NOTI-01 | [Schema và migration Notifications](tasks/NOTI-01-notifications-schema.md) | COMPLETED | COL-01 (OutboxEvent) |
| NOTI-02 | [Notification REST API và Outbox Worker](tasks/NOTI-02-notification-api-outbox.md) | COMPLETED | NOTI-01, COL-02 |
| NOTI-03 | [Socket.IO Server và tích hợp Notification UI](tasks/NOTI-03-socket-realtime-frontend.md) | COMPLETED | NOTI-02, REDESIGN-12 |
| DASH-01 | [Audit Log Schema và Emission Ports](tasks/DASH-01-audit-schema-ports.md) | COMPLETED | WS-01, PROJ-01, TASK-01 |
| DASH-02 | [Dashboard Metrics và Audit Query API](tasks/DASH-02-dashboard-audit-api.md) | PENDING | DASH-01, TASK-02 |
| DASH-03 | [Tích hợp Dashboard Metrics và Audit Timeline UI](tasks/DASH-03-dashboard-audit-frontend.md) | PENDING | DASH-02, REDESIGN-06 |
| NOTI-DASH-INT-01 | [Kiểm thử tích hợp, Architecture Fitness và Sprint Review](tasks/NOTI-DASH-INT-01-integration-review.md) | PENDING | NOTI-03, DASH-03 |

## Dependencies

- Sprint 05 (`COL-01..04`, bảng `outbox_events`), Sprint 07 (`REDESIGN-05..10`) và Sprint 08 (`REDESIGN-11..16`, `REFINE-01..07`) đã `COMPLETED` và được Developer nghiệm thu.
- PostgreSQL local/test đang chạy và sẵn sàng áp dụng Prisma Migrate mới.
- Tuân thủ nghiêm [AGENTS.md](../../../AGENTS.md): Backend 4 tầng Clean Architecture (`domain/`, `application/`, `infrastructure/`, `presentation/`) + Architecture Fitness Tests (`npm --prefix backend run test:architecture`).

## Acceptance Criteria

- **US-NOTI-01**: Reconnect tải lại thông báo chưa đọc; chỉ người nhận mới đọc hoặc đánh dấu đã đọc (`404`/`403` khi truy cập ngoài phạm vi); Socket.IO xác thực JWT khi handshake và cô lập room `user:{userId}` / `project:{projectId}`.
- **US-DASH-01**: Số task hoàn thành và chỉ số tiến độ khớp dữ liệu DB; project rỗng trả số `0`; endpoint `/projects/:projectId/audit` chỉ cho phép `OWNER` / `ADMIN` / `MANAGER` trong phạm vi (trả `403` cho `MEMBER` thường, `404` ngoài workspace).
- **Frontend & Quality**: Giữ nguyên Design System V2, không hồi quy các màn đã refine, `backend` (`typecheck`, `test:architecture`, unit/integration trên PostgreSQL test) và `frontend` (`typecheck`, `lint`, `format`, `test`, `build`) đều xanh.

## Definition of Done

Theo [Product Backlog](../../07-Backlog-Roadmap.md#definition-of-done): migrations đã review (`backend/prisma/migrations/`), Clean Architecture dependency rules pass, unit tests với fake Ports, integration tests trên PostgreSQL test DB (Supertest + Socket.IO client), RTL tests, OpenAPI contract đồng bộ, Development Report cho từng Task và GitHub Actions / Developer Review.

## Risks and Blockers

- **Clean Architecture refactoring**: Các thư mục `backend/src/modules/{notification,dashboard,audit}/` hiện chỉ là placeholder phẳng từ scaffolding cũ; cần tổ chức lại đúng 4 tầng `domain/`, `application/`, `infrastructure/`, `presentation/` + `<module>.module.ts` và không deep-import vào nội bộ module khác.
- **OpenAPI `mark-all-read`**: [API Readiness Matrix](../../design/frontend/api-readiness-matrix.md) ghi nhận `POST/PATCH /notifications/read-all` cần đồng bộ contract trong [OpenAPI Spec](../../06-API-Specification.yaml) trước khi nối nút "Mark all read" thật trên UI.

## Sprint Review

Ghi sau khi nghiệm thu `NOTI-DASH-INT-01`.

## Sprint Retrospective

Ghi sau khi đóng Sprint 09.
