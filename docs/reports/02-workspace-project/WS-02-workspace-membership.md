# WS-02 — Workspace API và RBAC

## 1. Thông tin Task

- Task ID — WS-02
- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `US-WS-01`, `FR-WS-01`, `UC-WS-01`, `NFR-03`

## 2. Tóm tắt triển khai

Đã triển khai năm thao tác theo [OpenAPI](../../06-API-Specification.yaml). Tất cả dùng Bearer JWT.

| Method và path sau `/api/v1` | Thành công |
|---|---|
| GET `/workspaces` | 200, danh sách membership của actor với phân trang |
| POST `/workspaces` | 201, workspace và Owner membership được ghi cùng nhau |
| PATCH `/workspaces/{workspaceId}/members/{userId}` | 200, cập nhật vai trò |
| DELETE `/workspaces/{workspaceId}/members/{userId}` | 204, xóa membership hoặc tự rời |
| POST `/workspaces/{workspaceId}/transfer` | 200, chuyển quyền Owner |

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `backend/src/modules/workspace/` | Cập nhật | Router, validation, controller, service và repository |
| `backend/src/routes/index.ts`, `backend/src/errors/error-codes.ts` | Cập nhật | Mount API và mã lỗi nghiệp vụ |
| `backend/tests/integration/workspace-membership.postgres.test.ts` | Tạo | Kiểm tra RBAC, tenant isolation, ownership và concurrency |
| Sprint Index, Sprint Backlog, Task Spec, Reports Index, Roadmap | Cập nhật | Trạng thái và liên kết |

## 4. Quyết định kỹ thuật

- Dùng middleware xác thực có sẵn. Service kiểm tra membership từ PostgreSQL. Mutation lấy row lock của workspace và đọc lại membership trong transaction Read Committed, vì quyền có thể thay đổi trong lúc đợi lock.
- Actor ngoài workspace nhận 404. Actor trong workspace nhưng thiếu quyền nhận 403. Request xóa hoặc hạ vai trò Owner cuối nhận 409.
- Cập nhật role chỉ nhận ADMIN/MEMBER. OWNER mới được đặt qua transfer do Owner thực hiện. Thành viên có thể tự rời. Admin không sửa hoặc xóa Owner. Sau transfer, Owner thực hiện chuyển quyền trở thành ADMIN. Chuyển quyền cho chính mình giữ nguyên membership.
- OpenAPI để success object mở. Các mutation trả dữ liệu công khai trong `data`. Danh sách trả `{ data, page, size }` và sắp xếp theo workspace ID để phân trang ổn định.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| API và database | Supertest với PostgreSQL test, 4 ca WS-02 mới | PASSED |
| Regression | 32 integration và 62 unit test | PASSED |
| Static checks | Format, lint, typecheck và build | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Tạo workspace và Owner cùng nhau | PASSED | Prisma nested write, test đối chiếu membership trong PostgreSQL |
| Chỉ Owner chuyển quyền, Owner cuối được bảo vệ | PASSED | Admin nhận 403. Xóa/hạ quyền Owner cuối nhận 409. Hai Owner tự rời đồng thời để lại đúng một Owner. |
| Cách ly workspace và phân quyền | PASSED | List chỉ trả workspace của actor. Mutation ngoài tenant nhận 404, thiếu quyền trong tenant nhận 403. |

## 7. Vấn đề và blocker

Không có blocker cho WS-02 trên test database. Development vẫn cần migration WS-01 trước khi chạy Workspace API. Quy tắc liên quan đến project membership và task assignment thuộc các Task sau.

## 8. Ghi chú cho developer

Review [Workspace Service](../../../backend/src/modules/workspace/workspace.service.ts) để thấy ranh giới kiểm tra quyền và transaction. Repository thực hiện lock và thao tác Prisma, còn controller xử lý request và response.

## 9. Task tiếp theo

[WS-03 — Mời và chấp nhận thành viên](../../sprints/sprint-02-workspace-project/tasks/WS-03-workspace-invitations.md).
