# COL-INT-01 — Kiểm thử tích hợp và Sprint Review

## 1. Thông tin Task

- Sprint 05 · 2026-11-27 · COMPLETED
- FR-COL-01, UC-COL-01, TC-COL-01 và TC-COL-02
- Bằng chứng gồm local regression, Edge, PostgreSQL test, fake storage và GitHub Actions.

## 2. Tóm tắt triển khai

Kiểm chứng luồng từ Task Detail đến Comment và Attachment APIs, PostgreSQL và storage qua một phiên đăng nhập Member. Đối chiếu quyền và phản hồi HTTP với task specs, SRS và OpenAPI.

## 3. File thay đổi

- `docs/08-Test-Plan.md` ghi kết quả TC-COL-01 và TC-COL-02.
- Sprint Backlog, Task Spec, Reports Index và Product Backlog ghi kết quả nghiệm thu.

## 4. Quyết định kỹ thuật

Smoke test dùng Edge headless, frontend và backend local, PostgreSQL test và fake storage được inject vào Express app. Fake storage trả URL có thời hạn và phục vụ bytes đã upload để kiểm tra tải xuống.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Backend | PASSED · lint, typecheck, format, build, 75 unit, 41 integration PostgreSQL, 5 architecture |
| Frontend | PASSED · lint, typecheck, format, build và 74 test |
| PostgreSQL migration | PASSED · 6 migration, schema test đã cập nhật |
| S3 URL offline | PASSED · AWS SDK ký URL với thời hạn 300 giây và Content-Disposition dạng attachment |
| Edge smoke | PASSED · đăng nhập Member, đăng comment và mention, xác nhận outbox, upload multipart, tải xuống đúng byte và đọc lịch sử khi archive |
| GitHub Actions | PASSED · Backend Checks và Frontend Checks trên `4bd6b16`. [Run #46029570797](https://github.com/TrTinh34/flowpilot-ai/actions/runs/46029570797) |

## 6. Acceptance Criteria

| Tiêu chí | Bằng chứng |
|---|---|
| Quyền và tenant isolation | PASSED · HTTP 403 ngoài project, 404 ngoài tenant, 409 khi ghi project archived |
| Mention nguyên tử | PASSED · chỉ project members, bỏ trùng, comment và outbox cùng rollback |
| Giới hạn, MIME và cleanup | PASSED · nhận đúng 10 MiB, 413 khi vượt giới hạn, 422 khi chữ ký sai, xóa object khi metadata không lưu được |
| Luồng trình duyệt và regression | PASSED · Edge nhận đủ bytes và backend/frontend regression đều đạt |
| CI | PASSED · cả hai job trên `main` hoàn tất thành công |

## 7. Vấn đề và blocker

S3 thật và cấu hình bucket triển khai chưa được xác minh. TC-COL-01 còn phần phát thông báo tới người nhận thuộc Notification. Frontend vẫn có cảnh báo Fast Refresh và kích thước bundle.

## 8. Ghi chú cho developer

Luồng Task Detail dùng API thật. Môi trường triển khai cần áp dụng migration Collaboration và Outbox, rồi cấu hình bucket S3 cho upload/download.

## 9. Task tiếp theo

Sprint 05 đã nghiệm thu. Notification delivery theo US-NOTI-01.
