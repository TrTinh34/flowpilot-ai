# Sprint 04 — Frontend Foundation & MVP Interactive Prototype

## Sprint Information

- Sprint ID — Sprint 04
- Trạng thái — COMPLETED
- Tiến độ — 9/9 Task COMPLETED
- Nguồn — [Product Backlog & Roadmap](../../07-Backlog-Roadmap.md)
- Phụ thuộc — Sprint 03 đạt Definition of Done (TASK-BOARD-INT-01 còn PENDING)

## Sprint Goal

Hoàn thiện giao diện toàn bộ MVP FlowPilot AI: Application Shell với sidebar + header nhất quán, Dashboard, Notifications, Collaboration (Comments/Attachments), AI Planner, và Settings. Tất cả màn hình sử dụng real API khi có, mock data khi backend chưa sẵn sàng. Kết quả là một sản phẩm prototype trông chuyên nghiệp, điều hướng được và sẵn sàng để demo.

## Scope

- **UI-01** — Application Shell (Sidebar, Header, AppShellLayout hoàn chỉnh)
- **UI-02** — Shared UI Component Library (shadcn/ui mở rộng, Skeleton, Badge, Avatar, Tooltip, Tabs, Dialog, Drawer)
- **UI-03** — Dashboard UI (Progress charts, My Tasks summary, Recent activity, Upcoming deadlines)
- **UI-04** — Notification Center (Dropdown + Inbox, Socket.IO real-time, read/unread)
- **UI-05** — Collaboration UI (Comments, Mentions, Attachments trong Task Detail)
- **UI-06** — AI Planner UI (Brief form, generation loading, preview/edit, confirm flow)
- **UI-07** — Settings & Profile UI (User profile, Workspace settings)
- **UI-08** — Design System Consistency Pass (Typography, spacing, color, responsive review)
- **UI-09** — Frontend Foundation Testing & Integration Review

Ngoài scope: backend cho Dashboard, Notifications, Collaboration, AI (đây là Sprint 04/05/06 backend); authentication/task/board business logic (đã có).

## Sprint Backlog

| Task ID | Task | Trạng thái | Effort | Dependencies |
|---|---|---|---|---|
| UI-01 | [Application Shell và Navigation](tasks/UI-01-application-shell.md) | COMPLETED | M | AUTH-10, WS-04 |
| UI-02 | [Shared UI Component Library](tasks/UI-02-shared-components.md) | COMPLETED | M | UI-01 |
| UI-03 | [Dashboard UI](tasks/UI-03-dashboard-ui.md) | COMPLETED | M | UI-01, UI-02 |
| UI-04 | [Notification Center UI](tasks/UI-04-notification-ui.md) | COMPLETED | M | UI-01, UI-02 |
| UI-05 | [Collaboration UI](tasks/UI-05-collaboration-ui.md) | COMPLETED | M | UI-02, TASK-03 |
| UI-06 | [AI Planner UI](tasks/UI-06-ai-planner-ui.md) | COMPLETED | M | UI-01, UI-02 |
| UI-07 | [Settings & Profile UI](tasks/UI-07-settings-profile-ui.md) | COMPLETED | S | UI-01, UI-02 |
| UI-08 | [Design System Consistency Pass](tasks/UI-08-design-system-pass.md) | COMPLETED | S | UI-01–07 |
| UI-09 | [Frontend Foundation Testing & Review](tasks/UI-09-testing-review.md) | COMPLETED | M | UI-01–08 |

Effort: S = 0.5–1 ngày · M = 1–2 ngày · L = 2–3 ngày

## Dependencies

- Sprint 03 đạt DoD (TASK-BOARD-INT-01 cần hoàn thành trước khi bắt đầu Sprint 04)
- Backend APIs cho Dashboard, Notifications, Collaboration, AI đều **chưa có** → Sprint 04 dùng mock data có cấu trúc rõ ràng
- Xem [API Readiness Matrix](../../design/api-readiness-matrix.md) để biết trạng thái từng endpoint

## Acceptance Criteria

- AC-01: Application Shell (Sidebar + Header) nhất quán trên mọi màn hình protected.
- AC-02: Dashboard hiển thị thống kê project và task với mock data hoặc real API khi có.
- AC-03: Notification Bell trên Header hiển thị unread count; Inbox hiển thị danh sách.
- AC-04: Comment section tích hợp vào Task Detail drawer.
- AC-05: AI Planner có đầy đủ luồng brief → loading → preview → edit → confirm với mock AI response.
- AC-06: Profile page cho phép xem thông tin user.
- AC-07: Mọi màn hình responsive từ 360px đến 1440px không có horizontal overflow.
- AC-08: Tất cả interactive element có keyboard focus visible và accessible label.
- AC-09: `npm test` pass, `typecheck` pass, `lint` pass, `build` pass.
- AC-10: Mock data tách biệt với production code, không bao giờ được enable trong production build.

## Definition of Done

Theo [Definition of Done của Backlog](../../07-Backlog-Roadmap.md#definition-of-done):
- Mọi màn hình trong scope đã có real hoặc mock data, không có TODO placeholder còn lại
- Component tests cho các component mới (Vitest + RTL)
- Responsive verification tại 390px, 768px, 1024px, 1440px
- Typecheck, lint, build xanh
- Browser smoke qua các luồng chính
- Sprint Review: demo đầy đủ màn hình

## Risks and Blockers

- **Sprint 03 TASK-BOARD-INT-01 còn PENDING** — cần hoàn thành trước khi bắt đầu Sprint 04 chính thức
- **Backend APIs chưa có** cho Dashboard/Noti/AI — đây là rủi ro đã biết, giải quyết bằng mock strategy rõ ràng
- **Bundle size** — hiện ~530KB, cần code splitting khi thêm Recharts và Socket.IO
- **Socket.IO real-time** — Notification real-time phụ thuộc backend Socket.IO (Sprint 05); Sprint 04 fallback sang polling hoặc mock

## Sprint Review

Chờ thực hiện Sprint.

## Sprint Retrospective

Chờ Sprint Review.
