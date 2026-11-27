# Frontend Re-audit Report & Refinement Assessment Matrix — FlowPilot AI

- **Ngày thực hiện:** 2026-11-28
- **Phạm vi:** Đánh giá lại toàn bộ công việc frontend đã hoàn thành từ `REDESIGN-01` đến `REDESIGN-11` (và `ENV-01`) trước khi áp dụng `ui-ux-pro-max` Skill.
- **Mục tiêu:** Phân biệt rõ lỗi chức năng/kiến trúc, vấn đề UI/UX và đề xuất refinement dựa trên bằng chứng mã nguồn, kiểm thử tự động và ảnh chụp render thực tế (`evidence/redesign-02` đến `evidence/redesign-11`).
- **Quy tắc lịch sử:** Không xóa hay reset trạng thái đã ghi của `REDESIGN-01`..`REDESIGN-11`. Các phát hiện mới được tách riêng thành defect / refinement classification để lập kế hoạch `REFINE-01`..`REFINE-07`.

---

## 1. Xác minh UI/UX Pro Max Skill & Baseline hệ thống

### 1.1 UI/UX Pro Max Skill
- **Đường dẫn:** `.agents/skills/ui-ux-pro-max/SKILL.md`
- **Môi trường:** Python `3.11.5` (standard library, hoạt động bình thường trên Windows).
- **Các lệnh đã chạy thực tế:**
  - `python .agents/skills/ui-ux-pro-max/scripts/search.py "AI project management B2B SaaS developer productivity" --design-system --density 7 -p "FlowPilot AI" -f markdown`
  - `--domain product`: `"B2B SaaS project management"`
  - `--domain style`: `"saas dashboard minimalism"`
  - `--domain color`: `"saas productivity"`
  - `--domain typography`: `"modern saas clean"`
  - `--domain chart`: `"dashboard metrics"`
  - `--domain ux`: `"kanban drag keyboard accessible"`, `"navigation sidebar responsive"`, `"error summary validation"`, `"badge chip label wraps"`, `"focus not obscured"`, `"reduced motion"`, `"form label placeholder"`
  - `--stack react`: `"rerender memo list"`, `"bundle lazy"`
  - `--stack shadcn`: `"dialog form badge table"`
  - `--stack html-tailwind`: `"table dense dashboard"` (0 matches — ghi nhận đúng kết quả theo Query Contract của Skill).

### 1.2 Baseline tự động trước Refinement (2026-11-28)
| Check | Command | Kết quả thực tế | Ghi chú / Warnings |
|---|---|---|---|
| TypeScript | `npm --prefix frontend run typecheck` | `PASSED` (exit 0) | Không có lỗi kiểu. |
| ESLint | `npm --prefix frontend run lint` | `PASSED` (exit 0) | 2 warnings `react-refresh/only-export-components` tại `button.tsx` L64 và `tabs.tsx` L78. |
| Prettier | `npm --prefix frontend run format` | `PASSED` (exit 0) | Tất cả file khớp Prettier. |
| Unit & Integration | `npm --prefix frontend run test` | `PASSED` (14 files, 93 tests) | `workspace-ui.test.tsx` phát sinh stderr `React act(...)` warnings và `Query data cannot be undefined` (`["workspaces", ...]`). |
| Production Build | `npm --prefix frontend run build` | `PASSED` (exit 0) | `dist/assets/index-CUjsTEHY.js` = `715.32 kB` (`gzip: 220.81 kB`), Vite cảnh báo chunk > 500 kB (chưa có `React.lazy` code-splitting). |
| Browser Verification | Đọc trực tiếp 16+ ảnh evidence trong `docs/reports/frontend-redesign/evidence/` | `VERIFIED (Historical Screenshots)` | Không chạy live headless browser mới trong phiên planning; chưa kiểm chứng contrast toàn màn hình, 200% zoom, `prefers-reduced-motion` trên các màn protected (`NOT VERIFIED` trong chính các báo cáo REDESIGN-06..11). |

---

## 2. Đánh giá tổng quan theo từng Task (REDESIGN-01 → REDESIGN-11 + ENV-01)

