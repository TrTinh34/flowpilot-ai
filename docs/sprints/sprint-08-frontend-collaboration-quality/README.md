# Sprint 08 — Frontend Redesign · Collaboration & Quality

## Sprint Information

- Ngày mở — 2026-11-28
- Trạng thái — IN_PROGRESS
- Timebox C · 38 giờ dự kiến · 1/6 task

## Scope

Collaboration, Notifications, AI Planner, Profile & Settings, responsive accessibility và Visual QA. Mở Timebox C theo yêu cầu triển khai REDESIGN-11. Sprint 07 đã triển khai 6/6 task và đang chờ Developer Review.

## Sprint Backlog

| ID | Task | Ưu tiên | Giờ | Dependencies | Trạng thái |
|---|---|---|---:|---|---|
| REDESIGN-11 | [Collaboration & Activity](../sprint-06-frontend-redesign/tasks/REDESIGN-11-collaboration.md) | P1 | 6 | REDESIGN-10, COL-04 | COMPLETED |
| REDESIGN-12 | [Notification Center](../sprint-06-frontend-redesign/tasks/REDESIGN-12-notifications.md) | P1 | 6 | REDESIGN-04, REFINE-03, REFINE-04 | PENDING |
| REDESIGN-13 | [AI Planner](../sprint-06-frontend-redesign/tasks/REDESIGN-13-ai-planner.md) | P1 | 7 | REDESIGN-04, REFINE-03, REFINE-04 | PENDING |
| REDESIGN-14 | [Profile & Settings](../sprint-06-frontend-redesign/tasks/REDESIGN-14-settings.md) | P1 | 4 | REDESIGN-04, REDESIGN-07, REFINE-03, REFINE-04 | PENDING |
| REDESIGN-15 | [Responsive Design & Accessibility](../sprint-06-frontend-redesign/tasks/REDESIGN-15-responsive-accessibility.md) | P0 | 7 | REDESIGN-05–14, REFINE-07 | PENDING |
| REDESIGN-16 | [Frontend Integration & Visual QA](../sprint-06-frontend-redesign/tasks/REDESIGN-16-visual-qa.md) | P0 | 8 | REDESIGN-05–15, REFINE-07 | PENDING |

## Proposed Refinement Workstream (Timebox R — Chờ Developer Approval)

> **Lưu ý sức chứa (Solo Developer 15–20h/tuần):** Khối lượng refinement triển khai (`REFINE-03`..`REFINE-07`) ước tính **31 giờ** (~2 tuần). Vì Timebox C hiện còn **32 giờ** dành cho `REDESIGN-12..16`, việc gộp chung sẽ vượt sức chứa Sprint 08 (63 giờ). Do đó, đề xuất tách **Timebox R (Sprint 08R · Frontend Design Refinement)** chạy trước khi mở tiếp `REDESIGN-12..16`, thay vì âm thầm phình timebox.

| ID | Task | Ưu tiên | Giờ | Dependencies | Trạng thái |
|---|---|---|---:|---|---|
| REFINE-01 | [UI/UX Pro Max Skill Integration](../sprint-06-frontend-redesign/tasks/REFINE-01-ui-ux-pro-max-integration.md) | P0 | 2 | REDESIGN-11 | IN_REVIEW |
| REFINE-02 | [Completed Frontend Re-audit](../sprint-06-frontend-redesign/tasks/REFINE-02-frontend-reaudit.md) | P0 | 4 | REFINE-01 | IN_REVIEW |
| REFINE-03 | [Design System V2 Enhancement](../sprint-06-frontend-redesign/tasks/REFINE-03-design-system-v2.md) | P0 | 4 | REFINE-02, Developer Approval | PENDING |
| REFINE-04 | [Shared Components & Application Shell Refinement](../sprint-06-frontend-redesign/tasks/REFINE-04-shared-components-shell.md) | P0 | 7 | REFINE-03 | PENDING |
| REFINE-05A | [Dashboard, Workspace & Projects Refinement](../sprint-06-frontend-redesign/tasks/REFINE-05A-dashboard-workspace-projects-refinement.md) | P1 | 5 | REFINE-04 | PENDING |
| REFINE-05B | [Tasks, Kanban & Task Detail Refactoring](../sprint-06-frontend-redesign/tasks/REFINE-05B-tasks-kanban-detail-refinement.md) | P0 | 6 | REFINE-04 | PENDING |
| REFINE-06 | [Collaboration UI Refinement](../sprint-06-frontend-redesign/tasks/REFINE-06-collaboration-ui-refinement.md) | P1 | 4 | REFINE-04, REFINE-05B | PENDING |
| REFINE-07 | [Regression Testing & Visual QA](../sprint-06-frontend-redesign/tasks/REFINE-07-regression-visual-qa.md) | P0 | 5 | REFINE-05A, REFINE-05B, REFINE-06 | PENDING |

## Acceptance and Definition of Done

Đối chiếu tiêu chí từng task, [quality gates](../sprint-06-frontend-redesign/acceptance-criteria.md) và Developer Review.

## Sprint Review

REDESIGN-11 đã qua kiểm thử frontend, PostgreSQL và Edge với fake storage. [Báo cáo REDESIGN-11](../../reports/frontend-redesign/REDESIGN-11-collaboration.md)
