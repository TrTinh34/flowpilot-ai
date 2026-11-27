# Báo cáo triển khai — TASK-02: Task và My Tasks API

## 1. Thông tin Task

- **Task ID:** TASK-02
- **Task Name:** Task và My Tasks API
- **Sprint:** Sprint 03 — Task & Board
- **Date:** 2026-11-27
- **Status:** COMPLETED
- **Related Requirements:** FR-TASK-01, FR-DASH-01, NFR-07
- **Task File:** [TASK-02-task-api.md](../../sprints/sprint-03-task-board/tasks/TASK-02-task-api.md)

---

## 2. Tóm tắt triển khai

Triển khai module `task` theo chuẩn **Feature-based Clean Architecture** (4 tầng + Composition Root `task.module.ts` + Public Contract `index.ts`):

- **Domain (`backend/src/modules/task/domain/`):**
  - `entities/task.entity.ts`: `TaskEntity`, `TaskDetailEntity`, `ProjectTaskAccess`, `TaskStatus`, `TaskPriority`.
  - `errors/task.errors.ts`: `TaskNotFoundError`, `TaskProjectNotFoundError`, `ParentTaskNotFoundError`, `TaskForbiddenError`, `TaskProjectArchivedError`, `TaskVersionConflictError`, `InvalidSubtaskParentError`, `InvalidTaskAssigneeError`.
- **Application (`backend/src/modules/task/application/`):**
  - **Ports:** `TaskRepository`, `TaskUnitOfWork`.
  - **DTOs:** `ListProjectTasksInput`, `CreateTaskInput`, `GetTaskDetailInput`, `UpdateTaskInput`, `ListMyTasksInput`, `TaskDto`, `TaskDetailDto`, `PaginatedTasksDto`.
  - **Use Cases:** `ListProjectTasksUseCase`, `CreateTaskUseCase`, `GetTaskDetailUseCase`, `UpdateTaskUseCase`, `ListMyTasksUseCase`.
- **Infrastructure (`backend/src/modules/task/infrastructure/`):**
  - `PrismaTaskRepository` (truy vấn tenant-isolated theo workspace/project membership, conditional update `where: { id, version }` với `version: { increment: 1 }`).
  - `PrismaTaskUnitOfWork` (`ReadCommitted` transaction).
- **Presentation (`backend/src/modules/task/presentation/`):**
  - `TaskController`, `createProjectTasksRouter`, `createTaskRouter`, `createMyTasksRouter`, `task.schemas.ts` (Zod), `toTaskAppError`.
- **Routing (`backend/src/routes/index.ts`):**
  - `GET/POST /api/v1/projects/:projectId/tasks`
  - `GET/PATCH /api/v1/tasks/:taskId`
  - `GET /api/v1/me/tasks`

---

## 3. Changed Files

- `backend/src/shared/domain/errors/error-codes.ts` (bổ sung `TASK_VERSION_CONFLICT`)
- `backend/src/modules/task/domain/**`
- `backend/src/modules/task/application/**`
- `backend/src/modules/task/infrastructure/**`
- `backend/src/modules/task/presentation/**`
- `backend/src/modules/task/task.module.ts`
- `backend/src/modules/task/index.ts`
- `backend/src/routes/index.ts`
- `backend/tests/architecture/clean-architecture.test.ts`
- `backend/tests/unit/task.use-cases.test.ts`
- `backend/tests/integration/task-api.postgres.test.ts`
- Removed obsolete placeholders: `backend/src/modules/task/{task.controller,task.repository,task.routes,task.schema,task.service,task.types}.ts`

---

## 4. Verification Results

- `npm --prefix backend run typecheck`: **PASSED**
- `npm --prefix backend run lint`: **PASSED**
- `npm --prefix backend run build`: **PASSED**
- `npm --prefix backend run test:architecture`: **PASSED** (1 file, 5/5 tests)
- `npm --prefix backend run test:unit`: **PASSED** (8 files, 67/67 tests)
- `npm --prefix backend run test:integration`: **PASSED** (10 files, 37/37 tests trên PostgreSQL `flowpilot_ai_test`)

---

## 5. Acceptance Criteria

- Một cấp subtask (từ chối subtask lồng nhau bằng `422`): **PASSED**
- Assignee phải là thành viên project (từ chối bằng `422`): **PASSED**
- Optimistic locking (`version` mismatch trả `409 TASK_VERSION_CONFLICT`): **PASSED**
- Project `ARCHIVED` chỉ đọc (tạo/sửa trả `409 PROJECT_ARCHIVED`): **PASSED**
- Tenant isolation (`404` ngoài workspace, `403` thiếu quyền trong scope): **PASSED**
- `GET /api/v1/me/tasks` chỉ trả về task được giao cho actor: **PASSED**
