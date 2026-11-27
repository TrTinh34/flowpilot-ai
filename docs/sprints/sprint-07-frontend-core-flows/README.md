# Sprint 07 — Frontend Redesign · Core flows

## Sprint Information

- Ngày mở — 2026-11-28
- Trạng thái — IN_PROGRESS
- Timebox B · 39 giờ dự kiến trong 2–3 tuần
- Tiến độ — 1/6 task

## Sprint Goal

Áp dụng Design System và Application Shell vào Auth, Dashboard, Workspace, Projects, Task Lists và Kanban/Task Detail.

## Scope

Triển khai theo task được giao. Mở REDESIGN-05 trước. Giữ contract backend và quyền hiện hành. Dashboard giữ ranh giới Demo theo API readiness. Timebox C theo kế hoạch riêng.

## Sprint Backlog

| ID | Task | Ưu tiên | Giờ | Dependencies | Trạng thái |
|---|---|---|---:|---|---|
| REDESIGN-05 | [Authentication Pages](../sprint-06-frontend-redesign/tasks/REDESIGN-05-authentication.md) | P1 | 5 | REDESIGN-04 | COMPLETED |
| REDESIGN-06 | [Dashboard](../sprint-06-frontend-redesign/tasks/REDESIGN-06-dashboard.md) | P1 | 6 | REDESIGN-04 | PENDING |
| REDESIGN-07 | [Workspace & Member Management](../sprint-06-frontend-redesign/tasks/REDESIGN-07-workspace.md) | P1 | 6 | REDESIGN-04 | PENDING |
| REDESIGN-08 | [Project Management](../sprint-06-frontend-redesign/tasks/REDESIGN-08-projects.md) | P1 | 7 | REDESIGN-07 | PENDING |
| REDESIGN-09 | [My Tasks & Task Management](../sprint-06-frontend-redesign/tasks/REDESIGN-09-task-management.md) | P0 | 7 | REDESIGN-03, REDESIGN-08, ENV-01 | PENDING |
| REDESIGN-10 | [Kanban Board & Task Details](../sprint-06-frontend-redesign/tasks/REDESIGN-10-kanban.md) | P1 | 8 | REDESIGN-09 | PENDING |

## Dependencies

[Sprint 06](../sprint-06-frontend-redesign/README.md) hoàn thành Timebox A 5/5, gồm ENV-01 và Application Shell. [Dependency graph](../sprint-06-frontend-redesign/task-dependencies.md).

## Acceptance Criteria

Các route trong scope có UI responsive, thao tác chính qua keyboard, trạng thái lỗi rõ và regression đi qua API hiện hành hoặc chế độ Demo đã được chỉ định. Xem [Screen Specs](../../design/frontend/screen-specifications.md).

## Definition of Done

[Quality Gates](../sprint-06-frontend-redesign/acceptance-criteria.md), task evidence, ảnh trước/sau và Developer Review.

## Risks and Blockers

Dashboard và audit chưa có backend live. S3 cần cấu hình môi trường khi kiểm tra tệp thật. Các thay đổi backend nằm ngoài Timebox B.

## Sprint Review

REDESIGN-05 đã qua frontend và PostgreSQL regression. Edge 360px đi hết luồng đăng ký, sai mật khẩu, đăng nhập, refresh và logout. [Báo cáo REDESIGN-05](../../reports/frontend-redesign/REDESIGN-05-authentication.md)

## Sprint Retrospective

Ghi sau khi kết thúc Timebox B.
