# REDESIGN-16 — Frontend Integration & Visual QA

## 1. Thông tin Task

- **Task ID**: `REDESIGN-16`
- **Tên Task**: Frontend Integration & Visual QA
- **Sprint**: Sprint 08 · Frontend Redesign · Collaboration & Quality (Timebox C)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task REDESIGN-16](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-16-visual-qa.md), [Acceptance Criteria](../../sprints/sprint-06-frontend-redesign/acceptance-criteria.md), [Design System V2](../../design/frontend/design-system.md), [Implementation Report REFINE-03..06](REFINE-03-to-06-implementation.md)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo nghiệm thu tổng thể cuối phase Frontend Redesign & Refinement (Live API + Demo flag + Production bundle + Visual comparison).

## 2. Tóm tắt triển khai

- Kiểm chứng tích hợp end-to-end toàn bộ 13 màn hình/luồng chính (`REDESIGN-05..14` và `REFINE-03..06`) trên trình duyệt Chrome thật với backend `http://localhost:3000` và PostgreSQL test/dev.
- Đối chiếu giao diện trước refinement (`evidence/redesign-04..11/`) với bộ 13 ảnh chụp mới sau refinement (`evidence/refine/`), xác nhận đồng bộ Design System V2 trên mọi route.
- Xác nhận Production Build (`vite build`) có kích thước main bundle dưới 500 kB (`498.48 kB`), `0` chunk warnings và `0` tham chiếu tới mock fixtures (`dashboard-demo`, `notifications`, `ai-demo`) trong `dist/assets/*.js`.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `docs/reports/frontend-redesign/evidence/refine/01-login-desktop.png` .. `13-profile-desktop.png` | Added | 13 ảnh chụp nghiệm thu toàn bộ màn hình cốt lõi ở desktop (`1440x900`) và mobile Kanban (`360x800`). |
| `docs/reports/frontend-redesign/REFINE-07-regression-visual-qa.md` | Added | Báo cáo cổng hồi quy sau refinement. |
| `docs/reports/frontend-redesign/REDESIGN-15-responsive-accessibility.md` | Added | Báo cáo kiểm chứng responsive & WCAG 2.2 AA. |
| `docs/reports/frontend-redesign/REDESIGN-16-visual-qa.md` | Added | Báo cáo nghiệm thu tổng thể cuối Sprint 08. |
| `docs/sprints/sprint-08-frontend-collaboration-quality/README.md` | Modified | Đồng bộ hoàn thành `REDESIGN-15`, `REDESIGN-16` (`6/6`) và `REFINE-07` (`COMPLETED`). |
| `docs/sprints/README.md`, `docs/reports/README.md`, `docs/07-Backlog-Roadmap.md` | Modified | Đồng bộ tiến độ và liên kết báo cáo Sprint 08 & Timebox R. |

## 4. Quyết định kỹ thuật

