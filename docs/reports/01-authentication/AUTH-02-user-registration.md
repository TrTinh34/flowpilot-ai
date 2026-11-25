# AUTH-02 — User Registration API

## 1. Thông tin Task

- Task ID — AUTH-02, thuộc story `US-AUTH-01`
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-25
- Trạng thái — PARTIAL
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `UC-AUTH-01`
- Loại báo cáo — Ghi sau triển khai, dựa trên source code, kết quả npm scripts và thử HTTP trên backend

## 2. Tóm tắt triển khai

Thêm `POST /api/v1/auth/register` công khai. Endpoint validate input, chuẩn hóa email, băm password và trả các field công khai của User. PostgreSQL integration suite đã viết và chờ cấu hình test database riêng.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/src/modules/auth/auth.schema.ts` | Cập nhật | Zod schema và giới hạn bcrypt theo byte |
| `backend/src/modules/auth/auth.repository.ts` | Cập nhật | Tra email, tạo user, nhận diện lỗi của unique index |
| `backend/src/modules/auth/auth.service.ts` | Cập nhật | Chuẩn hóa, kiểm tra trùng, băm mật khẩu và xử lý conflict |
| `backend/src/modules/auth/auth.controller.ts` | Cập nhật | HTTP 201 và lỗi nội bộ an toàn |
| `backend/src/modules/auth/auth.routes.ts` | Cập nhật | Route Register với middleware |
| `backend/src/routes/index.ts` | Cập nhật | Mount Auth router |
| `backend/src/middlewares/validation.middleware.ts` | Cập nhật | Validate body và chuyển dữ liệu đã parse |
| `backend/src/middlewares/rate-limit.middleware.ts` | Cập nhật | Giới hạn Register theo IP |
| `backend/src/errors/error-codes.ts` | Cập nhật | Mã `EMAIL_ALREADY_EXISTS` |
| `backend/package.json`, `backend/package-lock.json` | Cập nhật | Dependency `bcryptjs` |
| `backend/tests/unit/auth.service.test.ts`, `backend/tests/integration/auth.integration.test.ts`, `backend/vitest.config.ts` | Cập nhật | Service, HTTP và PostgreSQL tests |
| `docs/07-Backlog-Roadmap.md`, `docs/reports/README.md` | Cập nhật | Tiến độ và trạng thái nghiệm thu |

## 4. Quyết định kỹ thuật

- OpenAPI quy định Register trả `201` với object và chưa định nghĩa các field phản hồi cụ thể. Chọn trả `id`, `email`, `displayName`, `createdAt`, `updatedAt`. Use Case mô tả trả session cho luồng Auth chung. Register thực hiện phần tạo tài khoản theo OpenAPI.
- SRS yêu cầu bcrypt và chưa có chính sách độ dài hoặc độ phức tạp cụ thể. Validate password bắt buộc, khác rỗng và tối đa 72 byte UTF-8. Giữ nguyên nội dung password. Chọn bcrypt cost 12 và hash bất đồng bộ.
- Zod strict object chặn field ngoài contract. Validation và lỗi nội bộ dùng thông báo chung. Giới hạn 15 lần/phút/IP trên Register.
- Dùng Prisma tagged SQL có tham số để so sánh chính xác `LOWER(email)` theo cùng biểu thức với migration, kể cả email cũ có chữ hoa. Unique index xử lý race. Repository nhận diện `P2002` theo tên index trong adapter metadata, đã kiểm tra bằng fixture và mã adapter. Hình dạng lỗi từ PostgreSQL thật vẫn cần xác nhận.
- Giữ HTTP 409 cho email trùng theo contract. Phản hồi này có thể xác nhận email đã đăng ký, rate limit hạn chế tần suất thử.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Build, lint và typecheck | `npm run build`, `npm run lint`, `npm run typecheck` | PASSED |
| Unit và HTTP | `npm run test`, 16 đạt gồm 4 service/HTTP mock, 8 validation và 4 smoke | PASSED |
| PostgreSQL integration | 2 test được skip do chưa có `TEST_DATABASE_URL` | BLOCKED |
| Backend thực tế | `/health` trả 200 với database up. Register trả 400 khi body thiếu field và 429 ở lần thứ 16. | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| AC-01, AC-02 | PASSED | Mount đúng endpoint công khai và HTTP validation đã chạy |
| AC-03, AC-04 | PASSED | Unit xác nhận chuẩn hóa trước khi ghi và bcrypt xác minh được password gốc |
| AC-05 | BLOCKED | Cần kiểm tra ghi User vào PostgreSQL test |
| AC-06, AC-07, AC-08 | BLOCKED | Unit đã kiểm tra conflict và mapping. Còn thiếu kiểm chứng trên database thật. |
| AC-09 | PASSED | Select chỉ lấy field công khai, unit xác nhận kết quả không có hash |
| AC-10 | PASSED | HTTP test từ chối field ngoài contract |
| AC-11 | PASSED | Đã kiểm tra envelope lỗi validation, rate limit và lỗi nội bộ. Conflict được kiểm tra ở service. |
| AC-12 | PASSED | 4 test service/HTTP mock đạt |
| AC-13 | BLOCKED | Hai test PostgreSQL chưa chạy |
| AC-14, AC-15 | PASSED | Build, lint, typecheck, smoke tests và health check đạt |
| AC-16, AC-17 | PASSED | Thay đổi giới hạn ở Register. Kiểm tra input và lỗi nội bộ xác nhận response không lộ thông tin nhạy cảm. |

## 7. Vấn đề và blocker

Cần `TEST_DATABASE_URL` trỏ đến PostgreSQL test riêng đã áp dụng migration và có tên kết thúc bằng `_test`. Suite không dùng development database để ghi dữ liệu. Sau khi cấu hình biến trong shell, chạy `npm run test` từ `backend/`.

## 8. Ghi chú cho developer

Router áp dụng rate limit trước Zod. Controller chuyển dữ liệu đã parse sang service. Service chuẩn hóa email và băm mật khẩu, repository thực hiện truy vấn và dùng select để giới hạn response. Unique index là lớp quyết định cuối cùng khi các request ghi đồng thời.

## 9. Task tiếp theo

Hoàn tất kiểm chứng AUTH-02 trên PostgreSQL test trước khi chuyển sang Login theo Product Backlog.
