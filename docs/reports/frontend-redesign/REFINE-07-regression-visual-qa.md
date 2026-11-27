# REFINE-07 — Regression Testing & Visual QA (Post-Refinement Gate)

## 1. Thông tin Task

- **Task ID**: `REFINE-07`
- **Tên Task**: Regression Testing & Visual QA (Post-Refinement Gate)
- **Sprint**: Sprint 08R · Frontend Design Refinement (Timebox R)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task REFINE-07](../../sprints/sprint-06-frontend-redesign/tasks/REFINE-07-regression-visual-qa.md), [Acceptance Criteria](../../sprints/sprint-06-frontend-redesign/acceptance-criteria.md), [Test Plan](../../08-Test-Plan.md), [Implementation Report REFINE-03..06](REFINE-03-to-06-implementation.md)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo hoàn thiện kiểm chứng hồi quy tự động và Live Chrome DevTools QA sau triển khai `REFINE-03..06` và các bản vá accessibility cuối cùng.

## 2. Tóm tắt triển khai

- Hoàn tất cổng kiểm chứng hồi quy tự động (`format:write`, `typecheck`, `lint`, `test`, `build`, quét production bundle) và kiểm thử trình duyệt thật qua Chrome DevTools MCP (`http://localhost:5173/` kết nối backend `http://localhost:3000` và PostgreSQL).
- Phát hiện và khắc phục 4 khiếm khuyết thực tế từ lượt Chrome QA & Lighthouse ban đầu:
  1. Lỗi cấu trúc `<dl>` lồng trong `div` tại `StatCard.tsx` / `DashboardPage.tsx` / `DashboardDemo.tsx` (`definition-list`, `dlitem`).
  2. Lỗi WCAG 2.5.3 `label-content-name-mismatch` tại `WorkspaceSwitcher.tsx` (đã thay bằng `<span className="sr-only">, switch workspace</span>` khi sidebar mở rộng).
  3. Phân cấp heading `h2` lặp trong section tại `EmptyState.tsx` / `DashboardPage.tsx` / `WorkspaceSettings.tsx` (bổ sung prop `headingLevel?: 'h2' | 'h3'`).
  4. Thiếu `id`/`name` trên một số input/select/checkbox và `404 /favicon.ico` (đã thêm `id`/`name` đồng bộ và inline SVG favicon trong `frontend/index.html`).
