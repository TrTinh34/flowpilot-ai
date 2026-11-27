# Frontend Design Refinement Planning Report (UI/UX Pro Max)

- **Ngày lập:** 2026-11-28
- **Trạng thái:** `IN_REVIEW` (Chỉ lập kế hoạch và đánh giá; chưa sửa source code ứng dụng, chờ Developer Approval)
- **Skill áp dụng:** `ui-ux-pro-max` (`.agents/skills/ui-ux-pro-max/SKILL.md`, Python `3.11.5`)
- **Tài liệu liên quan:**
  - [Frontend Re-audit Report & Assessment Matrix](frontend-reaudit-report.md)
  - [Design System V2 (Proposed)](../../design/frontend/design-system.md)
  - [Component Inventory](../../design/frontend/component-inventory.md)
  - [Screen Specifications](../../design/frontend/screen-specifications.md)
  - [Sprint 08 & Refinement Backlog](../../sprints/sprint-08-frontend-collaboration-quality/README.md)
  - [Task Dependency Graph](../../sprints/sprint-06-frontend-redesign/task-dependencies.md)

---

## 1. Mục tiêu & Phạm vi

Thực hiện kiểm toán lại toàn bộ frontend đã hoàn thành từ `REDESIGN-01` đến `REDESIGN-11` (và `ENV-01`) sau khi tích hợp `ui-ux-pro-max` Skill, thiết lập Design System V2 thống nhất, đề xuất nhánh Refinement (`REFINE-01..07`) và đồng bộ đặc tả cho các task còn lại (`REDESIGN-12..16`).

**Nguyên tắc bảo toàn:**
- Giữ nguyên lịch sử và trạng thái hoàn thành ban đầu của `REDESIGN-01..11` và các báo cáo lịch sử.
- Bảo toàn 100% API thật, auth in-memory + HttpOnly refresh cookie, optimistic locking (`version` / 409) và kiến trúc Feature-based Frontend / Clean Architecture Backend.
- Không đề xuất rebuild toàn bộ frontend (`0 REBUILD`, chỉ `1 KEEP` UI [`REDESIGN-05`] + `2 KEEP` docs/env [`REDESIGN-01`, `ENV-01`], `7 REFINE`, `2 REFACTOR` [`REDESIGN-03`, `REDESIGN-10`]).

---

## 2. Phát hiện trọng yếu cần ưu tiên xử lý

1. **Lỗi kiến trúc & rò rỉ dữ liệu:**
   - `TaskDetailPage` đang được export từ `frontend/src/features/task/components/TaskDetailDrawer.tsx` thay vì `frontend/src/pages/task/TaskDetailPage.tsx`.
   - `NotificationBell.tsx` (đang mount ở `AppShellLayout`) đọc thẳng `mockNotifications` không có guard `import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'`.
   - 5 file stub `// TODO` chết (`WorkspaceMembersTable.tsx`, `InviteMemberModal.tsx`, `ProjectMembersPanel.tsx`, `KanbanColumn.tsx`, `NotificationInbox.tsx`).
2. **Lỗi Visual & Component Consistency:**
   - Dùng `border` trơn trong Tailwind v4 (`TaskDetailDrawer`, `TaskForm`, `SubtaskList`) làm render viền đen `#0f172a` thay vì `border-border`.
   - Lặp inline Avatar ở 5 nơi và native `<select>` + `selectClass` cục bộ ở 8 nơi; thiếu shared `Select`, `Textarea`, `Avatar`, `StatusBadge`, `PriorityBadge`, `ConfirmDialog`.
   - `TaskForm` luôn mở sẵn trong card lồng 3 tầng ở Subtasks; `SubtaskList` dùng `break-all`; `KanbanCard` luôn hiện `<select>` + `[↑][↓]` rớt dòng trên mobile 390px và bị dual vertical scrollbar.
   - Live Dashboard (`after-live-1440.png`) chỉ có 1 card đơn độc, bỏ trống ~75% màn hình dù API `listProjects` đã sẵn sàng.
   - Default `Button`/`Input` cao `44px` (`h-11`), card dùng lẫn `rounded-xl` (12px) và `rounded` (4px) thay vì chuẩn `8px` (`--radius-md`).
3. **Nợ kỹ thuật chất lượng & hiệu năng:**
   - `npm run lint` còn 2 warnings `react-refresh/only-export-components` (`button.tsx`, `tabs.tsx`).
   - `npm run build` cảnh báo main bundle `715.32 kB` (> 500 kB) vì chưa có route-level `React.lazy`.
   - `workspace-ui.test.tsx` còn stderr `act(...)` warnings và `Query data cannot be undefined`.
   - Contrast toàn màn hình, 200% text zoom và `prefers-reduced-motion` bị đánh dấu `NOT VERIFIED` trong các báo cáo `REDESIGN-06/08/09/10/11`.

