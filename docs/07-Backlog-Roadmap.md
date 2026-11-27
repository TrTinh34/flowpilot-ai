# Product Backlog & Roadmap
**v0.1 | Draft**
12 tuần giả định 15–20 giờ/tuần; điều chỉnh theo velocity thực tế. Mỗi sprint 2 tuần, có demo và test. GitHub Projects: Backlog → Ready → In Progress → Review → Done.
| Sprint | Goal | Exit criteria |
|---|---|---|
| 1 | Foundation + AUTH | Khởi tạo monorepo (React/Vite + Node.js/Express/TS), GitHub Actions CI, Prisma Migrate (`users`, `refresh_tokens`), login/register/refresh/logout |
| 2 | WS + PROJ | Prisma Migrate (`workspaces`, `invitations`, `projects`), invite, Express RBAC/tenant isolation middleware, Supertest tests |
| 3 | TASK + BOARD | Task detail, assignment, optimistic locking (`version`) & Prisma transaction board move, dnd-kit drag/drop, conflict handling |
| 4 | COL + NOTI + DASH | Comment, S3 file upload validation, Socket.IO auth/rooms + outbox inbox, Recharts dashboard, audit |
| 5 | AI | AI Provider Abstraction SDK, Zod structured output, async worker (`ai_plans`), preview/edit/confirm; fake provider tests |
| 6 | Release | Regression, security tests, Playwright E2E, Express `/health` & Pino logging check, staging, production, demo |

## Backlog