| Task ID | Trạng thái gốc (Sprint) | Vấn đề phát hiện khi Re-audit | Bằng chứng xác minh | Phân loại | Cải thiện đề xuất |
|---|---|---|---|---|---|
| **REDESIGN-01** | COMPLETED (Sprint 06) | Tài liệu audit và direction nền tảng tốt; cần bổ sung chuẩn hóa từ `ui-ux-pro-max` cho Design System V2 và danh sách screen-level defects mới phát hiện. | `docs/design/frontend/frontend-audit.md`, `visual-direction.md` | **KEEP** | Giữ làm baseline lịch sử; mở rộng bằng báo cáo Re-audit này và Design System V2. |
| **ENV-01** | COMPLETED (Sprint 06) | Không thuộc UI code; đã khôi phục migration local (`tasks`, `collaboration`, `outbox_events`). | `docs/reports/frontend-redesign/ENV-01-my-tasks-local-schema.md` | **KEEP** | Giữ nguyên; không đụng Prisma schema/migrations. |
| **REDESIGN-02** | COMPLETED (Sprint 06) | 1) `button.tsx` và `input.tsx` dùng chiều cao mặc định `h-11` (44px) thay vì `36px` desktop-first theo `ui-design-system.md`. 2) `index.css` thiếu semantic status/priority tokens, z-index scale, sidebar rail width; các feature tự dùng `rounded-xl` (12px) cho card thay vì `8px`. 3) Lint còn 2 cảnh báo Fast Refresh (`button.tsx`, `tabs.tsx`); bundle JS `715.32 kB` chưa code-split. | `frontend/src/styles/index.css`, `button.tsx`, `input.tsx`, `tabs.tsx`, `npm run lint`, `npm run build` | **REFINE** | Chuẩn hóa Design System V2 tokens (status, priority, z-index, density heights 32/36/40px), tách CVA variants để hết lint warning, áp `React.lazy` route-splitting. |
| **REDESIGN-03** | COMPLETED (Sprint 06) | 1) `Badge` chỉ có `neutral | success` (không phân biệt `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `HIGH`, `URGENT`). 2) Thiếu shared `Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`, `Skeleton` theo layout. 3) 4+ feature tự viết `<select>` và inline avatar span trùng lặp. 4) `TaskDetailDrawer`, `CommentSection`, `AttachmentUploader` bỏ qua `EmptyState`/`LoadingState`/`FormErrorBanner`. 5) Tồn tại 5 file stub `// TODO` chết (`WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `KanbanColumn.tsx`, `NotificationInbox.tsx`). | `frontend/src/components/ui/*`, `components/common/*`, các feature components | **REFACTOR** | Mở rộng shared primitives (`Badge`, `Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`, `LoadingState` variants), thay thế toàn bộ native controls lặp và dọn dead stub files. |
| **REDESIGN-04** | COMPLETED (Sprint 06) | 1) `AppShellLayout` dùng `h-16` (64px) và `bg-card` thay vì `--topbar-height` (56px) và `--sidebar-bg`. 2) `Current project shortcuts` ở sidebar chỉ là 2 text link nhỏ (`Tasks`, `Board`) không có icon, thiếu `Settings` và thiếu `aria-current`. 3) `NotificationBell` đọc thẳng `mockNotifications` không có guard `VITE_USE_MOCK_API` (rò rỉ mock trong production!). 4) `AccountMenu` và `WorkspaceSwitcher` lặp `itemClass` và hardcode `z-[60]`. | `AppShellLayout.tsx`, `WorkspaceSwitcher.tsx`, `NotificationBell.tsx`, `evidence/redesign-04/after-shell-1440.png`, `after-drawer-390.png` | **REFINE** | Dùng shell tokens, nâng cấp sidebar project section thành nav items chuẩn có icon & `aria-current`, bỏ dead `NotificationBell` mock leak (phối hợp `REDESIGN-12` hoặc guard ngay ở Shell), chuẩn hóa `DropdownMenu` styling. |
| **REDESIGN-05** | COMPLETED (Sprint 07) | Bố cục 2 cột desktop / 1 cột 360px, contrast, validation, focus banner và password toggle đạt chuẩn. Chỉ cần thừa hưởng `h-10` / `h-9` control height đồng bộ và bỏ `rounded-[var(--radius-lg)]` inconsistency nếu cần. | `AuthLayout.tsx`, `AuthHeroPanel.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `evidence/redesign-05/after-login-1440.png` | **KEEP** | Giữ kiến trúc và UX hiện tại; đồng bộ token CSS tự động khi cập nhật `Input`/`Button`. |
| **REDESIGN-06** | COMPLETED (Sprint 07) | 1) Live mode (`after-live-1440.png`) chỉ render 1 card `My Tasks` đơn độc, ~75% viewport trống trải dù backend đã có `listProjects` API thật và dữ liệu `myTasks` để tóm tắt KPI thật. 2) Demo mode dùng `rounded-xl`, `StatCard` trơ (thiếu icon/sublabel), thanh progress tất cả cùng màu `bg-primary` thay vì màu theo status. 3) Báo cáo ghi contrast/zoom 200%/reduced-motion `NOT VERIFIED`. | `DashboardPage.tsx`, `DashboardDemo.tsx`, `StatCard.tsx`, `evidence/redesign-06/after-live-1440.png`, `after-demo-1440.png` | **REFINE** | Nâng cấp Live Dashboard thành bố cục 2 cột / KPI summary từ dữ liệu thật (`listMyTasks` + `listProjects` theo workspace hiện hành), đồng bộ `rounded-md` (8px), semantic status bars và icons cho `StatCard`. |
| **REDESIGN-07** | COMPLETED (Sprint 07) | 1) Dùng native `<select>` chưa chuẩn hóa, lặp inline Avatar, lồng viền đôi (`<ul>` có `border` nằm trong `<section>` có `border`). 2) `ConfirmAction` tự bọc dialog cục bộ trong row. 3) Còn 2 file stub chết (`WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`). 4) Test `workspace-ui.test.tsx` sinh nhiều warning `act(...)` và `Query data cannot be undefined`. | `WorkspaceSettings.tsx`, `WorkspaceMemberRow.tsx`, `WorkspaceFormDialog.tsx`, `evidence/redesign-07/after-owner-1440.png`, vitest stderr | **REFINE** | Dùng shared `Select`, `Avatar`, `ConfirmDialog`; bỏ viền lồng nhau; dọn stub chết; sửa fixture mock trong `workspace-ui.test.tsx` để hết stderr warnings. |
| **REDESIGN-08** | COMPLETED (Sprint 07) | 1) `ProjectsForWorkspace` có link `<Link>Back to workspace</Link>` gạch chân thô phía trên `PageHeader` (dư thừa vì đã có breadcrumb), dùng `<button>` thô cho Clear filters, `<label>`/`<select>` thô. 2) `ProjectCard` dùng `rounded-xl` (12px), khoảng trắng thừa giữa icon và tên, link `Tasks` / `Board` thiếu icon/pill affordance. 3) `ProjectSettings` lặp `selectClass`, inline avatar, `rounded-xl`, dùng `reportValidity()` native khi bấm Archive. | `ProjectsForWorkspace.tsx`, `ProjectCard.tsx`, `ProjectSettings.tsx`, `evidence/redesign-08/after-projects-1440.png`, `after-settings-1440.png` | **REFINE** | Bỏ back-link thô dư thừa (hoặc thay bằng compact breadcrumb/back button chuẩn), nâng cấp `ProjectCard` hierarchy + hover state + action pills có icon, chuẩn hóa filter bar và `ProjectSettings` forms. |
| **REDESIGN-09** | COMPLETED (Sprint 07) | 1) `MyTasks` có `<Link to="/">Home</Link>` gạch chân thô trên `PageHeader`. 2) `TaskList` hiển thị `"Open project"` link chung chung thay vì badge/context rõ, thanh filter không có search icon/placeholder, lặp `selectClass`. 3) `TaskMetadata` dùng text thô `"Priority: High Due 2026-12-08"` và `Badge` mọi status đều màu xám (trừ `DONE`). | `MyTasks.tsx`, `ProjectTasks.tsx`, `TaskList.tsx`, `TaskMetadata.tsx`, `evidence/redesign-09/after-my-tasks-1440.png`, `after-my-tasks-390.png` | **REFINE** | Bỏ link `Home` dư thừa, nâng cấp `TaskList` filter bar (Search icon + placeholder + shared `Select`), dùng `StatusBadge` + `PriorityBadge` + tabular date với Calendar icon + overdue hint. |
| **REDESIGN-10** | COMPLETED (Sprint 07) | **Architectural & Visual Defects:** 1) `TaskDetailPage` export từ `features/task/components/TaskDetailDrawer.tsx` thay vì `pages/task/TaskDetailPage.tsx` (vi phạm quy tắc kiến trúc `AGENTS.md`). 2) `TaskDetailDrawer` dùng `border` trơn (Tailwind v4 render viền ĐEN `#0f172a`!), lồng card 3 tầng ở Subtasks, form `Add subtask` luôn mở sẵn chiếm chỗ, bỏ qua `LoadingState`/`ErrorState`/`FormErrorBanner`. 3) `TaskForm` dùng `rounded border p-2` thô, priority IN HOA (`HIGH`), `reportValidity()` thô. 4) `SubtaskList` dùng `break-all` (cắt ngang từ tiếng Anh) và chuỗi thô `TODO · HIGH`. 5) `KanbanCard` gắn cố định `<select>` + `[↑][↓]` làm thẻ cao và xuống hàng xấu ở 390px (`after-board-390.png`), `after-board-390.png` có 2 thanh cuộn dọc song song! | `TaskDetailDrawer.tsx`, `TaskForm.tsx`, `SubtaskList.tsx`, `KanbanBoard.tsx`, `KanbanCard.tsx`, `evidence/redesign-10/after-task-detail-1440.png`, `after-board-1440.png`, `after-board-390.png` | **REFACTOR** | Tách `pages/task/TaskDetailPage.tsx`, sửa toàn bộ `border` → `border-border`, gom Subtask creation thành collapsible/toggle, chuẩn hóa `TaskForm` theo Design System V2, thay `break-all` bằng `break-words`, thiết kế lại `KanbanCard` gọn (chỉ 1 hàng action gọn/menu hoặc compact move bar không rớt dòng 390px) và bỏ dual vertical scroll. |
| **REDESIGN-11** | COMPLETED (Sprint 08) | 1) `CommentSection` lặp inline avatar, dùng `<textarea>` thô, dùng `<p role="alert">`/`<p role="status">` không style, dùng `rounded-xl`. 2) `AttachmentUploader` thiếu highlight trạng thái kéo thả (`isDragging`), dùng `<p role="status">` thô, `rounded-xl`, icon `FileText` cho cả ảnh. 3) Tabs `Details / Comments / Attachments` ở `TaskDetail` hiển thị viền focus vuông thô trong ảnh `after-comments-1440.png`. | `CommentSection.tsx`, `AttachmentUploader.tsx`, `evidence/redesign-11/after-comments-1440.png`, `after-attachments-1440.png` | **REFINE** | Dùng shared `Textarea`, `Avatar`, `FormErrorBanner`, feedback toast/status banner chuẩn, drag-active state cho dropzone, file-type icon phân biệt PDF vs Image, và line-tabs styling gọn gàng. |

