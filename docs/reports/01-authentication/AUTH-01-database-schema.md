# AUTH-01 — Authentication Database Schema & Migration

## 1. Thông tin Task

- Task ID — AUTH-01, thuộc story `US-AUTH-01`
- Sprint — 1, Foundation + AUTH
- Ngày triển khai — 2026-11-25
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `UC-AUTH-01`
- Loại báo cáo — Khôi phục từ báo cáo và kết quả kiểm chứng ghi ngay sau triển khai, đối chiếu với migration hiện có

## 2. Tóm tắt triển khai

Thêm `User` và `RefreshToken`, tạo migration `20261125150345_init_auth` và áp dụng trên PostgreSQL development 17.10. Đã generate Prisma Client 7.10.1 và kiểm chứng schema thực tế. Authentication API chưa bắt đầu.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/prisma/schema.prisma` | Cập nhật | Hai model, mapping, khóa ngoại và index |
| `backend/prisma/migrations/20261125150345_init_auth/migration.sql` | Tạo | DDL và unique index `LOWER(email)` |
| `backend/prisma/migrations/migration_lock.toml` | Tạo | Provider PostgreSQL |
| `docs/05-Database-Design.md` | Cập nhật | Chuẩn hóa email, token family và khóa ngoại |
| `docs/07-Backlog-Roadmap.md` | Cập nhật | Tiến độ hạng mục database |
| `README.md` | Cập nhật | Schema hiện tại và tiến độ Sprint 1 |

## 4. Quyết định kỹ thuật

- Dùng UUID và `TIMESTAMPTZ(6)`. Ánh xạ model camelCase sang bảng và cột snake_case.
- Dùng unique index trên `LOWER(email)`. Quy ước ở tầng API là trim và lowercase khi lưu hoặc tra cứu.
- Lưu `password_hash` và `token_hash`. UUID `family_id` nhóm các token cùng chuỗi rotation. Dùng `expires_at` và `revoked_at` để theo dõi vòng đời.
- FK `refresh_tokens.user_id` dùng `ON DELETE RESTRICT` và `ON UPDATE CASCADE`. Index trên `user_id`, `family_id` và `expires_at` hỗ trợ truy vấn vòng đời token.

## 5. Kết quả kiểm chứng

Các kết quả dưới đây ghi nhận tại phiên triển khai AUTH-01.

| Check | Command or Evidence | Status |
|---|---|---|
| Schema và Client | `prisma validate`, `npm run prisma:generate` | PASSED |
| Migration và schema thực tế | `prisma migrate deploy`, `prisma migrate status`, `prisma migrate diff` và tra cứu catalog PostgreSQL | PASSED |
| Backend | `npm run build`, `npm run typecheck`, `npm run lint` | PASSED |
| Smoke tests | `npm run test`, 4/4 đạt | PASSED |
| Kết nối thực tế | `GET /health` trả HTTP 200, database `up` | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| AC-01 đến AC-04 | PASSED | Hai model đúng phạm vi, PK/FK/index được đối chiếu, schema cung cấp cột hash |
| AC-05 đến AC-09 | PASSED | Schema hợp lệ, SQL đã review và áp dụng, Client đã generate, database đã kiểm chứng |
| AC-10 đến AC-11 | PASSED | Build, typecheck và health check thành công |
| AC-12 đến AC-14 | PASSED | Thay đổi chỉ gồm schema, migration và tài liệu. Database ban đầu trống, hai bảng mới có 0 dòng, file môi trường được Git ignore. |

## 7. Vấn đề và blocker

Không có blocker cho hạng mục database. Kiểm thử nghiệp vụ Authentication chưa chạy vì API chưa triển khai.

## 8. Ghi chú cho developer

`User` có quan hệ một-nhiều với `RefreshToken`. Register sẽ ghi user, login sẽ tra tài khoản và tạo phiên, còn refresh và logout sẽ cập nhật vòng đời token. Review [Prisma schema](../../../backend/prisma/schema.prisma), [migration SQL](../../../backend/prisma/migrations/20261125150345_init_auth/migration.sql) và [Database Design](../../05-Database-Design.md).

## 9. Task tiếp theo

Triển khai Authentication service và API theo [US-AUTH-01](../../07-Backlog-Roadmap.md#us-auth-01--đăng-ký-đăng-nhập-refresh-logout), bắt đầu với Register.
