# AUTH-INT-01 — Authentication Integration Testing & Backend Verification

**Nghiệm thu 2026-11-26 — COMPLETED.** Đã bổ sung Current User qua HTTP vào lifecycle PostgreSQL: Login → Current User → Refresh → Current User → Logout → Refresh bị từ chối. Full regression backend 89/89 đạt. Các ghi chú blocker bên dưới là lịch sử trước khi chốt hợp đồng.

## 1. Thông tin Task

- Task ID — AUTH-INT-01
- Sprint — 1, Foundation + AUTH
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `NFR-07`, `UC-AUTH-01`, `TC-AUTH-01`, `TC-AUTH-02`

## 2. Tóm tắt triển khai

Đã tạo PostgreSQL local `flowpilot_ai_test`, áp dụng migration `20261125150345_init_auth` và xác nhận không còn migration chờ. Register, Login, Refresh, reuse và Logout đã đi qua Supertest → Express → các lớp Auth → Prisma → PostgreSQL thật. Luồng Register, Login, Refresh và Logout chạy với fixture test. Phần Current User mới kiểm chứng verified subject và lookup PostgreSQL ở lớp service vì OpenAPI chưa có route hồ sơ.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `.gitignore`, `backend/.env.test.example`, `README.md` | Cập nhật/tạo | Cấu hình test và hướng dẫn chạy |
| `backend/package.json`, `backend/tests/setup.ts` | Cập nhật | Script test và setup trước import |
| `backend/tests/helpers/test-db.helper.ts`, `test-integration.ts`, `test-migrate.mjs` trong cùng thư mục | Cập nhật/tạo | Guard, runner tuần tự và migration |
| `backend/tests/integration/auth.integration.test.ts`, `auth.session.postgres.test.ts`, `auth.login.validation.test.ts` trong cùng thư mục | Cập nhật/tạo | Catalog, validation, JWT, session lifecycle và lỗi DB thật |
| `backend/tests/unit/auth.session.http.test.ts` | Di chuyển | Các ca HTTP dùng mock được phân loại trong unit suite |
| `docs/07-Backlog-Roadmap.md`, `docs/reports/README.md`, báo cáo AUTH-02 đến AUTH-07 | Cập nhật | Tiến độ và bằng chứng nghiệm thu |

## 4. Quyết định kỹ thuật

