# REDESIGN-15 — Responsive Design & Accessibility

## 1. Thông tin Task

- **Task ID**: `REDESIGN-15`
- **Tên Task**: Responsive Design & Accessibility
- **Sprint**: Sprint 08 · Frontend Redesign · Collaboration & Quality (Timebox C)
- **Ngày triển khai**: 2026-11-28
- **Trạng thái**: `COMPLETED`
- **Yêu cầu liên quan**: [Task REDESIGN-15](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-15-responsive-accessibility.md), [Design System V2](../../design/frontend/design-system.md), [Screen Specs](../../design/frontend/screen-specifications.md), [Acceptance Criteria](../../sprints/sprint-06-frontend-redesign/acceptance-criteria.md)
- **Loại báo cáo và nguồn bằng chứng**: Báo cáo kiểm định responsive và WCAG 2.2 AA toàn ứng dụng (từ kết quả Chrome DevTools MCP, Lighthouse Audit và RTL keyboard/focus tests).

## 2. Tóm tắt triển khai

- Kiểm tra responsive layout trên ma trận viewport di động đến màn hình rộng (`360x800`, `390x844`, `1440x900`, `1920x1080`, kèm kiểm tra reflow `320x640`).
- Kiểm định accessibility theo mục tiêu WCAG 2.2 AA: cấu trúc semantic (`<dl>/<dt>/<dd>`, thứ tự heading `h1` -> `h2` -> `h3`), accessible name (`WorkspaceSwitcher` WCAG 2.5.3), focus management & focus return (`Escape` trên Dialogs và Mobile Navigation Drawer), skip-to-content link với `scroll-padding-top`, nhãn & `id`/`name` cho form fields, và `prefers-reduced-motion: reduce`.
- Chạy Lighthouse Desktop Audit sau các bản sửa cuối cùng và đạt **Accessibility 100 / 100** và **Best Practices 100 / 100**.

## 3. File thay đổi

Các chỉnh sửa kỹ thuật phục vụ responsive và accessibility đã được thực hiện trong nhánh `REFINE-03..07` và `REDESIGN-12..14`:

| File | Action | Description |
|---|---|---|
| `frontend/src/styles/index.css` | Modified | Token màu tương phản WCAG AA, `scroll-padding-top: var(--topbar-height)` cho `#main-content`, hệ thống z-index 6 tầng. |
| `frontend/src/components/common/EmptyState.tsx` | Modified | Hỗ trợ `headingLevel` (`h2` / `h3`) giữ đúng phân cấp heading trên trang con. |
| `frontend/src/features/dashboard/components/StatCard.tsx` | Modified | Sửa cấu trúc semantic `<dl>` -> `<dt>` + `<dd>`. |
| `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` | Modified | Đạt WCAG 2.5.3 `label-content-name-mismatch` trên trigger button. |
| `frontend/src/features/board/components/KanbanCard.tsx` | Modified | Điều khiển đổi cột/thứ tự nằm gọn trên 1 hàng ở mobile `360px–390px`, thêm `name` attribute. |
| `frontend/src/features/collaboration/components/CommentSection.tsx` & `AttachmentUploader.tsx` | Modified | Bổ sung `id`/`name` cho toàn bộ form controls. |
| `frontend/src/features/ai/components/AiBriefForm.tsx` & `AiPlanDraftEditor.tsx` | Modified | Bổ sung `id`/`name` cho các ô nhập brief và chỉnh sửa task draft. |

## 4. Quyết định kỹ thuật

- **Tách điều khiển Kanban tương thích bàn phím trên mobile (`360px–390px`)**: Giữ nguyên `<Select>` chọn cột và nút lên/xuống trên một hàng flex (`flex-nowrap`), đảm bảo người dùng bàn phím hoặc touch không phụ thuộc hoàn toàn vào drag-and-drop.
- **Giữ bảng màu Light chuẩn mặc định**: Vì ứng dụng chưa bật `@media (prefers-color-scheme: dark)` CSS overrides, chế độ dark emulation giữ nguyên token nền sáng (`#f8fafc` / `#ffffff` / `#0f172a`) để đảm bảo độ tương phản đồng nhất và không phát sinh chữ chìm trên card.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Lighthouse Accessibility (`navigation`, Desktop) | `/dashboard` -> Accessibility `100`, Best Practices `100`, `0` failed accessibility rules | `PASSED` |
| Heading hierarchy & landmarks | Accessibility snapshot trên `/dashboard`: `h1` -> `h2` -> `h3`; skip link & `#main-content` hoạt động | `PASSED` |
| Keyboard trap & focus return | RTL (`app-shell.test.tsx`, `shared-components.test.tsx`) + Chrome live: `Escape` trên Invite Dialog và Mobile Drawer trả focus về nút mở | `PASSED` |
| Mobile viewport (`360x800`, `390x844`) | Không tràn ngang trên `/dashboard`, `/my-tasks`, `/projects/:id/tasks`, `/projects/:id/board`, `/settings/profile` ([Kanban 360px](evidence/refine/07-kanban-mobile-360.png)) | `PASSED` |
| Desktop & Ultrawide (`1440x900`, `1920x1080`) | Dashboard, Workspace, Projects, Kanban và Task Detail căn chỉnh hợp lý, không có khoảng trống thừa | `PASSED` |
| `prefers-reduced-motion: reduce` | Bật `reduce` qua Chrome DevTools emulation -> không lỗi transition/animation kẹt | `PASSED` |
| Form fields `id`/`name` & DevTools Issues | `0` cảnh báo `form field element should have an id or name` trên `/tasks/:id`, `/ai/planner`, `/workspaces` | `PASSED` |
| Automated unit + RTL suite | `npm --prefix frontend run test` -> `16/16` files, `97/97` tests pass | `PASSED` |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Document không tràn ngang trên viewport đích | `PASSED` | Kiểm chứng `360px`, `390px`, `1440px`, `1920px`. Ghi nhận lưu ý cắt mép phải nút chuông trong ảnh chụp giả lập `320x640` DPI 150%. |
| Focus không bị che khuất (`scroll-padding-top`) và focus return đúng chuẩn | `PASSED` | `#main-content` có `scroll-padding-top`; `Escape` trả focus trên cả Dialog và Mobile Drawer. |
| Mọi flow chính có đường đi bằng bàn phím | `PASSED` | Auth, Switcher, Projects, Tasks, Kanban column select + reorder, Comments, AI Planner, Notifications đều thao tác được bằng bàn phím. |

## 7. Vấn đề và blocker

- Ở chiều rộng cực hẹp `320x640` với `deviceScaleFactor: 1` trên màn hình Windows DPI 150%, icon chuông bên phải topbar bị chạm sát/cắt mép phải trong ảnh chụp dù CSS `header`/`main` đo `320px`; ở `360x800` và `390x844` hiển thị trọn vẹn.
- Chế độ Dark Theme hoàn chỉnh chưa được kích hoạt ở CSS media query (token dark chỉ chuẩn bị sẵn theo Design System V2).

## 8. Ghi chú cho developer

- Có thể kiểm chứng lại Lighthouse bất kỳ lúc nào trên `/dashboard` sau khi đăng nhập (Accessibility hiện đạt `100/100`).
- Các tiêu chí responsive và accessibility mới bổ sung sẽ được bảo vệ hồi quy bởi `app-shell.test.tsx`, `shared-components.test.tsx` và `kanban-board.test.tsx`.

## 9. Task tiếp theo

- Hoàn tất đối chiếu tổng hợp tại [REDESIGN-16](REDESIGN-16-visual-qa.md).