---

## 3. Ma trận đánh giá trước Refinement (Before-Refinement Assessment Matrix)

| Task ID | Screen / Component | Existing Implementation | Identified Problems | Evidence | Severity | Classification | Proposed Improvements | Estimated Effort | Dependencies | Verification Requirements |
|---|---|---|---|---|---|---|---|---|---|---|
| REDESIGN-02 | `styles/index.css`, `ui/button.tsx`, `ui/input.tsx`, `ui/tabs.tsx` | Tokens Light/Dark + CVA button/tabs | Default height `h-11` (44px) gây thô trên desktop; thiếu status/priority/z-index tokens; `button.tsx` & `tabs.tsx` dính lint warning; bundle 715 kB chưa lazy split | `index.css`, `button.tsx`, `npm run lint`, `npm run build` | P1 | REFINE | Bổ sung Design System V2 tokens; default height `h-9`/`h-10`; tách variant helpers; thêm `React.lazy` cho routes | 4h (`REFINE-03`) | REFINE-02 approval | `typecheck`, `lint` (0 warnings), `build` (<500 kB main chunk), contrast check |
| REDESIGN-03 | `components/ui/*`, `components/common/*`, dead stubs | `Badge`, `Dialog`, `Card`, `EmptyState`, `ErrorState`, `LoadingState` | `Badge` chỉ có 2 tone; thiếu `Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`; 4+ chỗ tự viết native select/avatar; 5 stub `TODO` chết | `badge.tsx`, `WorkspaceSettings.tsx`, `TaskForm.tsx`, `CommentSection.tsx` | P1 | REFACTOR | Xây shared `Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`, `LoadingState` variants; xóa 5 stub chết | 7h (`REFINE-04`) | REFINE-03 | RTL unit/integration tests cho mỗi primitive mới, `typecheck`, `lint` |
| REDESIGN-04 | `AppShellLayout.tsx`, `WorkspaceSwitcher.tsx`, `NotificationBell.tsx` | Sidebar 240/64px, Breadcrumbs, Drawer, Bell | Header `h-16` lệch token 56px; sidebar bỏ qua `--sidebar-bg`; project shortcuts là text link không icon/active; `NotificationBell` lộ mock không check `VITE_USE_MOCK_API` | `AppShellLayout.tsx`, `NotificationBell.tsx`, `after-shell-1440.png` | P1 | REFINE | Đồng bộ topbar 56px & `--sidebar-bg`; nâng cấp project shortcuts; guard `NotificationBell` mock theo `DEV && VITE_USE_MOCK_API` | Included in `REFINE-04` | REFINE-03 | `app-shell.test.tsx`, keyboard drawer, 360/1440/1920 check |
| REDESIGN-05 | `AuthLayout`, `LoginForm`, `RegisterForm`, `AuthHeroPanel` | Split-screen auth + RHF/Zod + password toggle | Không có lỗi cấu trúc hoặc visual nghiêm trọng; thừa hưởng control tokens | `after-login-1440.png`, `auth-flow.test.tsx` | P3 | KEEP | Đồng bộ gián tiếp qua `Input`/`Button` tokens; giữ nguyên flow | 0h | REFINE-04 | `auth-flow.test.tsx` regression |
| REDESIGN-06 | `DashboardPage.tsx`, `DashboardDemo.tsx`, `StatCard.tsx` | Live My Tasks preview + Dev Demo overview | Live Dashboard gần như trống rỗng (1 card duy nhất); Demo dùng `rounded-xl`, `StatCard` thiếu icon, progress bars đơn sắc | `after-live-1440.png`, `after-demo-1440.png`, `DashboardPage.tsx` | P1 | REFINE | Bổ sung Live Workspace summary & Projects preview dùng `listProjects` + `listMyTasks` thật; sửa `rounded-md`, thêm icon cho `StatCard`, semantic bar colors | 2h (`REFINE-05A`) | REFINE-04 | `dashboard.test.tsx` (Demo on/off + real API), 390/1440 browser check |
| REDESIGN-07 | `WorkspaceSettings.tsx`, `WorkspaceMemberRow.tsx`, `WorkspaceFormDialog.tsx` | 2-column workspace & members + invite + confirm | Native `<select>`, inline avatar lặp, nested bordered `<ul>` trong `<section>`, vitest stderr warnings (`act`, `undefined` query) | `after-owner-1440.png`, `workspace-ui.test.tsx` | P2 | REFINE | Dùng `Select`, `Avatar`, `ConfirmDialog`; bỏ border lồng nhau; sửa test mocks hết stderr warning | 1.5h (`REFINE-05A`) | REFINE-04 | `workspace-ui.test.tsx` (0 stderr warnings), role RBAC browser check |
| REDESIGN-08 | `ProjectsForWorkspace.tsx`, `ProjectCard.tsx`, `ProjectSettings.tsx` | Responsive project grid + create/archive dialogs | Bare underlined `Back to workspace` / `Back to projects`; raw `<button>` Clear filters; `ProjectCard` `rounded-xl` thừa khoảng trống; `reportValidity()` khi Archive | `after-projects-1440.png`, `after-settings-1440.png` | P2 | REFINE | Bỏ back-link thô dư thừa; nâng cấp `ProjectCard` + action buttons có icon; chuẩn hóa filter toolbar & `ProjectSettings` | 1.5h (`REFINE-05A`) | REFINE-04 | `project-ui.test.tsx`, 390/1440/1920 check |
| REDESIGN-09 | `MyTasks.tsx`, `ProjectTasks.tsx`, `TaskList.tsx`, `TaskMetadata.tsx` | Shared `TaskList` + filter + `TaskMetadata` | Bare underlined `Home` link; `"Open project"` vô nghĩa về tên; filter bar thô; `TaskMetadata` thiếu priority badge & status color | `after-my-tasks-1440.png`, `after-my-tasks-390.png` | P1 | REFINE | Bỏ `Home` link thô; nâng cấp filter bar + `StatusBadge` + `PriorityBadge` + tabular due date + overdue styling | 2h (`REFINE-05B`) | REFINE-04 | `task-ui.test.tsx`, 360/390/1440 check |
| REDESIGN-10 | `KanbanBoard.tsx`, `KanbanCard.tsx`, `TaskDetailDrawer.tsx`, `TaskForm.tsx`, `SubtaskList.tsx` | 4-column board + native DnD + keyboard move + Task Detail | **Bug kiến trúc:** `TaskDetailPage` nằm trong `features/`; `border` trơn hóa viền ĐEN; nested 3-layer cards; `Add subtask` luôn mở; `break-all`; `TaskForm` raw HTML; `KanbanCard` cao & vỡ nút ở 390px + dual scrollbar | `after-task-detail-1440.png`, `after-board-1440.png`, `after-board-390.png` | P0/P1 | REFACTOR | Tách `pages/task/TaskDetailPage.tsx`; sửa `border-border`; dùng `LoadingState`/`ErrorState`/`FormErrorBanner`; collapsible Add Subtask; compact `KanbanCard` controls; fix dual scrollbar | 4h (`REFINE-05B`) | REFINE-04 | `kanban-board.test.tsx`, `task-ui.test.tsx`, 409 conflict + 360/390/1440 check |
| REDESIGN-11 | `CommentSection.tsx`, `AttachmentUploader.tsx` | Real comments/mentions + file upload/download | Inline avatar lặp, raw `<textarea>`, raw `<p role="alert/status">`, thiếu drag highlight trên dropzone, `rounded-xl`, `FileText` cho mọi file | `after-comments-1440.png`, `after-attachments-1440.png` | P2 | REFINE | Dùng `Avatar`, `Textarea`, `FormErrorBanner`, status notice banner, drag-over border/bg highlight, icon theo MIME type | 4h (`REFINE-06`) | REFINE-04, REFINE-05B | `collaboration-ui.test.tsx` (413/422, mention, archived read-only), 360/1440 check |

