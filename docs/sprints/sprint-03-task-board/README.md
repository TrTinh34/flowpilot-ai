# Sprint 03 — Task & Board

## Sprint Information

- Sprint ID — Sprint 03
- Ngày mở — 2026-11-26
- Trạng thái — IN_PROGRESS
- Tiến độ — 6/7 Task hoàn thành (5 Feature Task + 1 Architecture Refactoring Task)
- Nguồn — [Product Backlog & Roadmap](../../07-Backlog-Roadmap.md)

## Sprint Goal

Người dùng tạo và quản lý task trong project, xem My Tasks và di chuyển task trên Kanban với kiểm soát cập nhật đồng thời.

## Scope

US-TASK-01 và US-BOARD-01. Bao gồm schema, migration, API, quyền theo project, UI và kiểm thử. Collaboration và AI theo roadmap của các Sprint sau.

## Sprint Backlog

| Task ID | Task | Trạng thái | Dependencies |
|---|---|---|---|
| TASK-01 | [Task schema và migration](tasks/TASK-01-task-database.md) | COMPLETED | PROJ-01 |
| ARCH-01 | [Migrate Backend Auth to Feature-based Clean Architecture](tasks/ARCH-01-clean-architecture-migration.md) | COMPLETED | Sprint 01–02 Auth & DB |
| TASK-02 | [Task và My Tasks API](tasks/TASK-02-task-api.md) | COMPLETED | TASK-01, PROJ-02 |
| BOARD-01 | [Board move API](tasks/BOARD-01-board-move-api.md) | COMPLETED | TASK-01, TASK-02 |
| TASK-03 | [Task detail, subtask và My Tasks UI](tasks/TASK-03-task-frontend.md) | COMPLETED | TASK-02, PROJ-03 |
| BOARD-02 | [Kanban và điều khiển di chuyển](tasks/BOARD-02-board-frontend.md) | COMPLETED | BOARD-01, TASK-03 |
| TASK-BOARD-INT-01 | [Task & Board integration và review](tasks/TASK-BOARD-INT-01-integration-review.md) | IN_PROGRESS | TASK-01–03, BOARD-01–02 |

## Dependencies

[Sprint 02](../sprint-02-workspace-project/README.md) đã nghiệm thu 8/8 Task. Sprint 03 dùng Project, Project Membership, Auth và PostgreSQL test hiện có.

## Acceptance Criteria

- Task/subtask và assignee thuộc đúng project. Một cấp subtask và My Tasks theo FR-TASK-01.
- Board move cập nhật thứ tự nguyên tử và trả 409 khi version cũ. UI hỗ trợ thao tác thay thế kéo thả.
- Regression, kiểm thử PostgreSQL và browser smoke có bằng chứng.

## Definition of Done

Theo [Product Backlog](../../07-Backlog-Roadmap.md#definition-of-done). Migration, API, UI, review và GitHub Actions đều đạt.

## Risks and Blockers

Bước Manager tạo task của TC-PROJ-01 đã qua kiểm thử PostgreSQL. Development database cần migration Task trước khi dùng những luồng đọc hoặc ghi bảng này. Kiểm tra format local đã đạt trên backend và frontend.

## Sprint Review

Đã kiểm chứng migration, quyền theo project, tenant isolation, di chuyển đồng thời, regression API/UI và smoke test trên Edge với PostgreSQL test. Còn chờ CI trên revision nghiệm thu. [Báo cáo TASK-BOARD-INT-01](../../reports/03-task-board/TASK-BOARD-INT-01-integration-review.md)

## Sprint Retrospective

Ca concurrency xác minh lỗi 409 trên PostgreSQL thật. Kiểm tra format theo từng gói giúp xác định điều kiện còn lại trước khi đóng Sprint.
