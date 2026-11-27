# Frontend Audit · 2026-11-27

Baseline `c5b0aa5`. Bốn ảnh người dùng ở desktop 1920px lần lượt là My Tasks (A), Notifications (B), Projects (C), Profile (D). Các màn hình còn lại đánh giá từ source và docs. Không lưu ảnh chứa thông tin tài khoản vào repo.

Stack xác nhận từ manifests và entry points: React 19, TypeScript, Vite, Tailwind v4, Radix, Lucide, TanStack Query, Zustand, React Hook Form/Zod, Axios, Vitest/RTL. Backend Express, Prisma/PostgreSQL, JWT, Modular Monolith và Clean Architecture ở Auth, Task, Collaboration. Router giữ protected/public-only routes. Sprint 04 hoàn thành UI-01–09 ở phạm vi prototype, Sprint 05 đã nối Collaboration thật. Đối chiếu [PRD](../../01-PRD.md), [SRS](../../02-SRS.md), [Use Cases](../../03-Use-Cases.md), [System Design](../../04-System-Design.md), [Database Design](../../05-Database-Design.md), [OpenAPI](../../06-API-Specification.yaml), [Test Plan](../../08-Test-Plan.md), [ADR-001](../../architecture/decisions/ADR-001-adopt-clean-architecture.md) và báo cáo Sprint 04–05.

| Mức | Màn hình | Bằng chứng / source | Cải thiện |
|---|---|---|---|
| P0 | My Tasks | Ảnh A, GET thật trả 500, `pages/task/MyTasksPage.tsx` | Tách corrective task, retry lỗi thật và giữ danh sách rỗng riêng |
| P1 | Shell | Ảnh A–D, `layouts/AppShellLayout.tsx`, header chỉ có toggle và bell trong ảnh | Breadcrumb, ngữ cảnh workspace, navigation groups, surface thống nhất |
| P1 | Projects, Task List | Ảnh A/C và `pages/project/ProjectsPage.tsx`, `pages/task/ProjectTasksPage.tsx` dùng `max-w-4xl`, pagination xuất hiện cả khi trống | Workspace-width, create dialog, actionable empty state |
| P1 | Notifications | Ảnh B, `NotificationsPage.tsx` và `NotificationBell.tsx` giữ state fixture riêng | Một nguồn state / unread count, nhóm theo thời gian, mode rõ |
| P1 | Dashboard, AI Planner | `DashboardPage.tsx` và `AiPlannerPage.tsx` đọc fixture trực tiếp; mock flag không chi phối các call site này | Adapter demo tập trung, production chỉ hiển thị khả năng thật |
| P1 | Forms, trạng thái | Projects, Workspace Settings, TaskForm, My Tasks dùng native/bare controls và các inline error/pagination khác nhau | Dùng primitive dùng chung và contract loading/empty/error/success |
| P1 | Board, Detail | `KanbanBoard.tsx` và `TaskDetailDrawer.tsx` đã có fallback move, version conflict, comments và attachments | Giữ luồng thật, chuẩn hóa card và details, feedback khi drag |
| P2 | Profile | Ảnh D, `ProfilePage.tsx` lặp email/tên và dùng lời hứa về tính năng | Nhóm account fields, liên kết Workspace Settings, chỉ hiển thị action có thật |
| P2 | Responsive và accessibility | Màn hình hẹp chưa đo trong phiên; inline form, nested main trong shell, trạng thái chỉ có chữ thô hoặc màu là điểm cần kiểm chứng | Đo viewport, keyboard, landmarks, contrast và focus trước khi nghiệm thu |
| P2 | Auth | `AuthLayout.tsx` đã chia pane full viewport, `LoginForm`/`RegisterForm` có validation | Giữ form/middleware, đồng bộ tokens và kiểm thử 360px |

Nguồn thiết kế hiện có gồm `styles/index.css`, `docs/design/02-Design-System.md`, `05-Component-Guidelines.md`, inventory, navigation map và Kiro steering. Khoảng thiếu MVP đã đề xuất cho roadmap gồm Notification delivery/inbox thật, Dashboard/audit thật, AI thật. Screen redesign chỉ lấp khoảng thiếu Interaction được contract hỗ trợ.

## Điều tra My Tasks

- `http://localhost:5173/my-tasks` trả 200 cho document SPA. `GET /health` trả 200 với database up.
- `GET /api/v1/me/tasks?page=0` trả 401 khi thiếu phiên. Request cùng route với access token dev cho UUID tổng hợp, qua signer hiện hành, trả `500 INTERNAL_ERROR` với request ID `7f64bf78-329c-4348-b773-5fd12891b217`. Token và UUID fixture không được lưu.
- Đọc catalog PostgreSQL local bằng `to_regclass` cho thấy `public.tasks`, `comments`, `outbox_events` đều thiếu. Diagnostic trực tiếp dùng Prisma ghi `P2021`, model `Task`. Repository `listByAssignee` đi qua `prisma.task.findMany`; health chỉ xác nhận kết nối. Root cause được tái hiện trên database local là thiếu schema Task. Log lịch sử của tiến trình backend chạy sẵn chưa truy xuất được; mã Prisma là log diagnostic trực tiếp.
- `prisma migrate status` ở local xác nhận còn ba migration chưa áp dụng: `20261126000200_tasks`, `20261127000000_collaboration`, `20261127000100_outbox_events`. [ENV-01](../../sprints/sprint-06-frontend-redesign/tasks/ENV-01-my-tasks-local-schema.md) ghi thủ tục xác nhận đích và deploy sau phê duyệt. Database được kiểm tra chỉ đọc trong phiên planning.

Edge headless xác nhận Login tại 390 và 1440px có document width bằng viewport, có nút hiện mật khẩu, và My Tasks chuyển về Login khi thiếu phiên. Màn protected A–D dùng ảnh người dùng làm bằng chứng visual. Để bổ sung baseline, đăng nhập local bằng tài khoản test được cấp, chọn My Tasks trong DevTools Network, lưu status/code/request ID đã bỏ thông tin nhạy cảm. Chụp lại A–D tại 390 và 1440, đối chiếu nhóm navigation, gutter và overflow.

Cập nhật ENV-01 · Đã áp dụng ba migration trên development local và tái kiểm tra GET My Tasks với kết quả 200. [Báo cáo ENV-01](../../reports/frontend-redesign/ENV-01-my-tasks-local-schema.md)
