# REFINE-05A — Dashboard, Workspace & Projects Refinement

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-05A |
| Task Name | Dashboard, Workspace & Projects Refinement |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 5h |
| Dependencies | REFINE-04 |
| Related Requirements | [Screen Specs §2–§4](../../../design/frontend/screen-specifications.md) |

## Objective
Tinh chỉnh Dashboard (cả Live mode và Demo mode), Workspace & Member Management, Projects & Project Settings để sử dụng tối đa shared components từ `REFINE-04`, loại bỏ khoảng trống vô ích trên Live Dashboard và sửa các lỗi nested border / bare link.

## Scope
- **Dashboard (`DashboardPage.tsx`, `DashboardDemo.tsx`, `StatCard.tsx`):**
  - Live mode: bổ sung hàng KPI thật (tính từ `listMyTasks` + `listProjects` theo workspace hiện hành) và lưới 2 cột `Upcoming My Tasks` + `Workspace Projects` với link trực tiếp.
  - Demo mode: dùng `rounded-[var(--radius-md)]`, thêm icon cho `StatCard`, tô màu progress bars theo semantic status tokens.
- **Workspace & Members (`WorkspaceSettings.tsx`, `WorkspaceMemberRow.tsx`, `WorkspaceFormDialog.tsx`, `AcceptWorkspaceInvitation.tsx`):**
  - Thay native `<select>`, inline `Avatar`, `ConfirmAction` cục bộ bằng `Select`, `Avatar`, `ConfirmDialog`.
  - Bỏ nested bordered `<ul>` trong `Members` card; dùng `Badge` semantic cho `OWNER` / `ADMIN` / `MEMBER`.
  - Sửa mock/act handling trong `workspace-ui.test.tsx` để hết stderr warnings.
- **Projects (`ProjectsForWorkspace.tsx`, `ProjectCard.tsx`, `ProjectSettings.tsx`, `CreateProjectDialog.tsx`):**
  - Bỏ bare underlined `Back to workspace` / `Back to projects` (dùng `PageHeader` `backLink` hoặc breadcrumb).
  - Nâng cấp `ProjectCard` (`rounded-[var(--radius-md)]`, footer action buttons kèm icon), nâng cấp filter bar (`Search` icon + `Select` + `Button` Clear filters).
  - Thay `selectClass` & inline avatar trong `ProjectSettings`; thay `reportValidity()` khi Archive bằng inline validation rõ ràng.

## Out of Scope
- Không đổi Auth pages (`REDESIGN-05` giữ `KEEP`, chỉ thừa hưởng tokens từ `REFINE-03/04`).
- Không thêm backend aggregation endpoint mới.

## Acceptance Criteria
- Live Dashboard hiển thị hữu ích và cân đối trên desktop (`1440px`) mà không dùng dữ liệu giả.
- `workspace-ui.test.tsx`, `dashboard.test.tsx`, `project-ui.test.tsx` pass với 0 stderr `act(...)` hoặc `Query data cannot be undefined` warnings.
- Không còn `rounded-xl`, `selectClass` cục bộ, hay nested card border ở Dashboard/Workspace/Projects.

## Testing Requirements
- `dashboard.test.tsx`, `workspace-ui.test.tsx`, `project-ui.test.tsx`, browser smoke `360/390/1440/1920px`.
