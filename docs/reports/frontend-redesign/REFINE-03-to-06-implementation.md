# REFINE-03 → REFINE-06 — Triển khai Frontend Design Refinement (UI/UX Pro Max)

## 1. Thông tin Task

- **Task IDs:** `REFINE-03`, `REFINE-04`, `REFINE-05A`, `REFINE-05B`, `REFINE-06` (và baseline tự động của `REFINE-07`)
- **Sprint:** Sprint 08R · Frontend Design Refinement
- **Ngày triển khai:** 2026-11-28
- **Trạng thái:**
  - `REFINE-03`, `REFINE-04`, `REFINE-05A`, `REFINE-05B`, `REFINE-06`: `COMPLETED` (code + static checks + Vitest/RTL integration tests `PASSED`; browser visual QA chuyển tiếp sang `REFINE-07`)
  - `REFINE-07`: `PARTIAL` (automated regression gates `PASSED`; live browser visual QA `360–1920px`, contrast/zoom `200%`/`prefers-reduced-motion` và ảnh before/after còn `NOT VERIFIED`)
- **Nguồn bằng chứng:** `npm --prefix frontend run typecheck`, `lint`, `format`, `test`, `build`

## 2. Tóm tắt triển khai

1. **`REFINE-03` — Design System V2 & Route Code Splitting:**
   - Cập nhật `frontend/src/styles/index.css` với semantic tokens cho Task Status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), Task Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `--topbar-height: 56px`, `--sidebar-rail-width: 64px`, z-index 6 tầng, `scroll-padding-top: var(--topbar-height)` trên `#main-content` và nâng `--foreground-muted` Light lên `#64748b`.
   - Áp dụng `React.lazy` + `Suspense` trong `frontend/src/app/router/AppRouter.tsx` cho các protected routes; giữ `LoginPage`, `RegisterPage`, `NotFoundPage` eager để giữ tương thích synchronous route tests và tối ưu bundle chính.