- **Tách riêng thư mục ảnh nghiệm thu `evidence/refine/`**: Bảo toàn nguyên vẹn ảnh baseline `evidence/redesign-04..11/` theo quy tắc giữ lịch sử Sprint, đồng thời cung cấp bộ ảnh đối chiếu before/after sạch PII (chỉ sử dụng tài khoản thử nghiệm `qa.refine.84729@flowpilot.test`).
- **Giữ nguyên cấu trúc bundle tách theo route (`React.lazy`)**: Đưa kích thước entry chunk `index-*.js` xuống `498.48 kB` (`gzip 154.90 kB`), tránh cảnh báo 500 kB của Vite và tách riêng các chunk trang chi tiết (`TaskDetailPage`, `AiPlannerPage`, `ProjectBoardPage`).

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prettier (`format:write`) | `npm --prefix frontend run format:write` | `PASSED` |
| TypeScript (`typecheck`) | `npm --prefix frontend run typecheck` (`0` errors) | `PASSED` |
| ESLint (`lint`) | `npm --prefix frontend run lint` (`0` errors, `0` warnings) | `PASSED` |
| Unit & RTL Integration (`test`) | `npm --prefix frontend run test` (`16/16` files, `97/97` tests) | `PASSED` |
| Production build & bundle check | `npm --prefix frontend run build` (`index-DINg2tgW.js` = `498.48 kB`, `0` fixture matches in `dist/assets/*.js`) | `PASSED` |
| Auth & Protected Routes (Live) | [Login](evidence/refine/01-login-desktop.png): sai mật khẩu trả banner `401`, đăng ký/đăng nhập + refresh `200`, chặn redirect khi chưa đăng nhập | `PASSED` |
| Dashboard (Live + Demo) | [Dashboard](evidence/refine/02-dashboard-desktop.png): số liệu thật đồng bộ với My Tasks & Projects, nhãn `Demo` tách bạch khi `DEV && VITE_USE_MOCK_API === 'true'` | `PASSED` |
| Workspaces & Projects (Live) | [Workspaces](evidence/refine/03-workspaces-desktop.png) & [Projects](evidence/refine/04-projects-desktop.png): tạo workspace `"QA Refinement Studio"`, tạo project `"QA Launch"`, lọc theo tên/trạng thái | `PASSED` |
| My Tasks, Kanban & Persistence (Live) | [My Tasks](evidence/refine/05-my-tasks-desktop.png), [Kanban Desktop](evidence/refine/06-kanban-desktop.png), [Kanban 360px](evidence/refine/07-kanban-mobile-360.png): chuyển cột và reload trang vẫn giữ trạng thái mới | `PASSED` |
| Task Detail & Collaboration (Live) | [Details](evidence/refine/08-task-detail-desktop.png), [Comments](evidence/refine/09-task-comments-desktop.png), [Attachments](evidence/refine/10-task-attachments-desktop.png): tạo subtask, đăng comment mới, kiểm tra dropzone upload | `PASSED` |
| Notifications, AI Planner & Profile | [Notifications](evidence/refine/11-notifications-desktop.png), [AI Planner](evidence/refine/12-ai-planner-draft-desktop.png), [Profile](evidence/refine/13-profile-desktop.png): đồng bộ badge bell `2 -> 1`, 4 bước AI draft + ConfirmDialog, Profile read-only | `PASSED` |
| Lighthouse Audit (`/dashboard`) | Accessibility `100`, Best Practices `100`, SEO `91` | `PASSED` |
| GitHub Actions CI & Git push | Chưa thực hiện commit/push theo quy trình chờ Developer Review | `NOT VERIFIED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Mỗi screen (`REDESIGN-05..14` + `REFINE-03..06`) có before/after và kiểm tra states/error | `PASSED` | Baseline tại `evidence/redesign-04..11/` và bản mới tại `evidence/refine/01..13*.png`. |
| Kiểm tra Live vs Demo mode (production không lộ mock fixture ở Notifications/Dashboard/AI) | `PASSED` | `0` matches cho các chuỗi fixture mock trong `frontend/dist/assets/*.js`; test RTL kiểm tra cả `DEV=false`. |
| Zero lỗi P0/P1 mở, zero ESLint warnings, bundle check đạt | `PASSED` | `0` ESLint warnings, `498.48 kB` main chunk, `0` lỗi console/network ngoài `401` refresh khi chưa đăng nhập. |

## 7. Vấn đề và blocker

- Backend test suite và CI pipeline trên GitHub Actions chưa được chạy trong phạm vi tác vụ frontend này (chờ Developer Review và commit/push).
- Không có lỗi P0 hoặc P1 mở trên toàn bộ frontend.

## 8. Ghi chú cho developer

- Bộ tài liệu thiết kế chuẩn hóa nằm tại [design-system.md](../../design/frontend/design-system.md), [component-inventory.md](../../design/frontend/component-inventory.md) và [screen-specifications.md](../../design/frontend/screen-specifications.md).
- Khi Developer Review xong, toàn bộ thay đổi hiện có trong working tree sẵn sàng để review và commit theo từng nhóm/task.

## 9. Task tiếp theo

- **Developer sign-off & Review** toàn bộ Timebox R (`REFINE-01..07`) và Sprint 08 (`REDESIGN-12..16`).