---

## 4. Đánh giá chi tiết từng màn hình (Screen-Level Audit — 16 Views)

### 4.1 Login & Register (`/login`, `/register`)
1. **Vấn đề hiện tại:** Form và hero panel gọn, chỉ bị `Input`/`Button` `h-11` hơi cao hơn mật độ desktop chuẩn và hero preview card dùng `rounded-[var(--radius-lg)]`.
2. **So với Design System V2:** Đạt 95%; cập nhật tự động khi `Button`/`Input` hỗ trợ size chuẩn.
3. **Reusable components:** `AuthLayout`, `AuthHeroPanel`, `AuthField`, `PasswordField`, `FormErrorBanner`, `Button`, `Input`.
4. **Cải thiện visual:** Giữ nguyên bố cục; đảm bảo focus ring đồng nhất `outline-2 outline-offset-2`.
5. **Cải thiện usability:** Đã có password toggle 44px, password checklist live, focus banner lỗi đầu tiên.
6. **Responsive:** 1 cột dưới `lg`, max-width 420px, không tràn ngang ở 360px.
7. **Accessibility:** `autocomplete` chuẩn, `aria-invalid`, `aria-describedby`, `role="alert"`.
8. **Giữ hành vi:** RHF + Zod + API auth thật + token in-memory.
9. **Acceptance Criteria:** Hoàn thành login/register tại 360px và 1440px, 401 focus banner.
10. **Regression tests:** `auth-flow.test.tsx`, `auth-session-client.test.ts`, `protected-routes.test.tsx`.

