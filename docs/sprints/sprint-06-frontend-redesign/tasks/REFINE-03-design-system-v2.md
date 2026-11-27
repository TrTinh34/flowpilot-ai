# REFINE-03 — Design System V2 Enhancement

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-03 |
| Task Name | Design System V2 Enhancement |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P0 |
| Status | COMPLETED |
| Estimated Effort | 4h |
| Dependencies | REFINE-02, Developer Approval |
| Related Requirements | [Design System V2](../../../design/frontend/design-system.md), `frontend/src/styles/index.css` |

## Objective
Áp dụng các token Design System V2 đã được phê duyệt vào `frontend/src/styles/index.css`, chuẩn hóa route code-splitting (`React.lazy`) và dọn dẹp các cảnh báo lint/build ở tầng nền tảng.

## Scope
- Bổ sung semantic tokens cho 4 Task Status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) và 4 Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) cho cả Light và Dark theme.
- Chuẩn hóa z-index tokens, `--topbar-height: 56px`, `--sidebar-bg`, `--sidebar-rail-width: 64px`, `scroll-padding-top` cho `#main-content`.
- Điều chỉnh `--foreground-muted` Light cho text phụ đạt contrast tốt hơn và thống nhất radius tokens.
- Thêm `React.lazy` + `Suspense` route-level code splitting trong `AppRouter.tsx` để hạ main bundle JS xuống dưới 500 kB.

## Out of Scope
- Không đổi brand palette Indigo/Violet sang màu khác.
- Không sửa logic auth/API/routing contracts.

## Acceptance Criteria
- `frontend/src/styles/index.css` chứa đủ semantic status, priority, z-index và shell tokens cho Light & Dark.
- `npm --prefix frontend run build` không còn cảnh báo chunk > 500 kB (hoặc giảm rõ rệt qua route chunks).
- Contrast text >= 4.5:1, non-text UI >= 3:1 được đo và ghi lại.

## Testing Requirements
- `typecheck`, `lint`, `format`, `test`, `build`; kiểm tra `ProtectedRoute` / `AppRouter` với `React.lazy` Suspense fallback không gây giật layout.
