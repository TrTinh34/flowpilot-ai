# ENV-01 — Khôi phục schema local cho My Tasks

## 1. Thông tin Task

- Sprint 06 · Timebox A · 2026-11-27 · COMPLETED
- Baseline [Frontend Audit](../../design/frontend/frontend-audit.md).

## 2. Tóm tắt triển khai

Đã áp dụng các migration Task, Collaboration và Outbox có sẵn cho PostgreSQL development local. GET My Tasks trả lại danh sách qua API thật.

## 3. File thay đổi

Cập nhật task spec, sprint status, Roadmap, Reports Index và báo cáo này. Các file Prisma schema và migration giữ nguyên nội dung.

## 4. Quyết định kỹ thuật

Xác nhận hostname loopback, database development `flowpilot_ai` và schema `public` bằng cấu hình và truy vấn PostgreSQL trước khi triển khai. Chạy Prisma `migrate deploy` với đích đã xác nhận. Kiểm thử access token tạo bằng signer local cho UUID tổng hợp, không thêm tài khoản hoặc dữ liệu nghiệp vụ.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| PostgreSQL dev trước triển khai | Thiếu bảng Task và Comment, lỗi cũ 500 và Prisma P2021 đã tái hiện trong audit |
| `prisma migrate deploy` | PASSED · Task, Collaboration và Outbox được áp dụng |
| `prisma migrate status` | PASSED · 6 migration, schema up to date |
| GET `/api/v1/me/tasks?page=0` với phiên kiểm thử | PASSED · 200, trang 0, size 20, danh sách rỗng cho UUID tổng hợp |
| GET cùng endpoint thiếu token | PASSED · 401 `UNAUTHORIZED` |
| `npm run test:db:migrate` | PASSED · PostgreSQL test đã cập nhật |

## 6. Acceptance Criteria

Migration đã áp dụng và My Tasks trả 200 cho request có xác thực, 401 khi thiếu xác thực.

## 7. Vấn đề và blocker

Kết quả giới hạn ở database development local và database test. Fixtures kiểm tra giao diện và dữ liệu được giao thuộc regression riêng.

## 8. Ghi chú cho developer

Nếu môi trường local khác gặp 500 và Prisma báo P2021, đối chiếu database target và migration status trước khi deploy các migration hiện có.

## 9. Task tiếp theo

ENV-01 gỡ điều kiện schema local cho REDESIGN-09.