### 4.2 Dashboard (`/dashboard`)
1. **Vấn đề hiện tại:** Live mode chỉ có 1 card `My Tasks` với 75% không gian trống (`after-live-1440.png`); Demo mode có `rounded-xl`, `StatCard` thiếu icon, progress bars đơn sắc.
2. **So với Design System V2:** Cần mật độ thông tin SaaS hữu ích (Linear/Vercel style) ngay cả khi không bật Demo; card radius `8px`.
3. **Reusable components:** `PageHeader`, `StatCard`, `StatusBadge`, `PriorityBadge`, `LoadingState`, `EmptyState`, `ErrorState`.
4. **Cải thiện visual:** Live mode hiển thị 2 vùng rõ ràng: hàng KPI tóm tắt từ dữ liệu thật (`Assigned tasks`, `Due soon / Open`, `Completed in page`, `Workspace projects`) + lưới 2 cột desktop (`Upcoming My Tasks` và `Workspace Projects` từ `listProjects` API thật). Demo mode dùng semantic status bar colors và icon trong `StatCard`.
5. **Cải thiện usability:** Cho phép truy cập trực tiếp từng project và task ngay từ Dashboard mà không phải qua sidebar.
6. **Responsive:** KPI grid `grid-cols-2 xl:grid-cols-4`, nội dung 1 cột dưới `lg`, 2 cột từ `lg`.
7. **Accessibility:** `<dl>` cho KPI, progress bar kèm text label và `tabular-nums`.
8. **Giữ hành vi:** Tuyệt đối không tạo dữ liệu giả trong Live mode; `DashboardDemo` chỉ tải trong `DEV && VITE_USE_MOCK_API === 'true'`.
9. **Acceptance Criteria:** Live mode hiển thị đúng dữ liệu từ `listMyTasks` và `listProjects`; Demo tắt ẩn hoàn toàn fixture; production bundle không chứa fixture.
10. **Regression tests:** `dashboard.test.tsx` (test Live + Demo on/off + error retry).

