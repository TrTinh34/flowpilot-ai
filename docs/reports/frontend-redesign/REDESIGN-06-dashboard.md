# REDESIGN-06 — Dashboard

## 1. Thông tin Task

- Sprint 07 · Timebox B
- Ngày triển khai — 2026-11-28
- Trạng thái — COMPLETED
- Phạm vi — Dashboard, phần đã có API của FR-DASH-01 và chế độ Demo trong dev
- Bằng chứng — RTL, Edge và API local với PostgreSQL test

## 2. Tóm tắt triển khai

Dashboard mở Projects của workspace đang chọn, danh sách My Tasks và chi tiết task qua các route hiện có. Phần xem trước My Tasks dùng API thật và ưu tiên các task chưa hoàn thành có hạn gần nhất trong trang đầu. Loading, lỗi có Retry và danh sách rỗng có trạng thái riêng.

## 3. File thay đổi

| File | Thay đổi |
|---|---|
| `frontend/src/pages/dashboard/DashboardPage.tsx` | Bố cục, điều hướng và xem trước My Tasks |
| `frontend/src/features/dashboard/api/dashboard-demo.ts` | Adapter tính KPI, progress, deadline và activity |
| `frontend/src/features/dashboard/components/DashboardDemo.tsx`, `StatCard.tsx` | Khu vực có nhãn Demo, KPI dạng 4/2/1 và legend dạng text |
| `frontend/src/mocks/fixtures/dashboard.fixtures.ts` | Dữ liệu project/task dùng chung cho toàn bộ khu vực Demo |
| `frontend/.env.example`, `frontend/tests/integration/dashboard.test.tsx` | Flag mặc định và test mode/quyền truy cập route |

## 4. Quyết định kỹ thuật

KPI và timeline Demo tính từ các task thuộc project mẫu đang active. Deadline và activity mẫu không tạo liên kết tới ID giả. Bật Demo bằng `VITE_USE_MOCK_API=true` khi chạy dev. My Tasks tiếp tục gọi API thật ở cả hai chế độ.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng | Kết quả |
|---|---|---|
| Frontend | 91 test, lint, format và production build kèm TypeScript | PASSED |
| RTL | Demo bật/tắt, production bỏ qua flag, KPI và Retry | PASSED |
| Edge và PostgreSQL | Tải task thật; đi tới Projects, My Tasks và Task Detail ở cả hai chế độ | PASSED |
| Layout | Đo tràn ngang từ 360 đến 1920 px, ảnh ở 390 và 1440 px | PASSED |
| Bundle production | Build với flag Demo bật, kiểm tra chunk và chuỗi đặc trưng của fixture Dashboard | PASSED |

| Viewport | Trước | Sau · Live | Sau · Demo |
|---|---|---|---|
| 390 px | [Ảnh](evidence/redesign-06/before-390.png) | [Ảnh](evidence/redesign-06/after-live-390.png) | [Ảnh](evidence/redesign-06/after-demo-390.png) |
| 1440 px | [Ảnh](evidence/redesign-06/before-1440.png) | [Ảnh](evidence/redesign-06/after-live-1440.png) | [Ảnh](evidence/redesign-06/after-demo-1440.png) |

## 6. Tiêu chí nghiệm thu

| Tiêu chí | Kết quả |
|---|---|
| KPI khớp tập task mẫu, tiêu đề và số đọc được bằng text | PASSED |
| Liên kết Dashboard dẫn tới đúng workspace, danh sách và task | PASSED |
| Tắt Demo giữ dữ liệu thật và ẩn toàn bộ số liệu mẫu | PASSED |
| Tương phản toàn màn hình, zoom 200% và reduced motion | NOT VERIFIED |

## 7. Vấn đề và blocker

Dashboard aggregation và audit API chưa mount, thuộc backlog riêng. Lint còn hai cảnh báo Fast Refresh hiện hữu. Production build còn cảnh báo chunk chính vượt 500 kB. Developer Review đang chờ.

## 8. Ghi chú cho developer

Bật Demo trong `frontend/.env.local` rồi khởi động lại Vite để xem khu vực Workspace overview. Mặc định flag tắt.

## 9. Task tiếp theo

Developer Review Sprint 07. REDESIGN-16 tổng hợp Visual QA sau các task của Timebox C.