- `backend/.env.test` được Git ignore. Setup load cấu hình trước khi import backend và sinh JWT key riêng cho từng test file. Explicit integration runner yêu cầu test URL. Khi chạy unit hoặc regression thiếu URL, database fallback là loopback port không phục vụ trên tên database test.
- Guard chỉ nhận PostgreSQL URL local với pathname chính xác `/flowpilot_ai_test` và tùy chọn schema `public`. Guard xác minh `current_database()` trước migration, thao tác ghi và cleanup fixture. Đã thử URL development và xác nhận guard dừng trước khi gọi Prisma Migrate.
- Integration runner chạy các file tuần tự. Fixture dùng email ngẫu nhiên và thu hồi/xóa dữ liệu theo fixture. Cleanup xóa token trước user và đóng pool. Race tests chủ động phát nhiều request cùng lúc.
- Hai ca rollback cũ dùng repository spy. Thay bằng PostgreSQL CHECK tạm giới hạn vào UUID fixture, tháo constraint trong `finally`. PostgreSQL thật từ chối insert hoặc update, sau đó assertion kiểm tra bản ghi gốc. Không phát hiện lỗi cần sửa trong Auth production code.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prisma schema | `node node_modules/prisma/build/index.js validate` | PASSED |
| Migration | `npm run test:db:migrate`, deploy và status trên test database | PASSED |
| Database constraints | Catalog xác nhận PK, FK, unique token hash, index lookup và `LOWER(email)`. Duplicate khác hoa thường trực tiếp qua Prisma trả P2002 đúng index. | PASSED |
| AUTH-02 Register | Email chuẩn hóa, bcrypt, validation và ba request đồng thời chỉ tạo một user | PASSED |
| AUTH-03 Login | Token đúng envelope, chuẩn hóa email, invalid credentials thống nhất, login thất bại không tạo token và rate limit 429 | PASSED |
| AUTH-04 Token | JWT claims/chữ ký, lưu SHA-256, hạn tuyệt đối, rotation, reuse commit, concurrency và rollback PostgreSQL | PASSED |
| AUTH-05 Logout | Xóa cookie, `204`, scope family, replay, concurrency, lỗi DB và JWT sau Logout | PASSED |
| AUTH-06 Middleware | 13 ca qua Express test harness. Route ứng dụng chờ hợp đồng AUTH-07. | BLOCKED |
| AUTH-07 Current User | Lookup theo verified subject và trường hợp user không tồn tại đạt. HTTP contract chưa có. | BLOCKED |
| Lifecycle | Luồng hiện có đạt. Hai bước Current User qua HTTP chưa chạy. | BLOCKED |
| Unit | `npm run test:unit`, 7 file, 62 đạt, 0 fail, 0 skip, 5.02 giây | PASSED |
| Integration | `npm run test:integration`, 4 file, 26 đạt, 0 fail, 0 skip, 15.02 giây | PASSED |
| Full regression | `npm run test`, 11 file, 88 đạt, 0 fail, 0 skip, 7.66 giây | PASSED |
| Static checks | `npm run typecheck`, `npm run lint`, `npm run build` | PASSED |
| Coverage | Chưa có provider hoặc script coverage trong backend | NOT RUN |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| AC-01–04 | PASSED | Test database riêng, guard và deploy đã xác minh |
| AC-05–08 | PASSED | Catalog, Register, Login và JWT |
| AC-09–13 | PASSED | Persistence, rotation, reuse, concurrent Register và Refresh |
| AC-14–16 | PASSED | Logout, revocation và concurrent Logout/Refresh |
| AC-17 | BLOCKED | Middleware harness đạt. Protected route thực tế chưa có. |
| AC-18–20 | BLOCKED | Chờ hợp đồng Current User và lifecycle đầy đủ |
| AC-21–25 | PASSED | Response checks, regression, static checks, báo cáo và cách ly development |

## 7. Vấn đề và blocker

OpenAPI có `/me/tasks` và chưa định nghĩa `GET /auth/me`. Cần chốt path, Bearer security, response envelope và lỗi trước khi mount Current User. OpenAPI cũng chưa liệt kê HTTP 500 cho lỗi hệ thống Auth. Các ca rollback xác nhận server trả 500 chung và giữ nguyên trạng thái cần thiết. Hợp đồng hiện tại được giữ nguyên.

## 8. Ghi chú cho developer

AUTH-02 đến AUTH-05 đạt các ca tích hợp bắt buộc. AUTH-06 và AUTH-07 còn chờ kiểm chứng HTTP. Backend sẵn sàng để tích hợp Register, Login, Refresh và Logout. Giai đoạn Backend Authentication còn mở vì Frontend cần hợp đồng hồ sơ hiện tại. Xem [hướng dẫn chạy](../../../README.md#environment-variables).

## 9. Task tiếp theo

Chốt hợp đồng Get Current User, mount middleware và bổ sung các bước Current User vào lifecycle suite. Các hạng mục frontend của Sprint 1 vẫn theo Product Backlog.


---

### Architecture Refactoring Note

This task was originally implemented using the project's previous Feature-based Layered Architecture.

The implementation was subsequently migrated to Feature-based Clean Architecture as part of the architecture refactoring initiative (`ARCH-01`).

The original functional behavior and public API contract remain unchanged.

Refer to [ADR-001](../../architecture/decisions/ADR-001-adopt-clean-architecture.md) and [Architecture Refactoring Report](../architecture/clean-architecture-refactoring.md) for current architecture, changed paths, and regression verification results.
