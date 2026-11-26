# AUTH-12 — Testing & Code Review

## 1. Thông tin Task

- Task ID — AUTH-12
- Sprint — 01, Foundation + AUTH
- Ngày — 2026-11-26
- Trạng thái — PARTIAL
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `NFR-05`, `UC-AUTH-01`, `TC-AUTH-01`, `TC-AUTH-02`

## 2. Tóm tắt triển khai

Đã kiểm tra contract và flow Auth, tự review code, chạy regression trên PostgreSQL test và smoke test trên Edge. Sửa route fallback, sửa các lỗi format chặn CI và cấu hình CI chạy integration với PostgreSQL riêng.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `.github/workflows/ci.yml` | Cập nhật | Service PostgreSQL 17 riêng cho backend job, migration và unit/integration steps |
| `frontend/src/app/router/AppRouter.tsx` | Cập nhật | Route lạ đi qua protected fallback |
| `frontend/tests/integration/protected-routes.test.tsx` | Cập nhật | Regression cho guest trên URL lạ |
| `frontend/src/`, `frontend/tests/`, `backend/tests/integration/auth.login.validation.test.ts` | Format | Các file bị Prettier báo lỗi |
| Roadmap, Sprint Index, Sprint README, Task Spec và Reports Index | Cập nhật | Bằng chứng và trạng thái |

## 4. Quyết định kỹ thuật

- Backend CI cấp PostgreSQL tạm trên runner, chạy migration và integration runner bắt buộc. Trước thay đổi, `npm run test` có thể skip PostgreSQL nếu URL test thiếu.
- Router wildcard trước đó render trực tiếp trang trạng thái dùng ở protected route. Chuyển hướng qua route gốc để guard xử lý guest.
- Review JWT signature và claims, Bearer context, expiry, cookie, CORS/Origin, family lock, replay detection, transaction rollback và các trường public của Current User. Các regression test xác nhận access JWT stateless đã cấp vẫn hợp lệ đến khi hết hạn. Không phát hiện lỗi critical/high chưa xử lý trong phạm vi code review.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Backend | 62 unit + 27 integration đạt, PostgreSQL thật, không skip | PASSED |
| Prisma | Schema validate, deploy và status trên test database | PASSED |
| Frontend | 55 test đạt, gồm regression wildcard | PASSED |
| Static checks | Format, lint, typecheck và build của cả hai ứng dụng | PASSED |
| Browser | Edge headless, Register ở 360 px, guest fallback, duplicate, invalid Login, Login, Current User, reload và Logout | PASSED |
| Concurrent browser refresh | Hai tab refresh, PostgreSQL ghi nhận hai rotation và đúng một refresh token hoạt động | PASSED |
| GitHub Actions | Workflow đã cập nhật. Chưa có kết quả remote cho revision mới. | NOT RUN |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Luồng Authentication đạt kiểm thử | PASSED | Regression, HTTP PostgreSQL và browser smoke |
| CI xanh | BLOCKED | Các gate local đạt. Chờ workflow chạy trên revision có thay đổi AUTH-12. |
| Lỗi critical/high đã xử lý | PASSED | Không còn finding mức critical/high trong phạm vi self-review |
| Có Development Report | PASSED | Đã lưu bằng chứng và cập nhật Sprint |

## 7. Vấn đề và blocker

GitHub Actions chưa có kết quả cho thay đổi local này. Build frontend còn warning chunk trên 500 kB và lint còn warning Fast Refresh từ component Button. Browser thiếu Web Locks dùng điều phối refresh trong một tab. Phạm vi security review là code và regression của Authentication.

## 8. Ghi chú cho developer

Chạy `npm run test:db:migrate`, `npm run test:unit` và `npm run test:integration` trong backend với PostgreSQL test. Chạy `npm run test` trong frontend. Hai ứng dụng dùng các gate `format`, `lint`, `typecheck` và `build`.

## 9. Task tiếp theo

Developer Review thay đổi AUTH-12 và xác nhận GitHub Actions trên revision được review trước khi nghiệm thu Sprint 01.
