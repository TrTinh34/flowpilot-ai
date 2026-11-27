# BOARD-01 — Board Move API

## 1. Thông tin Task

- Sprint — 03, Task & Board
- Ngày — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `US-BOARD-01`, `FR-BOARD-01`, `UC-BOARD-01`, `NFR-07`, `TC-TASK-02`

## 2. Tóm tắt triển khai

`PATCH /api/v1/tasks/{taskId}/move` nhận `status`, `position`, `version` và trả `200 { data: task }`. Vị trí bắt đầu từ 0 trong cột đích sau khi loại task đang di chuyển ra khỏi thứ tự cũ. Position nằm ngoài cột nhận 422. Version cũ nhận 409.

## 3. File thay đổi

- `backend/src/modules/task/` — Use case, ports, Prisma repository, DTO, route, validation và presenter.
- `backend/tests/unit/task.use-cases.test.ts` và `backend/tests/integration/task-api.postgres.test.ts` — unit và Supertest/PostgreSQL.
- Sprint Index, Sprint Backlog, Task Spec, Reports Index và Roadmap.

## 4. Quyết định kỹ thuật

Task UnitOfWork dùng cùng transaction cho khóa workspace rồi khóa project, đọc lại quyền và task, cập nhật theo version, sau đó cập nhật các vị trí bị ảnh hưởng. Tạo task dùng cùng thứ tự khóa để tránh tranh chấp vị trí với move. Task di chuyển và các task đổi position đều tăng version. Phía client có thể đọc lại cột sau khi move.

Member chỉ di chuyển được task được giao cho mình. Ngoài workspace trả 404, trong workspace nhưng thiếu quyền trả 403, project archived trả 409. Phần domain và use case độc lập Express/Prisma.

## 5. Kết quả kiểm chứng

| Check | Evidence | Status |
|---|---|---|
| Unit | 68 test đạt | PASSED |
| PostgreSQL integration | 38 test đạt | PASSED |
| Architecture | 5 fitness test đạt | PASSED |
| Static checks | Format trong phạm vi Task, lint, typecheck và build | PASSED |
| Format toàn backend | Có 10 file Auth/architecture đã lệch Prettier từ trước | FAILED |

## 6. Acceptance Criteria

| Criterion | Status | Evidence |
|---|---|---|
| Cập nhật thứ tự nguyên tử | PASSED | Supertest/PostgreSQL xác nhận thứ tự và version ở cột nguồn, cột đích và khi đổi chỗ trong một cột |
| Hai request cùng version không ghi đè | PASSED | Thực thi đồng thời nhận một 200 và một 409 |
| Member chỉ di chuyển task được giao | PASSED | Member được giao có thể move, task khác trả 403. Ngoài workspace trả 404. |

## 7. Vấn đề và blocker

Format toàn backend còn lỗi có sẵn ngoài phạm vi BOARD-01. Phần UI Kanban và cập nhật dữ liệu sau move thuộc BOARD-02.

## 8. Ghi chú cho developer

Review [MoveTaskUseCase](../../../backend/src/modules/task/application/use-cases/move-task.use-case.ts) và [Prisma repository](../../../backend/src/modules/task/infrastructure/repositories/prisma-task.repository.ts) để xem cách xếp vị trí và thực thi trong transaction.

## 9. Task tiếp theo

[TASK-03 — Task detail, subtask và My Tasks UI](../../sprints/sprint-03-task-board/tasks/TASK-03-task-frontend.md), dependency của BOARD-02.
