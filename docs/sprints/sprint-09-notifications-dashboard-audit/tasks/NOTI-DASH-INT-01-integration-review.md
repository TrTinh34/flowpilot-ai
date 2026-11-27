# NOTI-DASH-INT-01 — Kiểm thử tích hợp, Architecture Fitness và Sprint Review

## Thông tin Task

- **Task ID**: `NOTI-DASH-INT-01`
- **Tên Task**: Kiểm thử tích hợp, Architecture Fitness và Sprint Review
- **Sprint**: [Sprint 09 — Notifications, Dashboard & Audit Log](../README.md) (`PENDING`)
- **Ưu tiên**: P0 · **Ước lượng**: 5h
- **Nguồn**: [US-NOTI-01](../../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time) · [US-DASH-01](../../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log)

## Objective

Thực hiện kiểm thử hồi quy toàn diện (Backend Clean Architecture fitness, PostgreSQL integration, Socket.IO real-time, Frontend checks và Live Browser E2E smoke) để nghiệm thu Sprint 09 trước Developer Review.

## Related Requirements

- [US-NOTI-01](../../../07-Backlog-Roadmap.md#us-noti-01--thông-báo-trong-app-và-real-time)
- [US-DASH-01](../../../07-Backlog-Roadmap.md#us-dash-01--dashboard-tiến-độ-my-tasks-audit-log)
- [Test Plan](../../../08-Test-Plan.md)

## Dependencies

- `NOTI-01`, `NOTI-02`, `NOTI-03`
- `DASH-01`, `DASH-02`, `DASH-03`

## Scope

- Chạy toàn bộ Backend Checks (`typecheck`, `lint`, `test:architecture`, unit + integration tests trên PostgreSQL test DB).
- Chạy toàn bộ Frontend Checks (`format`, `typecheck`, `lint`, `test`, `build`, quét fixture mock trong `dist/`).
- Live Chrome E2E verification kết nối backend + PostgreSQL thật:
  1. Mention trên comment -> Outbox worker -> Notification Bell nhận real-time và đồng bộ badge chưa đọc -> Reconnect tải lại unread -> Đánh dấu đã đọc / đọc tất cả.
  2. Tạo/di chuyển task -> Dashboard metrics cập nhật đúng số DB & Audit timeline ghi sự kiện với `OWNER`/`MANAGER`, từ chối `MEMBER` đúng quyền.
  3. Kiểm tra responsive (`360px` / `1440px`), accessibility (Lighthouse `100` target), zero console errors.
- Lập báo cáo tổng hợp Sprint 09 & cập nhật `Sprint 09 README`, `Sprint Index`, `Reports Index`, `Product Backlog`.

## Out of Scope

- `US-AI-01` (AI Planner Backend) và CI/CD deploy staging/production.

## Implementation Requirements

- Ghi rõ mọi bằng chứng thực tế; đánh dấu `NOT VERIFIED` nếu thiếu bằng chứng ở môi trường nào; không lưu PII/token/password vào báo cáo hay ảnh chụp.

## Acceptance Criteria

- 100% tiêu chí của `NOTI-01..03` và `DASH-01..03` đạt và được kiểm chứng sau chỉnh sửa cuối cùng.
- Không còn lỗi P0/P1 mở; GitHub Actions (nếu chạy) và local backend/frontend regression đều xanh.

## Testing Requirements

- `npm --prefix backend run test:architecture` + `npm --prefix backend test`
- `npm --prefix frontend run typecheck`, `lint`, `format`, `test`, `build`
- Live browser E2E smoke + ảnh chụp chứng cứ đã khử PII.

## Definition of Done

- Báo cáo `docs/reports/06-notifications-dashboard/NOTI-DASH-INT-01-integration-review.md` hoàn thành, cập nhật trạng thái Sprint 09 -> chờ Developer Review.

## Development Report Reference

Chưa có.
