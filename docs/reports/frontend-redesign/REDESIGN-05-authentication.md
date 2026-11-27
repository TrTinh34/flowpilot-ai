# REDESIGN-05 — Authentication Pages

## 1. Thông tin Task

- Sprint 07 · Timebox B · 2026-11-28 · COMPLETED
- Baseline `72ebef1`.

## 2. Tóm tắt triển khai

Login và Register dùng AuthLayout full viewport, form tối đa 420px, và brand panel mẫu trên desktop. Trên mobile dùng một cột với gutter của Design System.

## 3. File thay đổi

- `frontend/src/layouts/AuthLayout.tsx`, `AuthHeroPanel.tsx` chỉnh responsive layout và phần giới thiệu.
- `AuthField.tsx`, `PasswordField.tsx`, `LoginForm.tsx`, `RegisterForm.tsx` dùng FieldLabel, lỗi theo trường và nút hiện mật khẩu có nhãn.
- `FormErrorBanner.tsx` nhận focus khi API trả lỗi.
- `frontend/tests/integration/auth-flow.test.tsx` kiểm tra focus và submit lặp.

## 4. Quyết định kỹ thuật

Dùng token Indigo hiện có cho brand panel. Nút hiện mật khẩu rộng 44px, giữ autocomplete và ngữ nghĩa input. Dùng guard đồng bộ khi submit và read-only trong lúc gửi để giữ focus và dữ liệu. React Hook Form, Zod schema, API client và quản lý session giữ contract hiện hành.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Frontend | PASSED · typecheck, lint, format, build và 82 test |
| PostgreSQL backend regression | PASSED · 41 test tích hợp |
| Edge layout | PASSED · Login và Register tại 360, 390, 1440px. Document width bằng viewport |
| Edge keyboard | PASSED · focus trường lỗi đầu tiên, Tab và Space hiện/ẩn mật khẩu ở 360px |
| Edge + backend + PostgreSQL test | PASSED · Register 201, sai mật khẩu 401 với focus trên banner, Login 200, reload refresh 200, logout 204 và quay về Login |

| Màn hình | 360px | 1440px |
|---|---|---|
| Login | [Trước](evidence/redesign-05/before-login-360.png) · [Sau](evidence/redesign-05/after-login-360.png) | [Trước](evidence/redesign-05/before-login-1440.png) · [Sau](evidence/redesign-05/after-login-1440.png) |
| Register | [Trước](evidence/redesign-05/before-register-360.png) · [Sau](evidence/redesign-05/after-register-360.png) | [Trước](evidence/redesign-05/before-register-1440.png) · [Sau](evidence/redesign-05/after-register-1440.png) |

## 6. Acceptance Criteria

- Form vừa 360px và có thể hoàn thành đăng ký, đăng nhập với backend thật trong môi trường test.
- Lỗi client đưa focus đến trường đầu tiên. Lỗi API hiển thị và đưa focus lên banner. Thành công đăng ký đưa focus lên tiêu đề.
- Submit lặp trong lúc pending bị chặn. Refresh và logout đã xác minh qua HTTP và route trình duyệt.

## 7. Vấn đề và blocker

Hai cảnh báo Fast Refresh và cảnh báo chunk lớn vẫn xuất hiện. Kiểm thử Edge dùng user fixture trên PostgreSQL test và đã dọn sau kiểm tra.

## 8. Ghi chú cho developer

Ảnh so sánh dùng form trống. Brand panel minh họa một sprint board và không tạo request dữ liệu.

## 9. Task tiếp theo

REDESIGN-07 — Workspace & Member Management. REDESIGN-06 Dashboard có dependency độc lập.
