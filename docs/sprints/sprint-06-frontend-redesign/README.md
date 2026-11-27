# Sprint 06 — Frontend Redesign & UI/UX Enhancement

## Sprint Information

- Ngày planning — 2026-11-27
- Trạng thái — COMPLETED cho Timebox A
- Mục tiêu — giao diện FlowPilot có hierarchy rõ, full workspace khi phù hợp, interaction nhất quán, responsive và có thể kiểm chứng.
- Timebox A — 2 tuần, 31 giờ ước tính gồm 6 giờ audit. B — Core flows, 39 giờ. C — Collaboration, AI, settings và QA, 38 giờ. Tổng 108 giờ. B và C dự kiến 2–3 tuần mỗi đợt theo sức chứa solo developer 15–20 giờ/tuần và được mở khi có yêu cầu.
- Tiến độ Timebox A — 5/5 task hoàn thành.

## Scope

Timebox A gồm foundation, shared UI, shell và corrective task My Tasks local. Timebox B được mở tại [Sprint 07](../sprint-07-frontend-core-flows/README.md). Timebox C được mở tại [Sprint 08](../sprint-08-frontend-collaboration-quality/README.md). Auth, Workspace, Projects, Task/Board và Collaboration giữ API thật. Notification delivery, Dashboard aggregation, AI backend và thay đổi contract theo backlog riêng. Các task UI-01–09 và COL-04 là baseline đã làm.

## Sprint Backlog

| ID | Task | Ưu tiên | Giờ | Dependencies | Trạng thái | Đợt |
|---|---|---|---:|---|---|---|
| REDESIGN-01 | [Frontend Audit & UI/UX Direction](tasks/REDESIGN-01-frontend-audit.md) | P0 | 6 | Sprint 04–05 | COMPLETED | A |
| REDESIGN-02 | [Design System & Theme Enhancement](tasks/REDESIGN-02-design-system.md) | P0 | 6 | REDESIGN-01 | COMPLETED | A |
| REDESIGN-03 | [Shared UI Components](tasks/REDESIGN-03-shared-components.md) | P0 | 8 | REDESIGN-02 | COMPLETED | A |
| REDESIGN-04 | [Application Shell & Navigation](tasks/REDESIGN-04-application-shell.md) | P0 | 9 | REDESIGN-03 | COMPLETED | A |
| ENV-01 | [Khôi phục schema local cho My Tasks](tasks/ENV-01-my-tasks-local-schema.md) | P0 | 2 | TASK-01, COL-01 | COMPLETED | A |
| REDESIGN-11 | [Collaboration & Activity](tasks/REDESIGN-11-collaboration.md) | P1 | 6 | REDESIGN-10, COL-04 | COMPLETED | C |
| REDESIGN-12 | [Notification Center](tasks/REDESIGN-12-notifications.md) | P1 | 6 | REDESIGN-04 | PENDING | C |
| REDESIGN-13 | [AI Planner](tasks/REDESIGN-13-ai-planner.md) | P1 | 7 | REDESIGN-04 | PENDING | C |
| REDESIGN-14 | [Profile & Settings](tasks/REDESIGN-14-settings.md) | P1 | 4 | REDESIGN-04, REDESIGN-07 | PENDING | C |
| REDESIGN-15 | [Responsive Design & Accessibility](tasks/REDESIGN-15-responsive-accessibility.md) | P0 | 7 | REDESIGN-05–14 | PENDING | C |
| REDESIGN-16 | [Frontend Integration & Visual QA](tasks/REDESIGN-16-visual-qa.md) | P0 | 8 | REDESIGN-05–15 | PENDING | C |

## Dependencies

Sprint 05 đã nghiệm thu, dùng Sprint 04 prototype làm nền. Direction cần review. ENV-01 là điều kiện kiểm chứng My Tasks local. [Dependency graph](task-dependencies.md) · [Quality gates](acceptance-criteria.md).

## Acceptance Criteria

Đợt A có tokens được duyệt, shared primitives có tests, shell giữ route/auth, desktop/mobile không tràn ngang và My Tasks dev trả 200 sau corrective task được duyệt. Các đợt sau phải đạt tiêu chí từng màn trong [Screen Specs](../../design/frontend/screen-specifications.md).

## Definition of Done

Developer review phê duyệt direction trước implementation. Với từng đợt, áp dụng [quality gates](acceptance-criteria.md) và DoD trong Product Backlog. Báo cáo chỉ đánh dấu đạt khi có bằng chứng.

## Risks and Blockers

My Tasks dev đã có schema. Demo mode hiện còn fixture trực tiếp. S3 thật cần cấu hình. Không có API live Notifications/Dashboard/AI trong baseline. B/C cần dự trù lịch và quy mô sau khi review A.

## Sprint Review

Audit đã lập và token được áp dụng sau yêu cầu triển khai. REDESIGN-02 đã qua frontend regression và kiểm tra Edge. [Báo cáo planning](../../reports/frontend-redesign/sprint-planning-report.md) · [Báo cáo REDESIGN-02](../../reports/frontend-redesign/REDESIGN-02-design-system.md)

REDESIGN-03 áp dụng shared UI vào Projects và task lists. Dialog Create Project đã qua RTL và Edge 360 px. [Báo cáo REDESIGN-03](../../reports/frontend-redesign/REDESIGN-03-shared-components.md)

ENV-01 đã khôi phục My Tasks trên development local. REDESIGN-04 đã qua 82 test frontend, build và Edge responsive. Timebox A hoàn thành tại local. [ENV-01](../../reports/frontend-redesign/ENV-01-my-tasks-local-schema.md) · [REDESIGN-04](../../reports/frontend-redesign/REDESIGN-04-application-shell.md)

## Sprint Retrospective

Dùng query cache theo route giữ breadcrumb chính xác khi đổi workspace và giảm truy vấn trùng. Browser smoke kiểm tra riêng viewport, focus và kết quả HTTP để phân biệt lỗi giao diện với môi trường.
