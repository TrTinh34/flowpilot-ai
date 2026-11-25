# AUTH-06 — Authentication Middleware

## 1. Thông tin Task

- Task ID — AUTH-06
- Tên Task — Authentication Middleware
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-25
- Trạng thái — PARTIAL
- Yêu cầu liên quan — `BR-04`, `NFR-02` và Bearer Authentication trong System Design
- Loại báo cáo — Ghi sau triển khai

## 2. Tóm tắt triển khai

`authenticate` đọc Bearer header, gọi JWT verifier từ AUTH-04 và gắn `req.auth = { userId }` khi token hợp lệ. Luồng request là Router → middleware → verify → controller. Khi xác thực thất bại, Global Error Handler trả envelope lỗi chuẩn.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/src/middlewares/auth.middleware.ts` | Cập nhật | Bearer parsing, verify, context và xử lý lỗi |
| `backend/src/types/express.d.ts` | Cập nhật | Declaration merging cho `Request.auth` tùy chọn |
| `backend/src/modules/auth/auth.tokens.ts` | Cập nhật | Định danh lỗi kiểm tra claim bằng lớp lỗi JOSE |
| `backend/src/errors/error-codes.ts` | Cập nhật | Mã `UNAUTHORIZED` |
| `backend/tests/unit/auth.middleware.test.ts` | Tạo | JWT thật, Express test harness và mô phỏng lỗi verifier |
| `docs/reports/README.md`, `docs/07-Backlog-Roadmap.md` | Cập nhật | Tiến độ AUTH-06 và AUTH-07 |

## 4. Quyết định kỹ thuật

- Middleware dùng verifier hiện có để kiểm tra chữ ký, HS256, expiration, token type, issuer, audience và claims. Header sai hoặc JWT không hợp lệ trả `401 UNAUTHORIZED` với `WWW-Authenticate: Bearer`. Lỗi verifier bất ngờ trả `500 INTERNAL_ERROR` chung.
- JWT stateless. Middleware không truy vấn DB, không ghi token vào context và không log header. Header Authorization đã được Pino redact. Access token đã cấp tiếp tục có hiệu lực đến khi hết hạn theo AUTH-05.
- Authentication xác định danh tính, còn authorization kiểm tra quyền dựa trên hành động và tài nguyên. Context chỉ chứa ID, không chứa role hoặc quyền.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Middleware | 13 ca qua Express test harness, gồm token hợp lệ, hết hạn, chữ ký sai, claim/type sai và refresh token | PASSED |
| Public HTTP và health | Backend đã build trả 400 cho Register/Login thiếu trường, 401 cho Refresh/Logout thiếu cookie và health 200/database up | PASSED |
| Regression | `npm run test`, 74 đạt và 11 PostgreSQL test skip | PASSED |
| Code quality | Build, lint và typecheck | PASSED |
| Route ứng dụng | Chờ hợp đồng Get Current User | BLOCKED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| AC-01–10 | PASSED | Kiểm chứng middleware, Bearer, JWT, context, type và lỗi qua test harness |
| AC-11 | PASSED | Kiểm tra public routes trên backend đã build và regression hiện có |
| AC-12 | PASSED | Lỗi và context không chứa token, signing key hoặc chi tiết verifier |
| AC-13 | BLOCKED | 13 ca middleware đạt. Integration trên route ứng dụng chờ AUTH-07. |
| AC-14 | PASSED | Thay đổi chỉ xác thực và thiết lập danh tính |

## 7. Vấn đề và blocker

OpenAPI chưa có Get Current User. Integration trên route được bảo vệ của ứng dụng chờ xác nhận hợp đồng AUTH-07.

## 8. Ghi chú cho developer

Gắn `authenticate` trước controller ở từng route cần Bearer JWT. Declaration merging giúp TypeScript nhận biết `req.auth` trong Express. Vì route công khai cũng dùng kiểu Request chung, controller cần kiểm tra context trước khi truy cập.

## 9. Task tiếp theo

Tích hợp và kiểm chứng middleware trên route AUTH-07 sau khi chốt hợp đồng.