2. **`REFINE-04` — Shared Components, Application Shell & Cleanup:**
   - Tách `buttonVariants` (`button-variants.ts`) và `tabsListVariants` (`tabs-variants.ts`), chuẩn hóa heights (`h-9` default, `h-8` sm, `h-10` comfortable) và thêm `cursor-pointer` — xóa sạch 2 cảnh báo ESLint Fast Refresh.
   - Tạo mới `Select`, `Textarea`, `Avatar`, `ConfirmDialog`, `StatusBadge`, `PriorityBadge`; mở rộng `Badge` (7 semantic tones), `Dialog` (`maxWidthClass`, optional `trigger`), `LoadingState` (5 skeleton variants), `EmptyState` (icon + `compact`), `ErrorState` (`AlertCircle`), `PageHeader` (`backLink` + `badge`), `Pagination` (`tabular-nums` + icons).
   - Tinh chỉnh `AppShellLayout.tsx` & `WorkspaceSwitcher.tsx` dùng `--topbar-height` (56px), `--sidebar-bg`, z-index tokens, nâng cấp project shortcuts trong sidebar có icon và `aria-current`.
   - Guard `NotificationBell.tsx` theo `import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'` để không rò rỉ mock fixture ra production.
   - Xóa 4 file stub `// TODO` chết (`WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `NotificationInbox.tsx`).
3. **`REFINE-05A` — Dashboard, Workspace & Projects:**
   - Live Dashboard (`DashboardPage.tsx`): thêm hàng `StatCard` KPI thật và lưới 2 cột `My Tasks` + `Workspace projects` từ `listMyTasks` và `listProjects` thật (không dùng số liệu giả); Demo mode (`DashboardDemo.tsx`) đồng bộ màu progress bars theo từng status và `StatCard` icon.
   - Workspace & Projects: thay toàn bộ native `<select>` / inline avatar / confirm dialog cục bộ bằng shared components; bỏ viền lồng nhau ở `WorkspaceSettings`; bỏ bare underlined links (`Back to workspace`, `Back to projects`), thay `reportValidity()` khi Archive bằng inline validation; sửa `workspace-ui.test.tsx` hết stderr warnings (`act(...)` và `Query data cannot be undefined`).
4. **`REFINE-05B` — Tasks, Kanban & Task Detail:**
   - Sửa lỗi kiến trúc: tạo `frontend/src/pages/task/TaskDetailPage.tsx` và cập nhật `AppRouter.tsx` & `task-ui.test.tsx`.
   - `TaskList.tsx` & `TaskMetadata.tsx`: nâng cấp filter bar (`Search` icon + `Select`), dùng `StatusBadge`, `PriorityBadge`, tabular due date và overdue highlight; bỏ `<Link to="/">Home</Link>` thô ở `MyTasks.tsx`.
   - `KanbanBoard.tsx`, `KanbanColumn.tsx`, `KanbanCard.tsx`, `ProjectBoardPage.tsx`: implement `KanbanColumn.tsx` (status dot + count pill + empty dropzone), tối ưu `KanbanCard` gọn với move controls nằm trên 1 hàng (`Select sm` + `ArrowUp`/`ArrowDown` `icon-xs`) không rớt dòng trên mobile.
   - `TaskDetailDrawer.tsx`, `TaskForm.tsx`, `SubtaskList.tsx`: thay toàn bộ `border` trơn (viền đen Tailwind v4) bằng `border-border`, bỏ nested card 3 tầng, biến form `Add subtask` thành toggle `New subtask` (`aria-expanded`), bỏ `break-all` ở `SubtaskList`, dùng `LoadingState`/`ErrorState`/`FormErrorBanner`.
5. **`REFINE-06` — Collaboration UI:**
   - `CommentSection.tsx` & `AttachmentUploader.tsx`: dùng shared `Avatar`, `Textarea`, `FormErrorBanner`, `EmptyState compact`, `LoadingState`, `ErrorState`, thêm highlight `isDragging` cho dropzone và phân biệt icon ảnh (`Image`) vs PDF (`FileText`).

## 3. File thay đổi chính

- Tokens & Router: `frontend/src/styles/index.css`, `frontend/src/app/router/AppRouter.tsx`, `frontend/src/pages/task/TaskDetailPage.tsx`
- Shared UI: `frontend/src/components/ui/{badge,button,button-variants,dialog,input,select,tabs,tabs-variants,textarea}.ts*`, `frontend/src/components/common/{Avatar,ConfirmDialog,EmptyState,ErrorState,LoadingState,PageHeader,Pagination,PriorityBadge,StatusBadge}.tsx`
- Shell & Features: `frontend/src/layouts/AppShellLayout.tsx`, `frontend/src/features/workspace/components/*`, `frontend/src/features/notification/components/NotificationBell.tsx`, `frontend/src/features/dashboard/components/*`, `frontend/src/pages/dashboard/DashboardPage.tsx`, `frontend/src/features/project/components/*`, `frontend/src/features/task/components/*`, `frontend/src/features/board/components/*`, `frontend/src/pages/task/ProjectBoardPage.tsx`, `frontend/src/features/collaboration/components/*`
- Deleted dead stubs: `WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `NotificationInbox.tsx`
- Tests: `frontend/tests/integration/{dashboard,shared-components,task-ui,workspace-ui}.test.tsx`

## 4. Kết quả kiểm chứng

| Check | Command | Kết quả |
|---|---|---|
| Prettier format | `npm --prefix frontend run format` | `PASSED` (exit 0) |
| TypeScript typecheck | `npm --prefix frontend run typecheck` | `PASSED` (0 errors) |
| ESLint | `npm --prefix frontend run lint` | `PASSED` (0 errors, **0 warnings**) |
| Vitest + RTL | `npm --prefix frontend run test` | `PASSED` (14 files, 94/94 tests, 0 stderr warnings) |
| Production build | `npm --prefix frontend run build` | `PASSED` (`index-*.js` giảm từ `715.32 kB` xuống `461.53 kB`, 0 cảnh báo chunk > 500 kB) |
| Live Browser Visual QA (`360–1920px`, contrast, 200% zoom, `prefers-reduced-motion`) | Chưa chạy headless browser mới trong phiên này | `NOT VERIFIED` (chuyển sang hoàn tất ở `REFINE-07`) |

## 5. Task tiếp theo

Thực hiện kiểm chứng trình duyệt trực tiếp, đo contrast/200% zoom/`prefers-reduced-motion` và chụp ảnh before/after cho **`REFINE-07`**, sau đó tiếp tục **`REDESIGN-12` → `REDESIGN-16`**.