---

## 3. Kế hoạch Refinement & Quản lý Sức chứa (Solo Developer)

- **Sức chứa chuẩn:** 15–20 giờ/tuần (~30–40 giờ / sprint 2 tuần).
- **Refinement Workstream (`Timebox R` đề xuất tách riêng):**
  - `REFINE-01` (2h) + `REFINE-02` (4h): *IN_REVIEW* (hoàn tất tài liệu audit/planning trong phiên này).
  - `REFINE-03` — Design System V2 Enhancement: **4h** (P0)
  - `REFINE-04` — Shared Components & Application Shell Refinement: **7h** (P0)
  - `REFINE-05A` — Dashboard, Workspace & Projects Refinement: **5h** (P1)
  - `REFINE-05B` — Tasks, Kanban & Task Detail Refactoring: **6h** (P0)
  - `REFINE-06` — Collaboration UI Refinement: **4h** (P1)
  - `REFINE-07` — Regression Testing & Visual QA: **5h** (P0)
  - **Tổng khối lượng triển khai Refinement:** **31 giờ** (~2 tuần).
- **Tác động lên Sprint 08 (`Timebox C`):**
  - `REDESIGN-12..16` (32 giờ còn lại) phụ thuộc vào `REFINE-03` & `REFINE-04` (và `REFINE-07` cho QA cuối). Tách Timebox R trước khi chạy tiếp Timebox C giúp tránh nhồi 63 giờ vào một sprint 2 tuần.

---

## 4. Chiến lược Kiểm thử & Baseline (Testing Strategy)

### 4.1 Baseline đã đo (2026-11-28)
- `npm --prefix frontend run typecheck` → `PASSED` (0 errors)
- `npm --prefix frontend run lint` → `PASSED` (0 errors, 2 Fast Refresh warnings)
- `npm --prefix frontend run format` → `PASSED`
- `npm --prefix frontend run test` → `PASSED` (14 files, 93 tests; `workspace-ui.test.tsx` có stderr warnings)
- `npm --prefix frontend run build` → `PASSED` (`dist/assets/index-CUjsTEHY.js` 715.32 kB, > 500 kB warning)
- Browser screenshots: đã đối chiếu trực tiếp bộ evidence tại `docs/reports/frontend-redesign/evidence/redesign-02..11`. Live headless browser mới chưa chạy trong phiên planning (đánh dấu `NOT VERIFIED` cho live runtime checks cho đến `REFINE-07`).

### 4.2 Ma trận kiểm chứng bắt buộc khi triển khai Refinement
1. **Static & Build Gates:** `typecheck`, `lint` (mục tiêu 0 warnings), `format`, `build` (bundle split < 500 kB main chunk).
2. **Automated RTL / Unit Tests:**
   - Auth (`auth-flow`, `auth-session-client`, `protected-routes`).
   - Shared UI (`shared-components`, tests cho `Select`, `Textarea`, `Avatar`, `ConfirmDialog`, `StatusBadge`, `PriorityBadge`).
   - Shell & Routes (`app-shell`, lazy route fallback).
   - Core features (`dashboard` Live + Demo on/off, `workspace-ui` 0 stderr warnings, `project-ui`, `task-ui`, `kanban-board` 409 conflict & focus restore, `collaboration-ui` 413/422 & mention).
3. **Browser, Responsive & Accessibility QA (`REFINE-07`):**
   - Kiểm tra thật trên trình duyệt với backend + PostgreSQL test (và fake storage cho upload).
   - Viewport matrix: `360, 390, 768, 1024, 1280, 1440, 1920px` (`scrollWidth <= viewport + 1px`).
   - Accessibility: Keyboard-only end-to-end, `focus-not-obscured`, dialog trap/return, contrast `>= 4.5:1` / `>= 3:1`, `200%` text zoom, `prefers-reduced-motion`.
   - Visual before/after: chụp và đối chiếu ảnh trước/sau khi refine (khử PII).

---

## 5. Bước tiếp theo đề xuất

Chờ Developer Review và phê duyệt tài liệu planning này cùng [Design System V2](../../design/frontend/design-system.md). Sau khi được duyệt, task triển khai đầu tiên được phép thực hiện là **`REFINE-03 — Design System V2 Enhancement`**.