- Lưu 13 ảnh chụp sau refinement đã khử PII (chỉ dùng tài khoản synthetic `qa.refine.84729@flowpilot.test`) tại [evidence/refine/](evidence/refine/).

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/features/dashboard/components/StatCard.tsx` | Modified | Bọc trực tiếp `<dt>`/`<dd>` trong `<dl>` nội bộ card, sửa lỗi `definition-list`/`dlitem`. |
| `frontend/src/pages/dashboard/DashboardPage.tsx` | Modified | Chuyển grid ngoài sang `<div>` và truyền `headingLevel="h3"` cho `EmptyState` trong section `<h2>`. |
| `frontend/src/features/dashboard/components/DashboardDemo.tsx` | Modified | Chuyển grid ngoài sang `<div>` để khớp cấu trúc `<dl>` của `StatCard`. |
| `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` | Modified | Dùng `aria-label` khi collapsed và `<span className="sr-only">, switch workspace</span>` khi expanded để đạt WCAG 2.5.3. |
| `frontend/tests/integration/app-shell.test.tsx` | Modified | Cập nhật matcher `/Switch workspace/i` tương thích accessible name mới của `WorkspaceSwitcher`. |
| `frontend/src/components/common/EmptyState.tsx` | Modified | Thêm prop `headingLevel?: 'h2' | 'h3'` cho heading ngữ nghĩa. |
| `frontend/src/features/workspace/components/WorkspaceSettings.tsx` | Modified | Thêm `name="workspaceId"` và `headingLevel="h3"` cho empty state nội bộ section. |
| `frontend/src/features/ai/components/AiPlanDraftEditor.tsx` | Modified | Bổ sung `id` và `name` cho ô chỉnh sửa tiêu đề task AI. |
| `frontend/src/features/ai/components/AiBriefForm.tsx` | Modified | Bổ sung `name="projectName"` và `name="description"`. |
| `frontend/src/features/collaboration/components/CommentSection.tsx` | Modified | Bổ sung `id`/`name` cho checkbox mention và `name="body"` cho textarea. |
| `frontend/src/features/collaboration/components/AttachmentUploader.tsx` | Modified | Bổ sung `id={fileInputId}` và `name="attachment"` cho `<input type="file">`. |
| `frontend/src/features/task/components/TaskList.tsx` | Modified | Bổ sung `name` cho các trường lọc `search`, `status`, `priority`. |
| `frontend/src/features/project/components/ProjectsForWorkspace.tsx` | Modified | Bổ sung `name` cho bộ lọc `search`, `status`. |
| `frontend/src/features/board/components/KanbanCard.tsx` | Modified | Bổ sung `name` cho `<Select>` chuyển cột Kanban. |
| `frontend/index.html` | Modified | Thêm inline SVG `<link rel="icon">` loại bỏ lỗi `404 /favicon.ico`. |
| `docs/reports/frontend-redesign/evidence/refine/*.png` | Added | 13 ảnh chụp giao diện sau refinement đã khử PII. |

## 4. Quyết định kỹ thuật

- **Sửa `<dl>` tại `StatCard.tsx` thay vì bỏ `<dl>`**: Giữ nguyên `<dt>`/`<dd>` giúp giữ hợp đồng DOM và RTL query hiện có ở `dashboard.test.tsx` đồng thời tuân thủ spec HTML `<dl>` -> `<dt>` + `<dd>` trực tiếp.
- **Loại bỏ `aria-label` ở trạng thái expanded của `WorkspaceSwitcher`**: Để visible text tên workspace làm hạt nhân của accessible name tự nhiên và bổ sung `<span className="sr-only">, switch workspace</span>`, tránh hoàn toàn xung đột WCAG 2.5.3 (`label-content-name-mismatch`).

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prettier format | `npm --prefix frontend run format:write` | `PASSED` |
| TypeScript check | `npm --prefix frontend run typecheck` (`0` errors) | `PASSED` |
| ESLint check | `npm --prefix frontend run lint` (`0` errors, `0` warnings) | `PASSED` |
| Automated unit + RTL integration tests | `npm --prefix frontend run test` (`16 passed (16)`, `97 passed (97)`) | `PASSED` |
| Production build & chunk size | `npm --prefix frontend run build` (`index-DINg2tgW.js` = `498.48 kB`, gzip `154.90 kB`) | `PASSED` |
| Fixture leak scan (`dist/`) | `Select-String` trên `frontend/dist/assets/*.js` cho mẫu fixture mock -> `0` matches | `PASSED` |
| Live Chrome E2E (`REDESIGN-04..11`) | `/login`, `/register`, `401` banner, `/dashboard`, `/workspaces`, `/projects`, `/tasks`, `/my-tasks`, `/board` move + reload, `/tasks/:id` subtasks/comments/attachments | `PASSED` |
| Lighthouse Desktop Accessibility (`/dashboard`) | Score `100` (tăng từ `92`), `0` lỗi accessibility, Best Practices `100`, SEO `91` | `PASSED` |
| DevTools console & form issues | `0` console errors/warnings và `0` form `id`/`name` issues trên `/tasks/:id`, `/ai/planner`, `/workspaces`; `0` `/favicon.ico` 404 trên `/login` | `PASSED` |
| Backend unit/integration regression | Không chỉnh sửa backend trong phạm vi frontend refinement (`localhost:3000` phục vụ smoke E2E thật) | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| 100% check `typecheck`, `lint` (0 warnings), `format`, `test`, `build` đạt | `PASSED` | Đã chạy lại toàn bộ sau chỉnh sửa cuối cùng. |
| Không còn lỗi P0/P1 mở trên các màn đã refine (`REDESIGN-02..11`) | `PASSED` | Đã xác minh trên cả Vitest/RTL và trình duyệt Chrome thật. |
| Kiểm chứng `contrast / zoom 200% / reduced motion` trước đây bị `NOT VERIFIED` | `PASSED` | Đạt Lighthouse Accessibility `100`, xác minh `prefers-reduced-motion: reduce`, reflow `360px`/`390px`/`1440px`/`1920px`. |

## 7. Vấn đề và blocker

- Tại viewport rất hẹp `320x640` (`deviceScaleFactor: 1` trên màn hình DPI 150%), kích thước CSS của `header` và `main#main-content` là `320px` nhưng phần mép phải nút chuông trên topbar bị sát/cắt nhẹ trong ảnh chụp; `360x800` và `390x844` hiển thị đầy đủ không tràn.
- Lighthouse mục `cumulative-layout-shift` trên `/dashboard` đạt `0.146` (điểm `0.77`, thuộc nhóm Agentic Browsing) do thẻ thống kê tải bất đồng bộ phía trên danh sách.

## 8. Ghi chú cho developer

- Các ảnh baseline cũ lưu tại [evidence/redesign-04..11/](evidence/) và ảnh sau refinement lưu tại [evidence/refine/](evidence/refine/) để đối chiếu before/after.
- `frontend/.env` hiện giữ `VITE_USE_MOCK_API=true` để phục vụ chế độ Demo trong môi trường dev; production build (`npm --prefix frontend run build`) hoàn toàn không đóng gói các fixture demo.

## 9. Task tiếp theo

- Nghiệm thu [REDESIGN-15](REDESIGN-15-responsive-accessibility.md) và [REDESIGN-16](REDESIGN-16-visual-qa.md), trình Developer Review.
