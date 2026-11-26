# WS-03 — Mời và chấp nhận thành viên

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED

## 2. Tóm tắt triển khai

Đã triển khai hai endpoint OpenAPI. Token 32 byte ngẫu nhiên, lưu SHA-256 và hết hạn sau 48 giờ. Khóa workspace tuần tự hóa phát hành và chấp nhận. Fake email adapter cung cấp link preview qua fragment cho development và test. Production trả 503 đến khi có adapter gửi mail thật.

## 3. File thay đổi

- `backend/src/modules/workspace/`
- `backend/src/integrations/email/`
- `backend/src/errors/error-codes.ts`
- `backend/src/routes/index.ts`
- `backend/tests/integration/workspace-membership.postgres.test.ts`
- Sprint Backlog, Roadmap và Reports Index

## 4. Quyết định kỹ thuật

Xem phạm vi và quyết định trong đặc tả WS-03 và phần tóm tắt.

## 5. Kết quả kiểm chứng

Supertest/PostgreSQL: 33 integration đạt, gồm trùng lời mời, email sai và hai request accept chỉ tạo một membership. Chạy lại 5 test Workspace đạt sau khi thêm ca hết hạn. Lint và typecheck đạt.

## 6. Acceptance Criteria

Đã đối chiếu các tiêu chí của [Task Spec](../../sprints/sprint-02-workspace-project/tasks/WS-03-workspace-invitations.md) với kết quả kiểm thử.

## 7. Vấn đề và blocker

Xem giới hạn môi trường hoặc phạm vi được ghi trong phần tóm tắt.

## 8. Ghi chú cho developer

Tra cứu các file thay đổi ở mục 3.

## 9. Task tiếp theo

Theo [Sprint Backlog](../../sprints/sprint-02-workspace-project/README.md#sprint-backlog).
