# REFINE-04 — Shared Components & Application Shell Refinement

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-04 |
| Task Name | Shared Components & Application Shell Refinement |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 7h |
| Dependencies | REFINE-03 |
| Related Requirements | [Component Inventory](../../../design/frontend/component-inventory.md), [Application Shell](../../../design/frontend/application-shell.md) |

## Objective
Hợp nhất các UI primitives bị thiếu hoặc trùng lặp, xóa dead stub files, xử lý 2 cảnh báo ESLint Fast Refresh, và tinh chỉnh `AppShellLayout` đồng bộ với Design System V2.

## Scope
- **UI Primitives (`components/ui/`):**
  - `Button` & `Input`: chuẩn hóa desktop height `h-9` (36px), `sm: h-8` (32px), `comfortable: h-10` (40px), thêm `cursor-pointer`; tách `buttonVariants` sang file riêng để hết Fast Refresh warning.
  - `Tabs`: tách `tabsListVariants` sang file riêng để hết Fast Refresh warning; tinh chỉnh focus & active indicator cho `line` variant.
  - `Badge`: mở rộng `tone` (`neutral`, `primary`, `success`, `info`, `warning`, `danger`, `ai`) + `className`.
  - Tạo `Select` (`ui/select.tsx`) và `Textarea` (`ui/textarea.tsx`) chuẩn hóa `border-input`, `:focus-visible`, `aria-invalid`, `disabled`.
  - Mở rộng `Dialog` (`maxWidth`, `trigger?` optional).
- **Common Components (`components/common/`):**
  - Tạo `Avatar.tsx`, `ConfirmDialog.tsx`, `StatusBadge.tsx`, `PriorityBadge.tsx`.
  - Nâng cấp `LoadingState` (`variant`: `panel | list | cards | detail`), `EmptyState` (icon slot + `compact`), `ErrorState` (thêm `AlertCircle`), `PageHeader` (thêm `backLink?` + `badge?`).
- **Application Shell (`layouts/AppShellLayout.tsx`, `WorkspaceSwitcher.tsx`, `NotificationBell.tsx`):**
  - Dùng `--topbar-height` (56px / `h-14`), `--sidebar-bg`, `Avatar`, z-index tokens.
  - Nâng cấp `Current project shortcuts` trong sidebar thành nav items chuẩn có icon (`CheckSquare`, `Columns3`, `Settings`) và `aria-current`.
  - Guard `NotificationBell` không seed `mockNotifications` khi tắt `VITE_USE_MOCK_API` hoặc trong production build.
- **Cleanup:** Xóa các file stub `// TODO` chết không dùng (`WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `NotificationInbox.tsx`; giữ/implement `KanbanColumn.tsx` ở `REFINE-05B`).

## Out of Scope
- Không cài thêm thư viện UI ngoài.
- Không thay đổi Workspace/Auth API calls.

## Acceptance Criteria
- `npm --prefix frontend run lint` đạt 0 errors, **0 warnings**.
- Không còn `<select>`/`<textarea>`/`Avatar` tự viết trùng lặp ở Shell; `NotificationBell` ở production không hiển thị fixture giả.
- Tất cả primitives mới có Vitest + RTL tests (render, interaction, error/disabled states).

## Testing Requirements
- `shared-components.test.tsx`, `app-shell.test.tsx`, unit/RTL tests cho `Select`, `Textarea`, `Avatar`, `ConfirmDialog`, `StatusBadge`, `PriorityBadge`.
