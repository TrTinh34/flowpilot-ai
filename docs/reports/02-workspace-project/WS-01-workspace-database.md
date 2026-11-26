# WS-01 — Workspace schema và migration

## 1. Thông tin Task

- Task ID — WS-01
- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `US-WS-01`, `FR-WS-01`, `UC-WS-01`

## 2. Tóm tắt triển khai

Thêm `Workspace`, `WorkspaceMember`, `Invitation` và áp dụng `20261126000000_workspace_invitations` lên `flowpilot_ai_test`. Prisma Client đã sinh lại. Development database nằm ngoài lần áp dụng này.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/prisma/schema.prisma` | Cập nhật | Workspace models, enums, FK và index |
| `backend/prisma/migrations/20261126000000_workspace_invitations/migration.sql` | Tạo | DDL trong transaction, CHECK và partial unique index |
| `backend/tests/integration/workspace-schema.postgres.test.ts` | Tạo | Kiểm chứng PostgreSQL và rollback fixture |
| Sprint Index, Sprint Backlog, Task Spec, Reports Index, Roadmap | Cập nhật | Trạng thái và liên kết |

## 4. Quyết định kỹ thuật

- Dùng UUID, `TIMESTAMPTZ(6)` và snake_case theo Database Design. FK dùng Restrict khi xóa để bảo vệ membership và invitation, Cascade khi cập nhật khóa.
- SQL bổ sung CHECK `LENGTH(BTRIM(name)) > 0` và unique index theo workspace, `LOWER(email)` cho lời mời PENDING. Email cùng giá trị có thể xuất hiện ở workspace khác hoặc khi lời mời cũ đã rời trạng thái PENDING.
- Invitation lưu token hash duy nhất và thời điểm hết hạn bắt buộc. Quy tắc tính TTL 48 giờ, chấp nhận một lần và bảo vệ Owner cuối thuộc Workspace API và invitation service.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Prisma schema và Client | `prisma format`, `prisma validate`, `npm run prisma:generate` | PASSED |
| Migration | `npm run test:db:migrate` xác nhận cả hai migration đã áp dụng | PASSED |
| Schema diff | Prisma migrate diff từ test datasource sang schema không có khác biệt Prisma biểu diễn được | PASSED |
| Constraints thực tế | PostgreSQL từ chối tên chỉ có khoảng trắng, membership trùng, FK sai, token hash trùng và pending email trùng khác hoa thường. Kiểm tra SQL riêng cho CHECK và partial index. | PASSED |
| Regression | 28 integration và 62 unit test đạt. Fixture mới rollback. | PASSED |
| Backend checks | Format, lint, typecheck và build | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Models, UUID, timestamps và relations | PASSED | Schema validate, migration apply và diff đạt |
| Membership unique, tên hợp lệ, token hash unique | PASSED | Kiểm chứng trực tiếp trên PostgreSQL |
| Partial uniqueness trong workspace | PASSED | Từ chối trùng PENDING, chấp nhận khi khác workspace hoặc lời mời cũ đã REVOKED |

## 7. Vấn đề và blocker

Không có blocker cho phạm vi schema test. Migration chưa áp dụng lên development. Tenant authorization chờ WS-02 và WS-03.

## 8. Ghi chú cho developer

Review [Prisma schema](../../../backend/prisma/schema.prisma) và [migration](../../../backend/prisma/migrations/20261126000000_workspace_invitations/migration.sql). Partial index xác định tính duy nhất theo trạng thái trực tiếp trong database.

## 9. Task tiếp theo

[WS-02 — Workspace API và RBAC](../../sprints/sprint-02-workspace-project/tasks/WS-02-workspace-membership.md).
