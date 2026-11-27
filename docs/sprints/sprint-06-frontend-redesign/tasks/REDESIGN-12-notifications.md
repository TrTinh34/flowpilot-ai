# REDESIGN-12 — Notification Center

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-12 |
| Task Name | Notification Center |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 6h |
| Dependencies | REDESIGN-04, REFINE-03, REFINE-04 |
| Related Requirements | Bell và Inbox · [SRS](../../../02-SRS.md), [Design System V2](../../../design/frontend/design-system.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Hai state fixture riêng.

## Existing UI Problems
Unread count và links thiếu nhất quán.

## Objective
Đồng bộ Inbox với Header.

## Scope
Shared data source, grouped inbox, demo mode và label.

## Out of Scope
Notification backend, WebSocket, link giả.

## Proposed UI/UX Design
Reading column, All/Unread, action theo khả năng.

## Technical Design
Demo store source duy nhất, adapter chỉ bật dev flag.

## Component Requirements
NotificationBell, shared Notification store/adapter, Tabs (`All` / `Unread`), Badge, Button, EmptyState; xóa stub `NotificationInbox.tsx` nếu không dùng hoặc chuyển thành component thật.

## Layout Requirements
Reading width ≤820px; tuân thủ Design System V2 (`rounded-[var(--radius-md)]`, `border-border`, `tabular-nums`, không hardcode hex).

## Responsive Requirements
360 rows wrap và mark action có chỗ (`>= 24px` target / `44px` mobile hit area).

## Accessibility Requirements
Unread có label (`role="status"` cập nhật số lượng có ngữ cảnh), bell accessible name, keyboard Escape trả focus.

## API Integration Requirements
Demo chỉ bật khi `import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true'`; production hiển thị EmptyState thật; routes OpenAPI chưa mount.

## Implementation Checklist
- [x] Tách fixtures và áp guard `VITE_USE_MOCK_API`
- [x] Đồng bộ state giữa Bell và Inbox
- [x] Áp Design System V2 tokens, Tabs, Badge, EmptyState và xóa hardcoded hex
- [x] Test mode on/off và production bundle

[Báo cáo REDESIGN-12](../../../reports/frontend-redesign/REDESIGN-12-notifications.md).

## Expected Deliverables
Inbox/Bell dùng cùng state theo Design System V2.

## Acceptance Criteria
Mark read ở bell cập nhật inbox ngay; demo off/production không seed `mockNotifications`; zero hardcoded colors hay `rounded-xl` trên panel.

## Testing Requirements
RTL grouped/read sync, browser keyboard.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
