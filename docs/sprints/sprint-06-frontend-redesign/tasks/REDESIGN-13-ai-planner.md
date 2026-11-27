# REDESIGN-13 — AI Planner

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REDESIGN-13 |
| Task Name | AI Planner |
| Sprint ID | Frontend Redesign · Timebox tiếp theo, Sprint ID chờ mở |
| Priority | P1 |
| Status | COMPLETED |
| Estimated Effort | 7h |
| Dependencies | REDESIGN-04, REFINE-03, REFINE-04 |
| Related Requirements | AI Planner · [SRS](../../../02-SRS.md), [Design System V2](../../../design/frontend/design-system.md), [Screen Specs](../../../design/frontend/screen-specifications.md), [Acceptance](../acceptance-criteria.md) |

## Current Implementation
Prototype generate/edit/confirm đã có.

## Existing UI Problems
Form và xử lý trạng thái chưa thành workflow rõ.

## Objective
Định hình AI workflow dễ theo dõi.

## Scope
Brief, examples, progress, draft, confirm và retry demo.

## Out of Scope
AI backend và task thật từ fixture.

## Proposed UI/UX Design
Progress steps và violet accent theo token.

## Technical Design
Demo adapter giữ draft, reducer/state machine đơn giản nếu cần.

## Component Requirements
PageHeader, FieldLabel, Input, Textarea, StepIndicator (4 bước), DraftEditor (dùng PriorityBadge/Badge), ConfirmDialog, LoadingState, ErrorState, FormErrorBanner.

## Layout Requirements
Preview/brief chia pane desktop theo Design System V2 (`rounded-[var(--radius-md)]`, `border-border`, `--ai-text` / `--color-accent-ai`, xóa toàn bộ `border-slate-200`, `bg-white`, `bg-red-50`, `PRIORITY_COLORS` hardcode).

## Responsive Requirements
Mobile một cột, button wrap, không overflow ở 360px.

## Accessibility Requirements
Keyboard edit, `aria-live` / `role="status"` khi generating/confirming, dialog trap & return focus, label hiển thị cho mọi input.

## API Integration Requirements
Contract chưa mount; demo chỉ bật khi `DEV && VITE_USE_MOCK_API === 'true'`, không giả lập confirm thành công ở production hay ghi task thật.

## Implementation Checklist
- [x] Map 4 steps (Brief → Generating → Preview/Edit → Confirmed)
- [x] Tách adapter + áp guard `VITE_USE_MOCK_API`
- [x] Thay hardcoded Tailwind palette bằng Design System V2 tokens & shared UI
- [x] Test fallback/error và production mode

[Báo cáo REDESIGN-13](../../../reports/frontend-redesign/REDESIGN-13-ai-planner.md).

## Expected Deliverables
AI Planner đồng bộ Design System V2 và ranh giới mode rõ ràng.

## Acceptance Criteria
Đủ 4 bước bằng bàn phím, lỗi giữ draft, confirm demo không ghi task, zero hardcoded hex/slate/red/green classes, demo off hiển thị trạng thái capability chưa kích hoạt.

## Testing Requirements
RTL workflow/errors/mode và browser 390/1440.

## Definition of Done
Đạt tiêu chí ở trên và [shared quality gates](../acceptance-criteria.md) phù hợp phạm vi. Ghi trạng thái theo bằng chứng, kèm các mục chưa kiểm chứng.

## Reporting Requirements
Theo [Report Template](../../../reports/REPORT-TEMPLATE.md), ghi quyết định, test evidence, trạng thái và ảnh before/after khi có UI thay đổi.

## Next Task
REDESIGN-16.
