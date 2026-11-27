# REFINE-01 — UI/UX Pro Max Skill Integration

| Thuộc tính | Giá trị |
|---|---|
| Task ID | REFINE-01 |
| Task Name | UI/UX Pro Max Skill Integration |
| Sprint ID | Sprint 08R · Frontend Design Refinement |
| Priority | P0 |
| Status | IN_REVIEW |
| Estimated Effort | 2h |
| Dependencies | REDESIGN-11 |
| Related Requirements | Quy trình phát triển UI/UX toàn dự án · [AGENTS.md](../../../../AGENTS.md) |

## Objective
Xác minh cài đặt `ui-ux-pro-max` Skill và tích hợp quy trình tra cứu Design System, UX guidelines, React/shadcn stack rules vào hướng dẫn làm việc của Agent (`AGENTS.md` và `.kiro/steering/`).

## Scope
- Xác minh `.agents/skills/ui-ux-pro-max/SKILL.md`, Python 3 và `scripts/search.py`.
- Cập nhật `AGENTS.md` (phần Frontend) và `.kiro/steering/` để mọi task frontend được phê duyệt sau này phải tra cứu và kiểm chứng theo `ui-ux-pro-max`, Design System V2 và Page Specs.
- Đảm bảo không áp dụng quy tắc UI lên các task backend-only.

## Out of Scope
- Sửa source code ứng dụng.

## Acceptance Criteria
- Python 3 và `search.py` chạy thành công trên máy local (`--design-system`, `--domain`, `--stack`).
- `AGENTS.md` và `.kiro/steering/` phản ánh đầy đủ quy trình UI/UX Pro Max và tách bạch frontend vs backend.

## Testing Requirements
- Chạy xác minh `python .agents/skills/ui-ux-pro-max/scripts/search.py` cho product, style, ux, react, shadcn.

## Development Report Reference
- [Refinement Planning Report](../../../reports/frontend-redesign/refinement-planning-report.md)
