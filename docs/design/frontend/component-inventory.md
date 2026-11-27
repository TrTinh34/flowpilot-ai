# Shared Component Inventory & Consolidation Plan

> Cập nhật theo kết quả Re-audit (`docs/reports/frontend-redesign/frontend-reaudit-report.md`) và [Design System V2](design-system.md).
> Quy tắc kiến trúc: Generic primitives nằm trong `frontend/src/components/ui/`, app-level compositions nằm trong `frontend/src/components/common/`, domain components giữ trong `frontend/src/features/<name>/components/`.

---

## 1. Kiểm kê hiện trạng & Các điểm trùng lặp cần hợp nhất

| Component / Nhóm | Hiện trạng trong repo | Vấn đề phát hiện | Hành động Refinement (`REFINE-04`) |
|---|---|---|---|
| **Button** (`ui/button.tsx`) | CVA variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`), sizes (`default: h-11`, `sm: h-9`, `lg: h-12`, `xs: h-7`, `icon*`). | 1) Default `h-11` (44px) quá cao trên desktop. 2) Thiếu `cursor-pointer`. 3) Export `buttonVariants` chung file gây ESLint Fast Refresh warning. | Tách `button-variants.ts` (hết lint warning); chuẩn hóa heights (`default: h-9`, `comfortable: h-10`, `sm: h-8`, `lg: h-11`, `icon: size-9`, `icon-sm: size-8`, `icon-xs: size-7`); thêm `cursor-pointer`. |
| **Input** (`ui/input.tsx`) | Native `<input>` styled với `h-11`, `rounded-[var(--radius)]`, `border-input`. | Chiều cao `h-11` lệch spec 36px; thiếu helper wrapper cho search icon (`SearchInput` hoặc `startIcon` slot). | Chuẩn hóa `h-9` (`36px`, có `size="comfortable"` `h-10` cho Auth nếu cần); giữ `border-input`, `aria-invalid`, `:focus-visible`. |
| **Select** *(THIẾU)* | 5 file tự viết `<select>` + `selectClass` cục bộ (`WorkspaceSettings`, `WorkspaceFormDialog`, `ProjectsForWorkspace`, `ProjectSettings`, `CreateProjectDialog`, `TaskList`, `TaskForm`, `KanbanCard`). | Lặp CSS class ở mọi nơi, không đồng bộ chiều cao/focus-ring/arrow/disabled state. | Tạo `ui/select.tsx` chuẩn hóa native accessible `<select>` (hoặc Radix Select khi cần custom menu), hỗ trợ `size="default" | "sm"` (`h-9` / `h-8`), `aria-invalid`, `border-input`. |
| **Textarea** *(THIẾU)* | 3 file tự viết `<textarea>` (`TaskForm`, `CommentSection`, `AiPlannerPage`) với style hoàn toàn khác nhau (`rounded border p-2` vs `border-slate-200` vs `bg-background`). | Thiếu focus-ring, `aria-invalid`, `disabled`, border token đồng nhất. | Tạo `ui/textarea.tsx` dùng chung `border-input bg-card focus-visible:outline-ring`. |
| **Badge / StatusBadge / PriorityBadge** | `ui/badge.tsx` chỉ hỗ trợ `tone?: 'neutral' | 'success'`. `TaskMetadata` chỉ đổi màu chữ cho `URGENT`, các status khác đều xám. `AiPlannerPage` tự tạo `PRIORITY_COLORS` riêng. | Không phân biệt được `To do`, `In progress`, `In review`, `Done` và 4 mức Priority. | Mở rộng `ui/badge.tsx` với `tone`: `neutral | primary | success | info | warning | danger | ai` + `className`. Tạo `StatusBadge` & `PriorityBadge` trong `features/task/components/` (hoặc `components/common/` nếu dùng chung với AI Planner). |
| **Avatar** *(THIẾU)* | 5 nơi tự vẽ `<span>` tròn chữ cái đầu (`AppShellLayout`, `WorkspaceMemberRow`, `ProjectSettings`, `CommentSection`, `ProfilePage`). | Trùng lặp code ở 5 chỗ, kích thước và màu nền không nhất quán. | Tạo `components/common/Avatar.tsx` với `name`, `size?: 'xs' | 'sm' | 'md' | 'lg'`, `tone?: 'brand' | 'subtle'`. |
| **Card** (`ui/card.tsx`) | Đã có `Card`, `CardHeader`, `CardContent`, `CardFooter`; nhưng các màn tự viết `rounded-xl border bg-card p-4` thủ công. | Card trong feature dùng `rounded-xl` (12px) hoặc thiếu `border-border` (thành viền đen). | Chuẩn hóa `Card` `rounded-[var(--radius-md)] border-border shadow-xs` với `compact` padding option, dùng `Card` hoặc chuẩn class thống nhất thay `rounded-xl`. |
| **Tabs** (`ui/tabs.tsx`) | Radix Tabs với `default` và `line` variant; export `tabsListVariants` chung file. | Lint Fast Refresh warning; trong `after-comments-1440.png` active tab bị viền focus vuông thô. | Tách `tabs-variants.ts`; tinh chỉnh `line` variant làm tab mặc định gọn cho `TaskDetail`. |
| **Dialog / ConfirmDialog** (`ui/dialog.tsx`) | Radix Dialog bọc `trigger` bắt buộc; `WorkspaceMemberRow` & `ProjectSettings` tự viết confirm flow lặp lại. | Không hỗ trợ `maxWidth` hoặc controlled dialog không có `trigger`; lặp boilerplate `busy`/`error` trong confirm actions. | Bổ sung `maxWidth` prop, `trigger?` optional, và tạo `components/common/ConfirmDialog.tsx` cho các thao tác destructive (`Archive`, `Remove member`, `Leave`, `Transfer`). |
| **PageHeader** (`components/common/PageHeader.tsx`) | Có `title`, `description`, `actions`. | Các trang tự chèn `<Link className="underline">Back...</Link>` hoặc `Home` thô ở trên `PageHeader`. | Thêm optional `backLink?: { to: string; label: string }` (với icon `ArrowLeft`) và `badge?: ReactNode` vào `PageHeader` để loại bỏ các link gạch chân rời rạc. |
| **LoadingState / EmptyState / ErrorState / FormErrorBanner** | Đã có tại `components/common/`. `TaskDetailDrawer`, `CommentSection`, `AttachmentUploader` không dùng chúng mà tự render `<p>`. | `LoadingState` chỉ có 1 dạng 3 thanh ngang; `EmptyState` không nhận `icon` hoặc `compact`; `ErrorState` thiếu icon `AlertCircle`. | Bổ sung `LoadingState` `variant?: 'panel' | 'list' | 'cards' | 'board'`; nâng cấp `EmptyState` (icon container + `compact?: boolean`); thêm `AlertCircle` vào `ErrorState`; áp dụng vào 100% các màn. |
| **Pagination** (`components/common/Pagination.tsx`) | `Previous / Page N / Next`, ẩn khi `!page && !hasNext`. | Tốt về logic; cần căn lề & `tabular-nums` nhất quán. | Giữ logic, thêm `tabular-nums` và icon `ChevronLeft`/`ChevronRight`. |
| **Dead Stub Files (`// TODO`)** | 5 file rỗng chỉ có 1 dòng comment `// TODO`: `WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `KanbanColumn.tsx`, `NotificationInbox.tsx`. | Gây nhiễu cấu trúc codebase và nhầm lẫn giữa component thật vs stub. | **Xóa** các file stub không dùng tới (hoặc implement đúng trách nhiệm nếu tách từ refactor như `KanbanColumn.tsx` trong `REFINE-05B`). |

---

## 2. Quy tắc sử dụng (Bắt buộc cho các Task sau)

1. Không viết `<select>` hoặc `<textarea>` với class tự chế trong `features/` hay `pages/` — luôn dùng `@/components/ui/select` và `@/components/ui/textarea`.
2. Không viết inline avatar circle mới — dùng `@/components/common/Avatar`.
3. Không viết `border` trơn — luôn dùng `border-border` hoặc `border-input`.
4. Không viết `rounded-xl` cho card/panel — dùng `rounded-[var(--radius-md)]` (`8px`); `rounded-[var(--radius-lg)]` (`12px`) chỉ dùng cho modal/popover.
5. Mọi async list/panel đều phải dùng `LoadingState`, `EmptyState`, `ErrorState` và form error dùng `FormErrorBanner`.
