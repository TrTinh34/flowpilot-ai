# Screen Redesign Specifications · Design System V2

> Tài liệu chuẩn hóa cấu trúc, layout, trạng thái và tiêu chí nghiệm thu cho toàn bộ màn hình FlowPilot AI theo [Design System V2](design-system.md) và [Component Inventory](component-inventory.md).
> Tuân thủ ranh giới dữ liệu tại [API Readiness Matrix](api-readiness-matrix.md).

---

## 1. Auth (`/login`, `/register`) — *REDESIGN-05 (KEEP)*

- **Layout:** `AuthLayout` 2 cột desktop (`lg:grid-cols-2`), form container `max-w-[420px]`, mobile 1 cột với `--page-gutter`.
- **Components:** `Logo`, `AuthHeroPanel`, `AuthField`, `PasswordField`, `FormErrorBanner`, `Button` (`size="comfortable"` `h-10`), `Input`.
- **States & A11y:** `mode="onBlur"`, pending khóa submit lặp (`readOnly` + disabled button + spinner), API error focus vào `FormErrorBanner` (`role="alert"`), nút hiện mật khẩu `>= 44px` hit target, `autocomplete` chuẩn.
- **Acceptance Criteria:** Hoàn thành đăng ký/đăng nhập tại `360px` và `1440px`, không overflow, refresh/logout regression đạt.

## 2. Dashboard (`/dashboard`) — *REFINE-05A*

- **Layout:** Workspace-wide (`w-full min-w-0 px-page-gutter py-6 space-y-6`).
- **Live Mode (Real APIs only):**
  - `PageHeader` (`Dashboard`, mô tả workspace đang chọn, actions `Projects` + `Open My Tasks`).
  - Hàng tóm tắt KPI thật (`grid-cols-2 xl:grid-cols-4 gap-4`) tính trực tiếp từ `listMyTasks(0)` và `listProjects(workspaceId, 0)` (không bịa số): *Assigned Tasks (page)*, *Open / In Progress*, *Due Soon*, *Workspace Projects (page)*. Dùng `StatCard` (`rounded-[var(--radius-md)]`, có icon nhỏ + `tabular-nums`).
  - Lưới 2 cột desktop (`lg:grid-cols-2 gap-5`): **Upcoming My Tasks** (tối đa 5 task ưu tiên chưa xong & sắp đến hạn, kèm `StatusBadge` + `PriorityBadge` + due date) và **Workspace Projects** (tối đa 5 project gần nhất kèm `Badge` Active/Archived + link nhanh tới `Tasks` / `Board`).
- **Demo Mode (`DEV && VITE_USE_MOCK_API === 'true'`):**
  - Khu vực `Workspace overview` gắn badge `Demo`, progress bars dùng semantic status colors (`--color-info`, `--color-warning`, `--color-success`, `--foreground-muted`), deadlines & activity dùng format thống nhất. Tuyệt đối không render trong production bundle.
- **States & A11y:** `LoadingState` (`variant="cards"`), `ErrorState` có Retry cho từng query độc lập, `EmptyState` có CTA tạo/mở project tùy quyền.

## 3. Workspace & Member Management (`/workspaces`, `/invitations/accept`) — *REFINE-05A*

- **Layout:** Workspace-wide 2 cột desktop (`lg:grid-cols-[18rem_minmax(0,1fr)] gap-5`), mobile 1 cột. Accept Invite dùng `max-w-lg` căn giữa.
- **Components:** `PageHeader`, `Select`, `Avatar`, `Badge` (role semantic), `ConfirmDialog` (Remove / Leave / Transfer), `WorkspaceFormDialog`, `Pagination`.
- **Visual Refinement:** Loại bỏ nested bordered `<ul>` bên trong `Members` card; danh sách member dùng `divide-y divide-border` trực tiếp trong card; giữ sole-Owner leave notice rõ ràng.
- **Acceptance Criteria:** Owner/Admin/Member thấy đúng quyền; không còn native `<select>` unstyled; `ConfirmDialog` trap & restore focus; 360px không tràn ngang.

