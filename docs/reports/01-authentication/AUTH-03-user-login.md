# AUTH-03 — User Login API

## 1. Thông tin Task

- Task ID — AUTH-03
- Tên Task — User Login API
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-25
- Trạng thái — PARTIAL
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `UC-AUTH-01`
- Loại báo cáo — Ghi sau triển khai, dựa trên test và kiểm tra HTTP thực tế

## 2. Tóm tắt triển khai

Đã triển khai schema validation và service xác thực credentials. Luồng nội bộ là Zod parse → chuẩn hóa email → repository tra cứu → bcrypt verify → trả `{ userId }` hoặc lỗi nghiệp vụ. OpenAPI yêu cầu Login trả HTTP 200 với `accessToken` và `expiresIn`. Controller, route và rate limiter Login chờ AUTH-04.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/src/modules/auth/auth.schema.ts` | Cập nhật | Thêm schema Login, chia sẻ validation đầu vào tương thích bcrypt |
| `backend/src/modules/auth/auth.repository.ts` | Cập nhật | Tra credentials theo `LOWER(email)` |
| `backend/src/modules/auth/auth.service.ts` | Cập nhật | Xác thực, tái sử dụng chuẩn hóa email và lỗi an toàn |
| `backend/src/utils/crypto.util.ts` | Cập nhật | Dùng chung bcrypt bất đồng bộ cho Register và Login |
| `backend/src/errors/error-codes.ts` | Cập nhật | Thêm `INVALID_CREDENTIALS` |
| `backend/tests/unit/auth.login.test.ts` | Tạo | Test schema, service và bcrypt với repository mock |
| `docs/reports/README.md`, `docs/07-Backlog-Roadmap.md` | Cập nhật | Ghi tiến độ |

## 4. Quyết định kỹ thuật

- Schema chỉ nhận email và password. Chuẩn hóa email bằng trim và lowercase. Password giữ nguyên, khác rỗng và tối đa 72 byte UTF-8 để tránh bcrypt so sánh tiền tố do cắt ngầm.
- Repository chỉ đọc ID và password hash qua Prisma tagged SQL có tham số. Predicate dùng cùng biểu thức với unique index `LOWER(email)`.
- Sai password và email không tồn tại cùng trả `401 INVALID_CREDENTIALS`. Tài khoản không tồn tại vẫn chạy bcrypt với hash fixture cost 12 để giảm chênh lệch thời gian. Chưa đo timing thực tế.
- Service trả ID nội bộ. Lỗi truy vấn hoặc xác minh chuyển thành `500 INTERNAL_ERROR` với thông báo chung. Luồng xác thực không ghi credentials vào log.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Unit và regression | `npm run test`, 29 đạt gồm 13 Login, 12 Register và 4 smoke | PASSED |
| Build, lint, typecheck | `npm run build`, `npm run lint`, `npm run typecheck` | PASSED |
| HTTP trên backend đã build | `/health` trả 200/database up, Register thiếu field trả 400, Login chưa mount trả 404 | PASSED |
| PostgreSQL test | Chưa có `TEST_DATABASE_URL`, 2 test Register được skip. Lookup Login đã test ở service với mock. | BLOCKED |
| Login HTTP, token và rate limiting | Chờ AUTH-04 và route hoàn chỉnh | BLOCKED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| AC-01 | PASSED | Schema test hợp lệ và không hợp lệ đã chạy |
| AC-02 | PASSED | Unit test trim và lowercase khi lookup |
| AC-03 | BLOCKED | SQL đúng biểu thức index, còn thiếu xác minh lookup trên PostgreSQL test |
| AC-04 | PASSED | Unit test bcrypt thật |
| AC-05 | PASSED | Cùng mã, status và thông báo cho cả hai trường hợp |
| AC-06 | PASSED | Kết quả nội bộ chỉ có ID. Lỗi không chứa credentials. |
| AC-07 | BLOCKED | Rate limiting chờ route |
| AC-08 | PASSED | Service trả lỗi 401 nhất quán và lỗi 500 an toàn; HTTP Login chờ AUTH-04 |
| AC-09 | PASSED | 13 test Login đạt |
| AC-10 | BLOCKED | Chờ AUTH-04 và PostgreSQL test |
| AC-11 | PASSED | 12 test Register đạt, HTTP validation hoạt động. 2 test ghi DB vẫn skip. |
| AC-12 | PASSED | Build, lint và typecheck đạt |
| AC-13 | PASSED | 4 smoke test đạt |
| AC-14 | PASSED | Thay đổi giới hạn ở xác thực credentials và helper dùng chung |
| AC-15 | PASSED | Đã lưu báo cáo và cập nhật index |
| AC-16 | BLOCKED | Chưa thể trả access token đúng OpenAPI |

## 7. Vấn đề và blocker

AUTH-04 cần cung cấp access token và refresh cookie theo thiết kế trước khi mount route. Cần PostgreSQL test riêng cho lookup thực tế và các ca AUTH-02 còn thiếu. Hướng dẫn Postman sẽ bổ sung khi endpoint sẵn sàng.

## 8. Ghi chú cho developer

Review `auth.schema.ts` để thấy ranh giới input, `auth.service.ts` để theo dõi xác minh credentials và `auth.repository.ts` để xem dữ liệu tối thiểu truy xuất từ PostgreSQL. Kết quả `userId` là đầu vào nội bộ để AUTH-04 tạo token.

## 9. Task tiếp theo

Khi AUTH-04 được giao, tích hợp cấp token với Login controller, route và rate limiting, rồi kiểm tra hợp đồng HTTP trên PostgreSQL test.