### 4.3 Workspace & Member Management (`/workspaces`, `/invitations/accept`)
1. **Vấn đề hiện tại:** Native `<select>`, nested bordered `<ul>` bên trong card `Members`, lặp inline Avatar, tồn tại file chết `WorkspaceMembersTable.tsx` & `InviteMemberModal.tsx`, test warnings.
2. **So với Design System V2:** Bỏ nested borders, dùng `Avatar`, `Select`, `ConfirmDialog`, `Badge` roles (`OWNER`, `ADMIN`, `MEMBER`).
3. **Reusable components:** `PageHeader`, `Avatar`, `Select`, `ConfirmDialog`, `Badge`, `Pagination`.
4. **Cải thiện visual:** Danh sách member phẳng trên nền card (`divide-y divide-border` không bọc thêm viền ngoài), role badge có semantic color (`OWNER` indigo/primary, `ADMIN` info, `MEMBER` neutral).
5. **Cải thiện usability:** `AcceptWorkspaceInvitation` giữ nguyên thông báo lỗi rõ khi expired/invalid, thêm icon trạng thái.
6. **Responsive:** Layout 2 cột `lg:grid-cols-[18rem_1fr]`, 1 cột trên mobile, action buttons wrap gọn.
7. **Accessibility:** Focus restore từ modal, `ConfirmDialog` cho action nguy hiểm (`Remove member`, `Leave workspace`, `Transfer ownership`).
8. **Giữ hành vi:** RBAC Owner/Admin/Member, chặn sole Owner rời workspace.
9. **Acceptance Criteria:** Hết nested border, không còn native `<select>` unstyled, `workspace-ui.test.tsx` sạch stderr warnings.
10. **Regression tests:** `workspace-ui.test.tsx`.

### 4.4 Projects & Project Settings (`/workspaces/:workspaceId/projects`, `/projects/:projectId`)
1. **Vấn đề hiện tại:** Link `Back to workspace` / `Back to projects` gạch chân thô dư thừa; `ProjectCard` dùng `rounded-xl` và trống trải; `ProjectSettings` lặp `selectClass`, inline avatar, `reportValidity()` native khi Archive; `ProjectMembersPanel.tsx` chết.
2. **So với Design System V2:** Card radius `8px` (`rounded-md` / `var(--radius-md)`), hover border subtle (`hover:border-control-border/60`), action buttons có icon.
3. **Reusable components:** `PageHeader`, `ProjectCard`, `StatusBadge`, `Avatar`, `Select`, `ConfirmDialog`, `EmptyState`.
4. **Cải thiện visual:** Bỏ text link gạch chân trên `PageHeader` (dùng breadcrumb header hoặc nút Back có icon `ArrowLeft` nhất quán); `ProjectCard` gọn gàng hơn với footer action buttons `Tasks` và `Board` kèm icon (`CheckSquare`, `Columns3`).
5. **Cải thiện usability:** Validate tên project inline thay vì `reportValidity()` popup khi bấm Archive; nút Clear filters dùng `<Button variant="outline" size="sm">`.
6. **Responsive:** Grid `sm:grid-cols-2 xl:grid-cols-3`, 1 cột ở 390px.
7. **Accessibility:** `CreateProjectDialog` và Archive `ConfirmDialog` trap & restore focus.
8. **Giữ hành vi:** Role Owner/Admin/Manager, `managerId` bắt buộc khi tạo, archived read-only.
9. **Acceptance Criteria:** Không còn `<button>` thô hay `selectClass` cục bộ; Create/Archive vẫn giữ draft khi lỗi và cập nhật list khi thành công.
10. **Regression tests:** `project-ui.test.tsx`, `shared-components.test.tsx`.