## 4. Projects & Project Settings (`/workspaces/:workspaceId/projects`, `/projects/:projectId`) — *REFINE-05A*

- **Layout:** Workspace-wide; Projects grid (`sm:grid-cols-2 xl:grid-cols-3 gap-4`); Project Settings 2 cột (`xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]`).
- **Visual Refinement:**
  - Bỏ các `<Link>` gạch chân rời rạc trên đầu trang; dùng `PageHeader` `backLink` (có icon `ArrowLeft`) hoặc dựa vào breadcrumb rõ ràng.
  - `ProjectCard`: `rounded-[var(--radius-md)]`, padding `p-4`, hover subtle border transition, footer action buttons (`Tasks`, `Board`) dạng compact outline/ghost có icon.
  - Filter bar (`ProjectsForWorkspace`): `Input` search có icon `Search` + placeholder rõ, `Select` status chuẩn, nút `Clear filters` dùng `<Button variant="outline" size="sm">`.
  - `ProjectSettings`: dùng `Select`, `Avatar`, inline validation cho tên project trước khi mở `ConfirmDialog` Archive (thay cho `reportValidity()` native).

## 5. My Tasks & Project Tasks (`/my-tasks`, `/projects/:projectId/tasks`) — *REFINE-05B*

- **Layout:** Workspace-wide; `PageHeader` (bỏ link `Home` thô ở `MyTasks`); `TaskList` filter bar gọn trên 1 hàng desktop (`Search` + `Status` + `Priority`).
- **Visual Refinement:**
  - Mỗi row task (`px-4 py-3`) hiển thị rõ: Title link, context (tên project/link hoặc assignee kèm `Avatar size="xs"`), `StatusBadge`, `PriorityBadge`, và due date `tabular-nums` (highlight cảnh báo nếu quá hạn và chưa `DONE`).
  - `LoadingState variant="list"`, `EmptyState` phân biệt 0 task vs 0 kết quả lọc.
- **Responsive & A11y:** Mobile stacked row dưới `md`, hai dropdown filter nằm gọn 2 cột ở `360px` không overflow, `role="status"` đếm số task hiển thị.

## 6. Kanban Board (`/projects/:projectId/board`) — *REFINE-05B*

- **Layout:** Workspace-wide, vùng board `overflow-x-auto` cuộn ngang nội bộ; loại bỏ tình trạng dual vertical scrollbars ở mobile.
- **Visual Refinement:**
  - 4 cột (`To do`, `In progress`, `In review`, `Done`) `rounded-[var(--radius-md)] border border-border bg-muted/60 p-3`, header cột có status dot màu + count pill (`tabular-nums`).
  - `KanbanCard`: `rounded-[var(--radius-md)] border border-border bg-card p-3 shadow-xs`, drag grip icon (`GripVertical`) khi `canMove`, `PriorityBadge`, tabular due date, assignee `Avatar size="xs"`.
  - Keyboard move controls (`<Select size="sm">` + `ArrowUp` / `ArrowDown` icon buttons `size="icon-xs"`) xếp gọn **trên 1 dòng** không rớt dòng ở 360/390px.
  - Empty column hiển thị dropzone affordance rõ (`border-dashed border-border`).
- **States & A11y:** 409 Conflict hiển thị `FormErrorBanner`/`ErrorState` có thông báo text rõ và đồng bộ lại server order; giữ focus restore (`focusAfterMove`).

## 7. Task Detail & Subtasks (`/tasks/:taskId`) — *REFACTOR in REFINE-05B*

