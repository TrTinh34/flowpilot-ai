# REDESIGN-04 — Application Shell & Navigation

## 1. Thông tin Task

- Sprint 06 · Timebox A · 2026-11-27 · COMPLETED
- Baseline shell `215750b`.

## 2. Tóm tắt triển khai

Shell có navigation theo nhóm, workspace switcher, breadcrumb theo route, menu tài khoản và notification indicator. Desktop có sidebar 240px và rail 64px. Mobile dùng drawer. Projects, task lists, Kanban và Dashboard dùng chiều rộng workspace. Notifications và Profile có chiều rộng đọc riêng.

## 3. File thay đổi

- `frontend/src/layouts/AppShellLayout.tsx`, `frontend/src/layouts/useShellContext.ts` chứa layout và context theo route.
- `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` dùng Radix và context shell.
- `frontend/src/features/notification/components/NotificationBell.tsx` giới hạn chiều rộng popover và hỗ trợ Escape.
- Các protected page dùng một main landmark do shell sở hữu và gutter của Design System.
- `frontend/tests/integration/app-shell.test.tsx` kiểm tra navigation, history, cache, drawer, skip link và rail.

## 4. Quyết định kỹ thuật

Dùng Radix Dialog cho drawer. Đổi route làm đóng drawer, Escape trả focus. Breadcrumb đọc tên project/task từ cache theo phiên do page sở hữu. Shell chỉ tải directory workspace. Project shortcuts dựa trên project hiện có quyền đọc. Breadcrumb và link Projects theo workspace trên URL khi người dùng chuyển workspace hoặc quay lại.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Frontend | PASSED · typecheck, lint, format, build và 82 test |
| Edge responsive | PASSED · Projects với fixture tại 360, 390, 768, 1024, 1280, 1440 và 1920px. Document và vùng main không tràn |
| Keyboard và drawer | PASSED · RTL kiểm tra mở bằng bàn phím, đóng khi đổi route, Back, Escape và skip link. Edge xác nhận focus restore, sidebar 240px và rail 64px |
| Notification popup | PASSED · Edge đo biên ngang 24–344px tại viewport 360px |
| Route và permission context | PASSED · RTL xác minh switch workspace, Back, aria-current và cache project/task không tạo request mới |
| My Tasks sau ENV-01 | PASSED · Edge 360px render empty state từ HTTP 200 trên API development |

[Shell trước ở 1440px](evidence/redesign-04/before-shell-1440.png) · [Shell sau ở 1440px](evidence/redesign-04/after-shell-1440.png) · [Shell sau ở 1920px](evidence/redesign-04/after-shell-1920.png) · [Drawer ở 390px](evidence/redesign-04/after-drawer-390.png).

## 6. Acceptance Criteria

Một main landmark ở màn protected. Keyboard drawer đạt, route history giữ breadcrumb theo URL, project shortcuts dùng dữ liệu page query đã đọc, workspace-wide views dùng không gian còn lại.

## 7. Vấn đề và blocker

Ảnh so sánh dùng fixture cho workspace/project. Kiểm tra My Tasks dùng request thật với token kiểm thử giữ trong bộ nhớ. Lint còn hai cảnh báo Fast Refresh và build còn cảnh báo chunk lớn. Visual review toàn bộ màn hình thuộc các timebox sau. Chưa chạy CI remote cho hai commit của phiên này.

## 8. Ghi chú cho developer

[Application Shell Spec](../../design/frontend/application-shell.md) ghi breakpoint, vùng nội dung và navigation contract.

## 9. Task tiếp theo

Timebox A đã hoàn thành sau ENV-01 và REDESIGN-04. REDESIGN-05 thuộc đợt Core flows kế tiếp.
