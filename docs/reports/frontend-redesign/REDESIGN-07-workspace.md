# REDESIGN-07 — Workspace & Member Management

## 1. Thông tin Task

- Sprint 07 · Timebox B · 2026-11-28 · COMPLETED
- Baseline `556aa47`.

## 2. Tóm tắt triển khai

Workspace Settings tách khu vực chọn workspace, members và invitations. Create Workspace và Invite Member dùng dialog. Member rows xếp dọc trên mobile, có avatar chữ cái và badge vai trò.

## 3. File thay đổi

- `WorkspaceSettingsPage.tsx` lắp ghép `WorkspaceSettings.tsx`, nơi dùng shared page states, pagination và action theo membership.
- `WorkspaceFormDialog.tsx`, `WorkspaceMemberRow.tsx` giữ form state và xác nhận thao tác membership.
- `AcceptInvitePage.tsx` lắp ghép `AcceptWorkspaceInvitation.tsx` để xử lý link thiếu token, lỗi API và lời mời hết hạn hoặc không hợp lệ.
- `workspace-ui.test.tsx` kiểm tra Owner, Admin, Member, focus và lỗi.

## 4. Quyết định kỹ thuật

Owner và Admin có thể mời Member, Owner có thêm lựa chọn Admin. Member chỉ có thao tác rời workspace của mình. Owner cuối nhận hướng dẫn chuyển quyền trước khi rời, dựa trên member directory hiện hành. Role change, transfer và remove có dialog xác nhận. API backend tiếp tục kiểm tra quyền và xung đột.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Frontend | PASSED · typecheck, lint, format, 85 test và build |
| RTL | PASSED · quyền Owner/Admin/Member, focus sau Escape, giữ draft khi API lỗi, lời mời không hợp lệ |
| Edge và PostgreSQL test | PASSED · tạo workspace, kiểm tra Owner cuối, gửi invitation test, chấp nhận bằng Member và kiểm tra lại link đã dùng ở 360px |

[Trước 360px](evidence/redesign-07/before-owner-360.png) · [Sau 360px](evidence/redesign-07/after-owner-360.png) · [Trước 1440px](evidence/redesign-07/before-owner-1440.png) · [Sau 1440px](evidence/redesign-07/after-owner-1440.png) · [Dialog lời mời ở 360px](evidence/redesign-07/after-invite-dialog-360.png).

## 6. Acceptance Criteria

Action theo role, Owner cuối được hướng dẫn chuyển quyền, thao tác remove/leave yêu cầu xác nhận. Khi API trả `INVALID_INVITATION`, thông báo hướng dẫn xin link mới và nhận focus.

## 7. Vấn đề và blocker

Ảnh trước dùng dữ liệu mẫu, ảnh sau dùng fixture test. Browser smoke dùng preview link của email adapter test. Lịch sử invitation và email production phụ thuộc chức năng backend. Hai cảnh báo Fast Refresh và cảnh báo chunk lớn vẫn xuất hiện.

## 8. Ghi chú cho developer

Mở Workspace Settings từ sidebar. Quick action New workspace vẫn dùng `/workspaces?create=1` và mở trực tiếp dialog.

## 9. Task tiếp theo

REDESIGN-08 — Project Management.