### US-AUTH-01 — Đăng ký, đăng nhập, refresh, logout
- Epic: AUTH; priority: Must; FR-AUTH-01 / UC-AUTH-01.
- Story: Là Guest / User, tôi muốn đăng ký, đăng nhập, refresh, logout để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Đăng nhập đúng trả token; sai trả 401; Email duy nhất; refresh token xoay vòng và thu hồi.
- Tiến độ và dependencies của từng Task được quản lý tại [Sprint 01 Backlog](sprints/sprint-01-authentication/README.md#sprint-backlog).
- Sprint 01 đã nghiệm thu. AUTH-12 đạt regression, browser smoke, code review và GitHub Actions.
- Tasks: Khởi tạo Express.js + TS + Pino/Helmet/CORS/rate-limit; Prisma schema & Prisma Migrate (`users`, `refresh_tokens` + custom SQL `LOWER(email)` unique); auth service (`bcrypt`, JWT, refresh rotation/reuse detection) & Zod schemas; UI form (React Hook Form + Zod); integration test (Vitest + Supertest + PostgreSQL test DB), review.

### US-WS-01 — Tạo workspace, mời và quản lý thành viên

- Tiến độ Workspace và Project theo [Sprint 02 Backlog](sprints/sprint-02-workspace-project/README.md#sprint-backlog).
- WS-04 đã hoàn thành. Xem [báo cáo](reports/02-workspace-project/WS-04-workspace-frontend.md).
- WS-03 đã hoàn thành. Xem [báo cáo](reports/02-workspace-project/WS-03-workspace-invitations.md).
- WS-01 đã hoàn thành schema và kiểm chứng migration trên PostgreSQL test.
- WS-02 đã kiểm chứng Workspace API, membership, chuyển quyền Owner và cách ly workspace bằng Supertest trên PostgreSQL test.
- Epic: WS; priority: Must; FR-WS-01 / UC-WS-01.
- Story: Là Owner / Admin, tôi muốn tạo workspace, mời và quản lý thành viên để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Người được mời đúng email chấp nhận một lần; Owner cuối không được rời; lời mời hết hạn sau 48 giờ.
- Tasks: Prisma Migrate (`workspaces`, `workspace_members`, `invitations` + custom SQL partial unique pending invite); Express workspace RBAC middleware & service (`prisma.$transaction` cho create/transfer/accept); UI quản lý workspace & invite; integration test (Vitest + Supertest), review.

### US-PROJ-01 — Tạo, cập nhật, lưu trữ project và quản lý thành viên
- PROJ-01 và PROJ-02 đã hoàn thành. Xem [Project schema](reports/02-workspace-project/PROJ-01-project-database.md) và [Project API](reports/02-workspace-project/PROJ-02-project-api-authorization.md).
- PROJ-03 đã hoàn thành. Xem [báo cáo](reports/02-workspace-project/PROJ-03-project-frontend.md).
- Sprint 02 đã nghiệm thu 8/8 Task. Regression, browser smoke và [GitHub Actions](https://github.com/TrTinh34/flowpilot-ai/actions/runs/45853025353) đều đạt.
- Epic: PROJ; priority: Must; FR-PROJ-01 / UC-PROJ-01.
- Story: Là Owner / Admin / Manager, tôi muốn tạo, cập nhật, lưu trữ project và quản lý thành viên để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Manager tạo task trong project được cấp quyền; Project thuộc đúng workspace; project lưu trữ chỉ đọc.
- Tasks: Prisma Migrate (`projects`, `project_members`); Express project/resource authorization middleware (DB membership check, trả 404/403 chuẩn tenant isolation) & service/API; UI danh sách & cài đặt project; integration test (Vitest + Supertest), review.

### US-TASK-01 — Tạo task, subtask, giao việc, deadline, priority
- Tiến độ và dependencies theo [Sprint 03 Backlog](sprints/sprint-03-task-board/README.md#sprint-backlog). TASK-01 đã kiểm chứng migration trên PostgreSQL test.
- TASK-03 đã tích hợp Project Tasks, Task Detail, subtask và My Tasks. Frontend tests xác nhận thao tác và xử lý version conflict.
- Epic: TASK; priority: Must; FR-TASK-01 / UC-TASK-01.
- Story: Là Manager / Member, tôi muốn tạo task, subtask, giao việc, deadline, priority để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Task được giao xuất hiện trong My Tasks; Assignee thuộc project; subtask cùng project; deadline hợp lệ.
- Tasks: Prisma Migrate (`tasks` + `version >= 0` check); Express task service/API với Zod validation & optimistic update (`updateMany` theo `version`); UI task detail & subtask (React Hook Form + TanStack Query); integration test (Vitest + Supertest) & RTL component test, review.

### US-BOARD-01 — Kanban, kéo thả và sắp xếp task
- BOARD-01 đã kiểm chứng Board Move API, quyền theo project và cập nhật đồng thời trên PostgreSQL test.
- Epic: BOARD; priority: Must; FR-BOARD-01 / UC-BOARD-01.
- Story: Là Manager / Member, tôi muốn kanban, kéo thả và sắp xếp task để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Hai cập nhật đồng thời không ghi đè âm thầm; Kiểm tra version khi di chuyển; cập nhật thứ tự nguyên tử.
- Tasks: Express board move API dùng `prisma.$transaction` + `SELECT ... FOR UPDATE` trên project row, kiểm tra `version` trả 409 khi conflict; UI Kanban bằng `dnd-kit` + nút đổi trạng thái thay thế; integration test concurrency (Vitest + Supertest) & RTL test, review.

### US-COL-01 — Bình luận, mention, đính kèm
- Epic: COL; priority: Must; FR-COL-01 / UC-COL-01.
- Story: Là Manager / Member, tôi muốn bình luận, mention, đính kèm để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Bình luận hiển thị và người được mention nhận thông báo; Mention chỉ thành viên project; file tối đa 10 MB.
- Tasks: Prisma Migrate (`comments`, `attachments`); Express multipart upload & magic-byte/MIME validation, S3 integration & signed download URL, ghi `outbox_events` khi mention; UI comment/mention & upload; integration test (Vitest + Supertest với fake storage), review.

### US-NOTI-01 — Thông báo trong app và real-time
- Epic: NOTI; priority: Must; FR-NOTI-01 / UC-NOTI-01.
- Story: Là User, tôi muốn thông báo trong app và real-time để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Reconnect tải lại thông báo chưa đọc; Chỉ người nhận đọc hoặc đánh dấu đã đọc.
- Tasks: Prisma Migrate (`notifications`, `outbox_events`); Socket.IO server với JWT handshake auth & server-managed rooms (`user:{userId}`, `project:{projectId}`), outbox worker trong `src/jobs/`, REST inbox endpoints; UI Socket.IO Client & notification inbox; integration test Socket.IO auth/room isolation (Vitest + Supertest + Socket.IO client), review.

### US-DASH-01 — Dashboard tiến độ, My Tasks, audit log
- Epic: DASH; priority: Must; FR-DASH-01 / UC-DASH-01.
- Story: Là Manager / Member, tôi muốn dashboard tiến độ, my tasks, audit log để hoàn thành công việc trong phạm vi quyền.
- Acceptance: Số task hoàn thành khớp dữ liệu; Thống kê theo quyền; audit chỉ Owner/Admin/Manager trong phạm vi.
- Tasks: Prisma Migrate (`audit_logs`); Express dashboard aggregation (`/dashboard`, `/me/tasks`, `/audit`) kiểm tra quyền theo scope; UI biểu đồ Recharts & trang My Tasks/Audit; integration test (Vitest + Supertest) & RTL test, review.

### US-AI-01 — Sinh kế hoạch AI, chỉnh sửa và xác nhận
- Epic: AI; priority: Must; FR-AI-01 / UC-AI-01.
- Story: Là Manager, tôi muốn sinh kế hoạch ai, chỉnh sửa và xác nhận để hoàn thành công việc trong phạm vi quyền.
- Acceptance: JSON sai không tạo task; xác nhận hai lần không nhân đôi; Không tạo task trước xác nhận; xác nhận idempotent.
- Tasks: Prisma Migrate (`ai_plans`); AI Provider Abstraction (`AiProvider` interface + Node.js SDK adapter + `FakeAiProvider`), Zod structured output validation, in-process async job worker (`src/jobs/`) có lease, idempotent confirm trong `prisma.$transaction` (`FOR UPDATE`); UI AI brief + Preview/Edit/Confirm; integration test fake provider/timeout/idempotency (Vitest + Supertest), review.

## Definition of Done
Acceptance pass; backend authorization; migration reviewed (`prisma/migrations`); unit/integration tests (Vitest/Supertest/RTL); UI loading/error/empty states; API contract updated; PR self-review; CI green. Không có lỗi critical/high chưa xử lý. Mỗi sprint review lại scope. Nếu thiếu thời gian, bỏ attachment trước, sau đó dashboard nâng cao; giữ tenant isolation, Kanban và AI approval.