### 4.5 My Tasks & Project Tasks (`/my-tasks`, `/projects/:projectId/tasks`)
1. **Vấn đề hiện tại:** `MyTasks` có `<Link to="/">Home</Link>` thô; `TaskList` hiển thị `"Open project"` thô, thanh filter không có icon/placeholder, `TaskMetadata` thiếu priority badge/màu status.
2. **So với Design System V2:** Mật độ hàng task gọn như Linear (status icon + badge, title rõ, priority badge, tabular due date + overdue warning, assignee avatar/name).
3. **Reusable components:** `PageHeader`, `TaskList`, `StatusBadge`, `PriorityBadge`, `Select`, `Input` (kèm search icon), `LoadingState` (`variant="list"`), `EmptyState`, `Pagination`.
4. **Cải thiện visual:** Gộp filter bar gọn trên 1 hàng desktop (`Search` + `Status` + `Priority`), thêm `Badge` phân biệt `To do`, `In progress`, `In review`, `Done` và `PriorityBadge` (`Low`, `Medium`, `High`, `Urgent`).
5. **Cải thiện usability:** Phân biệt empty 0 task vs 0 kết quả filter; giữ nút `Clear filters`; làm rõ label link project ở `MyTasks`.
6. **Responsive:** Task row stack dọc dưới `md`, 2 select filter chia đều 2 cột gọn ở 360px.
7. **Accessibility:** Filter `<label>` liên kết chuẩn, `role="status"` đếm kết quả, `Retry` khi lỗi 500.
8. **Giữ hành vi:** Client filter trên trang đã tải, API pagination thật, Create Task theo quyền `canManage` & `ACTIVE`.
9. **Acceptance Criteria:** Hiển thị rõ badge status & priority; 360px không tràn ngang; Retry phục hồi khi API lỗi.
10. **Regression tests:** `task-ui.test.tsx`.

### 4.6 Kanban Board (`/projects/:projectId/board`)
1. **Vấn đề hiện tại:** `KanbanCard` luôn hiện `<select>` + `[↑][↓]` làm thẻ cao, nút `[↓]` rớt dòng ở 390px (`after-board-390.png`); xuất hiện 2 thanh cuộn dọc ở mobile; `KanbanColumn.tsx` stub chết; cột board dùng `rounded-xl` và thiếu status header dot.
2. **So với Design System V2:** Column header có dot màu theo status + count pill; card compact `p-3` `rounded-md`, grip affordance + `PriorityBadge` + tabular due date + assignee `Avatar` nhỏ + hàng move controls 1 dòng gọn (`flex-nowrap` với icon `ArrowUp`/`ArrowDown` `size="icon-xs"`).
3. **Reusable components:** `PageHeader`, `PriorityBadge`, `Avatar`, `Select` (compact), `Button` (`icon-xs`), `ErrorState`.
4. **Cải thiện visual:** Sửa container scroll để chỉ có 1 scroll dọc của `<main>` và 1 scroll ngang nội bộ vùng board (`overflow-x-auto`), thêm dropzone visual state rõ khi cột trống hoặc đang drag.
5. **Cải thiện usability:** Giữ kéo thả + keyboard move (`<select>` + `ArrowUp`/`ArrowDown`) nhưng không rớt dòng trên mobile; hiển thị inline `FormErrorBanner` / `ErrorState` khi gặp `409 Conflict` kèm nút reload rõ ràng.
6. **Responsive:** 4 cột cuộn ngang nội bộ với `snap-x` trên mobile, mỗi cột `min-w-[272px]`.
7. **Accessibility:** Khôi phục focus (`focusAfterMove`) sau khi move bằng bàn phím; accessible label cho nút `Move <title> up/down`.
8. **Giữ hành vi:** Server ordering, `version` optimistic locking, 409 reconcile, `canMove` theo role/assignee.
9. **Acceptance Criteria:** Card controls nằm gọn trên 1 hàng ở 360/390px; không có dual vertical scrollbar; 409 reconcile giữ nguyên hành vi.
10. **Regression tests:** `kanban-board.test.tsx`.

