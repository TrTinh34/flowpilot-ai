# REFINE-07 — Regression Testing & Visual QA (Post-Refinement Gate)

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-07 |
| Task Name | Regression Testing & Visual QA |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P0 |
| Status | PENDING |
| Estimated Effort | 5h |
| Dependencies | REFINE-05A, REFINE-05B, REFINE-06 |
| Related Requirements | [Acceptance Criteria](../acceptance-criteria.md), [Test Plan](../../../08-Test-Plan.md) |

## Objective
Kiểm chứng hồi quy toàn diện (automated + browser + responsive + accessibility + API integration) cho tất cả màn hình từ `REDESIGN-01` đến `REDESIGN-11` sau refinement, làm cổng nghiệm thu trước khi triển khai `REDESIGN-12`..`REDESIGN-16`.

## Scope
- Chạy đầy đủ frontend gates (`typecheck`, `lint` 0 warnings, `format`, `test`, `build`) và backend integration regression liên quan.
- Kiểm thử trình duyệt thật (kết nối backend + PostgreSQL test) cho các luồng: Auth/Refresh/Logout, Protected Routes, Workspace/Invites/RBAC, Projects/Archive, My Tasks/Project Tasks, Kanban DnD + keyboard + 409 Conflict, Task Detail/Subtasks, Comments/Mentions/Attachments.
- Kiểm tra viewport matrix (`360, 390, 768, 1024, 1280, 1440, 1920px`), `scrollWidth <= viewport + 1px`, contrast WCAG 2.2 AA, 200% text zoom, `prefers-reduced-motion`, keyboard-only navigation & focus-not-obscured.
- Chụp và so sánh screenshots trước/sau (lưu đã khử PII tại `docs/reports/frontend-redesign/evidence/refine/`).

## Out of Scope
- Không triển khai `REDESIGN-12..14` trong task này.

## Acceptance Criteria
- 100% check `typecheck`, `lint` (0 warnings), `format`, `test`, `build` đạt.
- Không còn lỗi P0/P1 mở trên các màn đã refine (`REDESIGN-02..11`).
- Mục `contrast / zoom 200% / reduced motion` trước đây bị `NOT VERIFIED` ở `REDESIGN-06/08/09/10/11` được kiểm chứng và ghi bằng chứng đầy đủ.

## Testing Requirements
- `npm --prefix frontend run typecheck; lint; format; test; build`; browser smoke + before/after screenshot comparison.
