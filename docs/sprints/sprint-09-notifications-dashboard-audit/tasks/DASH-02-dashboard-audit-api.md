# DASH-02 — Dashboard Metrics và Audit Query API

## Thông tin Task

- **Task ID**: `DASH-02`
- **Tên Task**: Dashboard Metrics và Audit Query API
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`PENDING`)
- **Ưu tiên**: P0 · **Ước lượng**: 6h
- **Nguồn**: [US-DASH-01](../../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log)

## Objective

Triển khai module `backend/src/modules/dashboard/` (và query endpoint của `audit`) theo Clean Architecture 4 tầng để phục vụ `GET /api/v1/projects/:projectId/dashboard` và `GET /api/v1/projects/:projectId/audit` đúng phân quyền và số liệu chính xác từ PostgreSQL.

## Related Requirements

- [FR-DASH-01](../../../02-SRS.md)
- [UC-DASH-01](../../../03-Use-Cases.md#uc-dash-01--dashboard-tiến-độ-my-tasks-audit-log)
- [OpenAPI Spec](../../../06-API-Specification.yaml) (`/projects/{projectId}/dashboard`, `/projects/{projectId}/audit`)

## Dependencies

- `DASH-01` (bảng `audit_logs` & module `audit`).
- `PROJ-02` (quy tắc kiểm tra quyền workspace/project).
- `TASK-02` (dữ liệu `tasks`).

## Scope

- Tổ chức `backend/src/modules/dashboard/` theo Clean Architecture 4 tầng (`domain/`, `application/`, `infrastructure/`, `presentation/`, `dashboard.module.ts`, `index.ts`) và mount routes tại `backend/src/routes/index.ts`.
- `GET /api/v1/projects/:projectId/dashboard`:
  - Tổng hợp số task theo từng trạng thái (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), tổng số task, tỷ lệ hoàn thành, thống kê quá hạn/sắp đến hạn, và phân bổ theo priority.
  - Project hợp lệ chưa có task trả số `0` (không lỗi `500`/chia cho `0`).
  - Cho phép các thành viên có quyền đọc project (Owner/Admin/Manager/Project Member); ngoài workspace/không tham gia project trả `404`/`403` theo chuẩn tenant isolation.
- `GET /api/v1/projects/:projectId/audit`:
  - Trả danh sách audit events phân trang (mới nhất trước, kèm thông tin actor hiển thị tối thiểu).
  - **Bắt buộc kiểm tra quyền chặt**: chỉ `OWNER` / `ADMIN` (cấp workspace) hoặc `MANAGER` (cấp project) được xem; `MEMBER` thường bị từ chối `403`, truy cập ngoài workspace trả `404`.

## Out of Scope

- Giao diện frontend Dashboard & Audit (`DASH-03`).

## Implementation Requirements

- Tuân thủ Clean Architecture 4 tầng, constructor injection rõ ràng và OpenAPI Spec response shapes.
- Aggregation thực hiện bằng truy vấn SQL/Prisma hiệu quả, tránh tải toàn bộ task vào memory không cần thiết.

## Acceptance Criteria

- Số liệu `/projects/:projectId/dashboard` khớp 100% với bản ghi `tasks` trong PostgreSQL test DB; project rỗng trả `0`.
- `MEMBER` thường gọi `/projects/:projectId/audit` nhận `403`; user ngoài workspace nhận `404`; `OWNER`/`ADMIN`/`MANAGER` nhận `200` phân trang.

## Testing Requirements

- Unit tests Use Cases (fake Ports) + Supertest integration tests trên PostgreSQL test DB cho mọi vai trò (`OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, người ngoài workspace) + `test:architecture`.

## Definition of Done

- Unit, PostgreSQL integration, architecture tests đạt; OpenAPI Spec đối chiếu khớp 100%; tạo Development Report tại `docs/reports/06-notifications-dashboard/DASH-02-dashboard-audit-api.md`.

## Development Report Reference

Chưa có.
