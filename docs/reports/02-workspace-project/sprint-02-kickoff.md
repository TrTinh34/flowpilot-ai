# Mở Sprint 02 — Workspace & Project

## 1. Thông tin Task

- Task ID — Chưa có ID, hoạt động mở Sprint
- Sprint — 02
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `US-WS-01`, `US-PROJ-01`, `NFR-03`

## 2. Tóm tắt triển khai

Sprint 02 chuyển sang IN_PROGRESS sau khi đối chiếu Sprint 01 đã nghiệm thu 13/13 Task và [CI trên main](https://github.com/TrTinh34/flowpilot-ai/actions/runs/45845083356) đã đạt. Đã mở backlog 8 Task từ hai story Workspace và Project.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `docs/sprints/sprint-02-workspace-project/` | Tạo | Sprint README và 8 Task Specs |
| `docs/sprints/README.md`, `docs/07-Backlog-Roadmap.md`, `docs/reports/README.md` | Cập nhật | Trạng thái mở Sprint và liên kết |

## 4. Quyết định kỹ thuật

Workspace schema đi trước workspace membership, invitations và project schema. Các Task API và UI dùng lại Authentication đã nghiệm thu. Phân công triển khai Task/Board giữ ở Sprint 03 theo Roadmap.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Điều kiện mở Sprint | Sprint 01 đã nghiệm thu và main đã qua CI | PASSED |
| Backlog | 8 Task có scope, dependencies, tiêu chí và kiểm thử | PASSED |
| Repo | Đối chiếu migration directory và Git diff. Sprint 02 bắt đầu với migration Auth hiện có. | PASSED |

## 6. Acceptance Criteria

Sprint 02 có phạm vi, backlog và Definition of Done. Toàn bộ 8 Task triển khai có trạng thái PENDING tại thời điểm mở Sprint.

## 7. Vấn đề và blocker

Đối chiếu ranh giới migration `project_task` khi tới PROJ-01. Test tạo task của Manager cần Task API ở Sprint 03.

## 8. Ghi chú cho developer

Tra cứu [Sprint 02 Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog) để xem thứ tự và dependencies.

## 9. Task tiếp theo

[WS-01 — Workspace schema và migration](../../sprints/sprint-02-workspace-project/tasks/WS-01-workspace-database.md).
