# REDESIGN-08 — Project Management

## 1. Thông tin Task

- Sprint 07 · Timebox B
- Ngày triển khai — 2026-11-28
- Trạng thái — COMPLETED
- Phạm vi — Projects và Project Settings
- Nguồn bằng chứng — RTL, Edge và API local với PostgreSQL test

## 2. Tóm tắt triển khai

Projects hiển thị dạng card responsive. Project Settings hiển thị thành viên, vai trò, quyền quản lý và xác nhận archive bằng dialog.

## 3. File thay đổi

- `frontend/src/features/project/components/ProjectCard.tsx`
- `frontend/src/features/project/components/ProjectSettings.tsx`
- `frontend/src/features/project/components/ProjectsForWorkspace.tsx`
- `frontend/src/pages/project/ProjectsPage.tsx`
- `frontend/src/pages/project/ProjectSettingsPage.tsx`
- `frontend/tests/integration/project-ui.test.tsx`
- `frontend/tests/integration/shared-components.test.tsx`

## 4. Quyết định kỹ thuật

Lọc tên và trạng thái trên trang API đang mở. Giữ `managerId`, quyền Owner/Admin để tạo và quyền quản lý dự án từ API.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng | Kết quả |
|---|---|---|
| Frontend | `typecheck`, `lint`, `format`, `test` (88 test), `build` | PASSED |
| Backend | `npm --prefix backend run test:integration` (41 test) | PASSED |
| RTL | RTL kiểm tra draft, chống submit lặp, trạng thái archived, lọc và xác nhận archive. | PASSED |
| Edge + PostgreSQL | Owner tạo project và thấy project mới trong danh sách. Member xem project và settings, không có Create/Archive. | PASSED |
| Responsive | Root không tràn ngang ở 360, 390, 768, 1024, 1280, 1440 và 1920 px. | PASSED |

Ảnh dùng cùng dữ liệu test. Bản trước lấy source đã commit tại `a6c1d82`.

| Màn hình và chiều rộng | Trước | Sau |
|---|---|---|
| projects-390 px | [Trước](evidence/redesign-08/before-projects-390.png) | [Sau](evidence/redesign-08/after-projects-390.png) |
| projects-1440 px | [Trước](evidence/redesign-08/before-projects-1440.png) | [Sau](evidence/redesign-08/after-projects-1440.png) |
| projects-1920 px | [Trước](evidence/redesign-08/before-projects-1920.png) | [Sau](evidence/redesign-08/after-projects-1920.png) |
| settings-390 px | [Trước](evidence/redesign-08/before-settings-390.png) | [Sau](evidence/redesign-08/after-settings-390.png) |
| settings-1440 px | [Trước](evidence/redesign-08/before-settings-1440.png) | [Sau](evidence/redesign-08/after-settings-1440.png) |

## 6. Tiêu chí nghiệm thu

| Tiêu chí | Kết quả |
|---|---|
| Create qua API và danh sách cập nhật; lỗi giữ draft; trang trống bỏ phân trang thừa. | PASSED |
| Kiểm tra tương phản toàn màn hình, zoom 200% và reduced motion theo quality gates | NOT VERIFIED |

## 7. Vấn đề và blocker

Lint có hai cảnh báo Fast Refresh hiện hữu. Build báo chunk JS vượt 500 kB. Developer Review đang chờ.

## 8. Ghi chú cho developer

Tên card mở settings. Nút Tasks và Board mở trực tiếp các màn hình tương ứng.

## 9. Task tiếp theo

REDESIGN-09.