### 4.7 Task Detail & Subtasks (`/tasks/:taskId`)
1. **Vấn đề hiện tại:** Export `TaskDetailPage` sai thư mục (`features/task/components/TaskDetailDrawer.tsx`); `border` trơn hóa viền ĐEN trên form/aside/subtasks; form `Add subtask` luôn mở sẵn trong card lồng 3 lớp; `TaskForm` raw HTML; `SubtaskList` dùng `break-all` và chuỗi thô; bỏ qua `LoadingState`/`ErrorState`/`FormErrorBanner`.
2. **So với Design System V2:** Tạo `pages/task/TaskDetailPage.tsx` chuẩn kiến trúc; dùng `border-border`, `rounded-[var(--radius-md)]`; bỏ nested card 3 tầng; `Add subtask` dùng nút toggle `+ Add subtask` mở form khi cần; metadata rail bên phải dùng cấu trúc `<dl>` rõ ràng (`Status`, `Priority`, `Assignee`, `Due date`, `Parent task`).
3. **Reusable components:** `PageHeader` (hoặc detail header), `Tabs` (line variant), `TaskForm` (dùng `Input`, `Textarea`, `Select`, `FieldLabel`), `StatusBadge`, `PriorityBadge`, `Avatar`, `LoadingState`, `ErrorState`, `FormErrorBanner`.
4. **Cải thiện visual:** Bỏ mọi `border` trơn không token; đồng bộ `TabsList variant="line"` gọn gàng (tránh ô viền focus thô ở `after-comments-1440.png`).
5. **Cải thiện usability:** Validation inline trong `TaskForm` thay vì native `reportValidity()`; hiển thị banner 409 conflict rõ ràng kèm nút `Reload task`.
6. **Responsive:** 2 cột trên `lg` (`1fr 320px`), 1 cột stacked (metadata lên trên hoặc gọn đầu trang) trên mobile.
7. **Accessibility:** `break-words` thay cho `break-all`; aria-live/alert cho 409 và form errors.
8. **Giữ hành vi:** Edit task với `version`, tạo subtask 1 cấp, archived read-only.
9. **Acceptance Criteria:** `TaskDetailPage` đặt đúng ở `pages/task/`; không còn viền đen hoặc nested card 3 lớp; Loading/Error dùng shared components.
10. **Regression tests:** `task-ui.test.tsx`.

### 4.8 Collaboration (Comments & Attachments trong Task Detail)
1. **Vấn đề hiện tại:** Inline avatar lặp; `<textarea>` thô; `<p role="alert/status">` trơn không styling; dropzone thiếu active drag highlight; `rounded-xl`; icon `FileText` cho mọi định dạng file.
2. **So với Design System V2:** Dùng `Avatar`, `Textarea`, `FormErrorBanner`, semantic status notice, dropzone drag-over state (`border-action bg-action/5`), icon phân biệt ảnh (`Image`) vs PDF (`FileText`).
3. **Reusable components:** `Avatar`, `Textarea`, `Button`, `LoadingState`, `ErrorState`, `FormErrorBanner`.
4. **Cải thiện visual:** Thread comment gọn, timestamp `tabular-nums`, composer sạch sẽ với mention disclosure có đếm số lượng rõ ràng.
5. **Cải thiện usability:** Giữ draft khi post lỗi; highlight dropzone khi kéo file vào; nút download rõ trạng thái pending.
6. **Responsive:** Tên file dài wrap bằng `[overflow-wrap:anywhere]` không tràn 360px.
7. **Accessibility:** Keyboard mention (`Enter`/`Space`), live status cho upload/post, `aria-label` nút download.
8. **Giữ hành vi:** FormData upload, MIME/10 MiB validation (413/422), signed download URL, archived read-only.
9. **Acceptance Criteria:** Upload/comment error dùng `ErrorState`/`FormErrorBanner`; 360px không tràn ngang.
10. **Regression tests:** `collaboration-ui.test.tsx`.

### 4.9 Notification Center, AI Planner, Profile & Settings, Error States (`REDESIGN-12`..`14`, `NotFoundPage`, `ForbiddenPage`)
- Các màn `REDESIGN-12`, `REDESIGN-13`, `REDESIGN-14` hiện là prototype Sprint 04 (`PENDING` trong Sprint 08):
  - `NotificationBell.tsx` & `NotificationsPage.tsx`: tách 2 `useState(mockNotifications)` riêng, rò rỉ fixture vào production, dùng hex/arbitrary CSS vars, còn file chết `NotificationInbox.tsx`.
  - `AiPlannerPage.tsx`: hardcode `border-slate-200 bg-white`, `bg-red-50`, `bg-green-50`, `PRIORITY_COLORS` riêng; bỏ qua `VITE_USE_MOCK_API` guard và `Button`/`Input`/`Textarea`/`StatusBadge`.
  - `ProfilePage.tsx`: lặp thông tin tên/email 2 lần, inline avatar riêng, thiếu link tới `Workspace settings`, hứa hẹn tương lai `"Profile editing will be available in a future release"`.
  - `ForbiddenPage.tsx`: stub `// TODO` chưa được hoàn thiện / route hóa.
- Toàn bộ các màn này đã được cập nhật spec theo Design System V2 trong [Screen Specifications](../../design/frontend/screen-specifications.md) và task files `REDESIGN-12`..`REDESIGN-16`.