- **Architecture Fix:** Di chuyển `TaskDetailPage` sang `frontend/src/pages/task/TaskDetailPage.tsx` (giữ `TaskDetail` composition ở feature).
- **Layout:** Workspace-wide, 2 cột từ `lg` (`minmax(0,1fr)` main + `minmax(18rem,22rem)` metadata rail bên phải); mobile stacked (metadata gọn phía trên tabs).
- **Visual Refinement:**
  - Sửa toàn bộ `border` trơn thành `border-border`; bỏ nested cards 3 tầng ở Subtasks.
  - `TabsList variant="line"` sạch sẽ cho `Details`, `Comments`, `Attachments`.
  - `TaskForm`: dùng `Input`, `Textarea`, `Select`, `FieldLabel`, hiển thị priority label chữ thường (`Low`, `Medium`, `High`, `Urgent`), inline validation error thay cho `reportValidity()`.
  - `Subtasks`: `TaskLinks` dùng `StatusBadge` + `PriorityBadge` + `break-words` (bỏ `break-all`); form `Add subtask` ẩn mặc định sau nút `+ Add subtask` và mở gọn khi bấm.
  - `LoadingState variant="detail"` và `ErrorState` kèm Retry khi lỗi tải task.

## 8. Collaboration (`Comments` & `Attachments` trong Task Detail) — *REFINE-06*

- **Comments:** Dùng `Avatar size="sm"`, `Textarea` chuẩn, `FormErrorBanner` cho lỗi gửi, status notice rõ khi post thành công, giữ draft khi lỗi; mention disclosure dễ quét hơn trên mobile/desktop.
- **Attachments:** Dropzone có trạng thái `isDragging` highlight (`border-action bg-action/5`), dùng `ErrorState` / `FormErrorBanner` cho lỗi 413/422/MIME, icon phân biệt PDF vs Image, dung lượng `tabular-nums`, tên tệp `[overflow-wrap:anywhere]`, giữ read-only khi project archived.

## 9. Remaining Screens (`REDESIGN-12` → `REDESIGN-16`) — *Aligned to Design System V2*

- **Notification Center (`REDESIGN-12`):**
  - Reading width `max-w-[820px]`; một nguồn state dùng chung giữa `NotificationBell` (header) và `NotificationsPage` (`/notifications`).
  - Guard bắt buộc `import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'` (ở production hoặc khi tắt mock flag, hiển thị `EmptyState` rõ ràng thay vì seed fixture).
  - Dùng `Tabs` (`All` / `Unread`), `Badge`, `Button`, `EmptyState`, nhóm `Today` / `Earlier`, loại bỏ hardcoded hex & stub `NotificationInbox.tsx`.
- **AI Planner (`REDESIGN-13`):**
  - Desktop 2 pane (Brief/Steps bên trái `w-80`/`w-96`, Preview/Draft bên phải workspace-width), mobile 1 cột.
  - Step indicator 4 bước (`1. Brief` → `2. Generating` → `3. Review & Edit` → `4. Confirmed`), dùng `--color-accent-ai` / `--ai-text`, `Input`, `Textarea`, `PriorityBadge`, `ConfirmDialog`, `LoadingState`, `ErrorState`.
  - Guard theo `DEV && VITE_USE_MOCK_API === 'true'` (khi tắt mock hoặc ở production, hiển thị thông báo capability chưa kích hoạt API thay vì giả lập thành công rồi redirect `/my-tasks`).
- **Profile & Settings (`REDESIGN-14`):**
  - Reading width `max-w-[760px]`; `PageHeader`, `Avatar size="lg"`, read-only `Account details` card không lặp dữ liệu 2 lần, liên kết trực tiếp tới `Workspace settings` (`/workspaces`), **không** hứa hẹn tính năng chưa có hay hiển thị edit giả.
- **Responsive & Accessibility (`REDESIGN-15`) & Visual QA (`REDESIGN-16`):**
  - Kiểm chứng toàn bộ viewport matrix (`360, 390, 768, 1024, 1280, 1440, 1920px`), `scrollWidth <= viewport + 1px`, contrast WCAG 2.2 AA (`>= 4.5:1` text, `>= 3:1` UI), zoom 200%, `prefers-reduced-motion`, keyboard-only navigation, và đối chiếu screenshot trước/sau.
