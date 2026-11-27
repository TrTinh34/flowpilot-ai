# ENV-01 — Khôi phục schema local cho My Tasks

| Thuộc tính | Giá trị |
|---|---|
| Task ID | ENV-01 |
| Task Name | Khôi phục schema local cho My Tasks |
| Sprint ID | Sprint 06 · Timebox A |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 2h |
| Dependencies | TASK-01, COL-01 |
| Related Requirements | My Tasks · môi trường dev · [SRS](../../../02-SRS.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
GET /api/v1/me/tasks tái hiện 500; PostgreSQL thiếu tasks.

## Existing UI Problems
Workspace có thể hoạt động dù bảng Task thiếu.

## Objective
Khôi phục endpoint thật trên database dev.

## Scope
Xác minh đích, quyền và migration hiện có; áp dụng theo phê duyệt.

## Out of Scope
Sửa business logic, tạo migration, reset DB hoặc seed tài khoản thật.

## Proposed UI/UX Design
Giữ error hữu ích đến khi API hồi phục.

## Technical Design
Kiểm tra status và lịch sử migration; áp dụng deploy vào đích dev đã xác nhận, không gọi reset.

Lệnh từ thư mục `backend/`: chạy `npm exec -- prisma migrate status`; sau khi xác nhận đúng database dev và được phê duyệt, chạy `npm exec -- prisma migrate deploy`, rồi chạy lại status. Bằng chứng planning cho thấy các migration Task, Collaboration và Outbox đang chờ áp dụng. Xem [Frontend Audit](../../../design/frontend/frontend-audit.md).

## Component Requirements
Không đổi component trong corrective task.

## Layout Requirements
Ảnh A dùng baseline.

## Responsive Requirements
Xác minh response trên một viewport và route hiện có.

## Accessibility Requirements
Không thay đổi auth hoặc xử lý token.

## API Integration Requirements
Tái kiểm tra request thật với phiên test hợp lệ.

## Implementation Checklist
- [x] Kiểm tra đích local
- [x] Phê duyệt migration theo yêu cầu hoàn thành Sprint 06
- [x] Deploy ba migration đã có
- [x] Xác nhận migration status
- [x] GET 200 với phiên kiểm thử và 401 khi thiếu token

## Expected Deliverables
Bằng chứng status, 200 và kết quả fixture an toàn.

## Acceptance Criteria
Existing migrations áp dụng, GET thật trả 200 cho phiên hợp lệ; 401 khi thiếu phiên.

## Testing Requirements
test:db:migrate trên test, migrate status trên dev và HTTP smoke.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

[Báo cáo ENV-01](../../../reports/frontend-redesign/ENV-01-my-tasks-local-schema.md).

## Next Task
REDESIGN-09.
