# REDESIGN-02 — Design System & Theme Enhancement

## 1. Thông tin Task

- Sprint 06 · 2026-11-27 · COMPLETED
- Baseline `cc5a0ea`. Yêu cầu triển khai được dùng làm phê duyệt áp dụng palette và tokens trong phạm vi REDESIGN-02.

## 2. Tóm tắt triển khai

Đưa màu, typography, spacing, focus và motion vào CSS variables. Button, Input, Card, Tabs và liên kết của form Auth dùng token dùng chung.

## 3. File thay đổi

- `frontend/src/styles/index.css` chứa palette, alias Tailwind và biến responsive.
- `frontend/src/components/ui/` áp token cho Button, Input, Card và Tabs.
- `frontend/src/features/auth/components/` áp token cho liên kết qua lại Login và Register.
- [Design System](../../design/frontend/design-system.md) ghi mapping token và component.

## 4. Quyết định kỹ thuật

Indigo #6366F1 dùng cho nhận diện. Primary button dùng #4F46E5, hover #4338CA và active #3730A3 để tách ba trạng thái. Gutter 16/24/32px sẵn cho shell ở task sau. Các alias Dark vẫn theo class `.dark`.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Frontend | PASSED · typecheck, lint, format, 74 test và production build |
| Login render | PASSED · Edge tại 360, 390, 768, 1024, 1280, 1440 và 1920px. Document width bằng viewport |
| Text zoom | PASSED · Edge, root text 200% ở viewport 720px, không tràn ngang |
| Component preview | PASSED · Button/Input/Card/Tabs, outline 2px với offset 2px, đổi tab bằng phím mũi tên, reduced motion và alias Dark |

Ảnh Login 390px [trước](evidence/redesign-02/before-login-390.png) · [sau](evidence/redesign-02/after-login-390.png). Ảnh 1440px [trước](evidence/redesign-02/before-login-1440.png) · [sau](evidence/redesign-02/after-login-1440.png).

## 6. Acceptance Criteria

| Cặp token Light | Contrast |
|---|---:|
| Chữ trắng / primary mặc định, hover, active | 6,29:1 / 7,90:1 / 9,93:1 |
| Chữ phụ / surface trắng và inset | 7,58:1 / 6,92:1 |
| Viền control / surface trắng | 4,76:1 |
| Focus / canvas | 6,01:1 |
| Chữ semantic / nền success, warning, danger, info | 6,49:1 / 6,37:1 / 5,30:1 / 5,49:1 |
| Chữ AI / surface trắng | 7,10:1 |

Các cặp đã đo đạt ngưỡng 4,5:1 cho chữ thường và 3:1 cho control. Các component và form chỉnh trong task dùng alias cho màu mới.

## 7. Vấn đề và blocker

Lint còn hai cảnh báo Fast Refresh có sẵn. Build cảnh báo bundle trên 500 kB. Visual review toàn bộ màn protected và kiểm tra accessibility toàn ứng dụng thuộc các task sau.

## 8. Ghi chú cho developer

Dùng `px-page-gutter` khi áp gutter cho shell. Các hành vi form và routing tiếp tục đi qua implementation hiện có.

## 9. Task tiếp theo

REDESIGN-03 — Shared UI Components.
