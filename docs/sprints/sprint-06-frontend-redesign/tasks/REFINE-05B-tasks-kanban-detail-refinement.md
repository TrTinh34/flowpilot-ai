# REFINE-05B — Tasks, Kanban & Task Detail Refactoring

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-05B |
| Task Name | Tasks, Kanban & Task Detail Refactoring |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 6h |
| Dependencies | REFINE-04 |
| Related Requirements | [Screen Specs §5–§7](../../../design/frontend/screen-specifications.md) |

## Objective
Khắc phục các lỗi kiến trúc và visual nghiêm trọng tại My Tasks, Project Tasks, Kanban Board và Task Detail (`TaskDetailPage` sai thư mục, viền đen do `border` trơn, nested card 3 tầng, `break-all`, dual scrollbar ở mobile Kanban, `TaskMetadata` đơn điệu).

## Scope
- **Task Lists (`MyTasks.tsx`, `ProjectTasks.tsx`, `TaskList.tsx`, `TaskMetadata.tsx`):**
  - Bỏ `<Link to="/">Home</Link>` thô trên `MyTasks`.
  - Nâng cấp `TaskList` filter bar (Search icon + placeholder + shared `Select`); hiển thị context project/assignee kèm `Avatar size="xs"`.
  - Nâng cấp `TaskMetadata` dùng `StatusBadge` + `PriorityBadge` + tabular due date kèm icon `Calendar` và overdue hint.
- **Kanban Board (`ProjectBoardPage.tsx`, `KanbanBoard.tsx`, `KanbanColumn.tsx`, `KanbanCard.tsx`):**
  - Tách `KanbanColumn.tsx` (thay stub `// TODO` chết) với status dot + count pill + empty dropzone state.
  - Thiết kế lại `KanbanCard` gọn hơn: drag grip affordance, `PriorityBadge`, tabular due date, assignee `Avatar size="xs"`, hàng move control (`<Select size="sm">` + `ArrowUp`/`ArrowDown` `icon-xs`) nằm **trên 1 dòng** không rớt dòng ở 360/390px.
  - Sửa scroll container để loại bỏ dual vertical scrollbar ở mobile (`after-board-390.png`).
  - Dùng `FormErrorBanner` / `ErrorState` cho trạng thái 409 Conflict và archived read-only.
- **Task Detail & Subtasks (`pages/task/TaskDetailPage.tsx`, `TaskDetailDrawer.tsx`, `TaskForm.tsx`, `SubtaskList.tsx`):**
  - Tạo `frontend/src/pages/task/TaskDetailPage.tsx` và cập nhật `AppRouter.tsx` (chấm dứt việc import Page từ `features/`).
  - Thay toàn bộ `border` trơn bằng `border-border`; loại bỏ nested card 3 lớp ở Subtasks; chuyển form `Add subtask` thành toggle mở theo yêu cầu.
  - Chuẩn hóa `TaskForm` dùng `FieldLabel`, `Input`, `Textarea`, `Select`, priority labels chữ thường (`Low`, `Medium`, `High`, `Urgent`), inline validation thay cho `reportValidity()`.
  - Sửa `SubtaskList` dùng `StatusBadge` + `PriorityBadge` và `break-words` (bỏ `break-all`).
  - Áp dụng `LoadingState` (`variant="detail"`), `ErrorState` (kèm Retry) và `FormErrorBanner` (cho 409 conflict & lỗi lưu).

## Out of Scope
- Không đổi drag-and-drop engine hoặc API `version` optimistic locking contract.

## Acceptance Criteria
- `AppRouter.tsx` chỉ import pages từ `src/pages/`.
- Không còn viền đen, `break-all` hay nested card 3 tầng trong Task Detail.
- Kanban card keyboard controls không xuống hàng ở 360/390px và không có dual vertical scrollbar.
- `task-ui.test.tsx` và `kanban-board.test.tsx` (bao gồm 409 conflict & focus restore) pass 100%.

## Testing Requirements
- `task-ui.test.tsx`, `kanban-board.test.tsx`, browser `360/390/1440px` + keyboard board move + 409 reload test.
