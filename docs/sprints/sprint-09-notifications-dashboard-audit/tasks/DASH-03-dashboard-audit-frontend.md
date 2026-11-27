# DASH-03 — Tích hợp Dashboard Metrics và Audit Timeline UI

## Thông tin Task

- **Task ID**: `DASH-03`
- **Tên Task**: Tích hợp Dashboard Metrics và Audit Timeline UI
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`PENDING`)
- **Ưu tiên**: P1 · **Ước lượng**: 6h
- **Nguồn**: [US-DASH-01](../../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log)

## Objective

Nối giao diện Dashboard ([DashboardPage.tsx](../../../../frontend/src/pages/dashboard/DashboardPage.tsx), [ProjectMetricsChart.tsx](../../../../frontend/src/features/dashboard/components/ProjectMetricsChart.tsx), [AuditLogTable.tsx](../../../../frontend/src/features/dashboard/components/AuditLogTable.tsx) hoặc khu vực Project Activity/Overview) với API thật `GET /projects/:projectId/dashboard` và `GET /projects/:projectId/audit`, tuân thủ Design System V2 và phân quyền hiển thị Audit.

## Related Requirements

- [FR-DASH-01](../../../02-SRS.md)
- [Design System V2](../../../design/frontend/design-system.md)
- [Screen Specs](../../../design/frontend/screen-specifications.md)
- [API Readiness Matrix](../../../design/frontend/api-readiness-matrix.md)

## Dependencies

- `DASH-02` (`GET /projects/:projectId/dashboard`, `GET /projects/:projectId/audit`).
- `REDESIGN-06` & `REFINE-05A` (Dashboard UI baseline đã refine).

## Scope

- Hoàn thiện `frontend/src/features/dashboard/api/dashboard.api.ts` gọi thật `/projects/:projectId/dashboard` và `/projects/:projectId/audit`.
- Cho phép chọn project đang hoạt động trên Dashboard (hoặc trên màn Project/Overview tương ứng) để xem tiến độ thực tế theo trạng thái, deadline và audit timeline.
- Ẩn hoặc xử lý tinh gọn phần Audit đối với `MEMBER` (không gọi/không lộ dữ liệu audit trái quyền, hiển thị thông báo phân quyền rõ ràng nếu truy cập `403`, error state thật với nút Retry).
- Loại bỏ phụ thuộc bắt buộc vào `DashboardDemo` khi đã có API thật (nếu còn giữ sample cho dev preview, chỉ gắn khi `DEV && VITE_USE_MOCK_API === 'true'` và tách biệt rõ bằng badge `Demo`).

## Out of Scope

- Thay đổi hợp đồng `My Tasks` hoặc `AI Planner`.

## Implementation Requirements

- Trước khi sửa UI, đối chiếu `.agents/skills/ui-ux-pro-max/SKILL.md`, `design-system.md`, `component-inventory.md` và `screen-specifications.md` theo đúng [AGENTS.md](../../../../AGENTS.md).
- Tái sử dụng shared components (`StatCard`, `StatusBadge`, `LoadingState`, `EmptyState`, `ErrorState`, `Pagination`, `Select`); không hardcode hex color; giữ WCAG 2.2 AA (`<dl>` hợp lệ, heading hierarchy `h1->h2->h3`, `id`/`name` trên controls).

## Acceptance Criteria

- Dashboard hiển thị số liệu tiến độ thật từ PostgreSQL cho project đang chọn; khi tạo/di chuyển task, Dashboard phản ánh số mới sau refresh/invalidation.
- `OWNER`/`ADMIN`/`MANAGER` xem được Audit timeline phân trang; `MEMBER` không thấy dữ liệu audit trái quyền và không phát sinh lỗi JS.
- Trạng thái Loading, Empty (project chưa có task -> `0`), và Error (`Retry`) hoạt động đúng trên cả desktop (`1440px`) và mobile (`360px`).

## Testing Requirements

- Vitest + RTL tests trong `frontend/tests/integration/dashboard.test.tsx` (kịch bản API thật thành công, project rỗng, lỗi + retry, phân quyền audit).
- `npm --prefix frontend run typecheck`, `lint`, `format`, `test`, `build`.

## Definition of Done

- Frontend checks pass (`0` warnings, bundle < 500 kB, `0` mock leaks); tạo Development Report tại `docs/reports/06-notifications-dashboard/DASH-03-dashboard-audit-frontend.md`.

## Development Report Reference

Chưa có.
