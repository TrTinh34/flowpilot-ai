# REDESIGN-14 — Profile & Settings

## 1. Thông tin Task

- **Task ID:** REDESIGN-14
- **Tên Task:** Profile & Settings
- **Sprint:** Sprint 08 · Timebox C
- **Ngày triển khai:** 2026-11-28
- **Trạng thái:** COMPLETED (code + RTL tests `PASSED`; live browser visual QA gộp vào `REFINE-07` / `REDESIGN-15–16`)
- **Yêu cầu liên quan:** [REDESIGN-14 Spec](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-14-settings.md) · [Screen Specs §9](../../design/frontend/screen-specifications.md)
- **Nguồn bằng chứng:** Vitest/RTL, `typecheck`, `lint`, `format`, `build`

## 2. Tóm tắt triển khai

Chuẩn hóa `ProfilePage` theo Design System V2 (`max-w-[760px]`, `PageHeader`, `Avatar`, `Badge`, `<dl>` read-only), loại bỏ việc lặp lại tên/email 2 lần và xóa lời hứa tính năng tương lai, bổ sung liên kết điều hướng thật tới `Workspace settings` (`/workspaces`) và `My Tasks` (`/my-tasks`). Đồng thời hoàn thiện stub `ForbiddenPage.tsx` (`403`) theo đúng token hệ thống.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/pages/settings/ProfilePage.tsx` | Modified | Identity header + read-only `<dl>` không lặp dữ liệu + card điều hướng Workspace settings |
| `frontend/src/pages/errors/ForbiddenPage.tsx` | Modified | Hoàn thiện màn 403 `Access denied` theo Design System V2 |
| `frontend/tests/integration/profile-page.test.tsx` | Created | Kiểm chứng hiển thị read-only không lặp, link Workspace settings, không có action edit giả |

## 4. Quyết định kỹ thuật

- Không gắn nút Edit Profile, đổi mật khẩu hay 2FA vì backend chỉ cung cấp `GET /auth/me` read-only.
- Đặt email với `[overflow-wrap:anywhere]` để không tràn ngang ở viewport `360px`.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Frontend checks | `npm --prefix frontend run typecheck; lint; format; test; build` (16 files, 97 tests, 0 lint warnings) | PASSED |
| Profile integration | `tests/integration/profile-page.test.tsx` (1 test) | PASSED |
| Live browser QA (`360/390px`) | Chưa chạy headless browser mới trong phiên | NOT VERIFIED (`REFINE-07` / `REDESIGN-15–16`) |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Không hiện action edit giả hay lời hứa tính năng | PASSED | Verified qua `profile-page.test.tsx` |
| Link Workspace Settings đúng, không lặp tên/email 2 lần | PASSED | Verified qua `getAllByText(...).toHaveLength(1)` |

## 7. Task tiếp theo

Hoàn tất **`REFINE-07`**, **`REDESIGN-15`** và **`REDESIGN-16`** (Browser, Responsive `360–1920px`, Accessibility WCAG 2.2 AA và Visual QA).
