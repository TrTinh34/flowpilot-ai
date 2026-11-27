# REDESIGN-13 — AI Planner

## 1. Thông tin Task

- **Task ID:** REDESIGN-13
- **Tên Task:** AI Planner
- **Sprint:** Sprint 08 · Timebox C
- **Ngày triển khai:** 2026-11-28
- **Trạng thái:** COMPLETED (code + RTL tests + production bundle check `PASSED`; live browser visual QA gộp vào `REFINE-07` / `REDESIGN-15–16`)
- **Yêu cầu liên quan:** [REDESIGN-13 Spec](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-13-ai-planner.md) · [Screen Specs §9](../../design/frontend/screen-specifications.md)
- **Nguồn bằng chứng:** Vitest/RTL, `typecheck`, `lint`, `format`, `build`, bundle grep check

## 2. Tóm tắt triển khai

Tái cấu trúc AI Planner thành quy trình 4 bước rõ ràng (`1. Brief` → `2. Generate` → `3. Review & Edit` → `4. Confirmed`) dùng Design System V2 (`--ai-text`, `--ai-bg`, `--ai-border`, `PriorityBadge`, `ConfirmDialog`, `Input`, `Textarea`, `LoadingState`, `ErrorState`), tách `AiBriefForm` và `AiPlanDraftEditor` khỏi các stub `// TODO`, thêm example briefs, bỏ hành vi redirect giả sang `/my-tasks`, và bảo vệ hoàn toàn sau cờ `DEV && VITE_USE_MOCK_API === 'true'`.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/features/ai/api/ai-demo.ts` | Created | Loader demo dev-only cho AI Plan fixture |
| `frontend/src/features/ai/components/AiBriefForm.tsx` | Modified | Triển khai brief form (example chips, char counter `tabular-nums`, inline validation) |
| `frontend/src/features/ai/components/AiPlanDraftEditor.tsx` | Modified | Triển khai editor danh sách task theo phase (`PriorityBadge`, sửa inline title, xóa task, `ConfirmDialog`) |
| `frontend/src/pages/ai/AiPlannerPage.tsx` | Modified | Orchestrate 4-step workflow trong Demo mode; hiển thị `EmptyState` rõ khi API chưa bật hoặc ở production |
| `frontend/tests/integration/ai-planner.test.tsx` | Modified | Triển khai 3 ca kiểm thử (Demo off/prod guard, 4-step keyboard flow + edit/confirm, error retry giữ brief) |

## 4. Quyết định kỹ thuật

- Không giả lập tạo task thật hay tự động chuyển hướng sang `/my-tasks` khi confirm trong chế độ Demo; hiển thị trạng thái xác nhận preview rõ ràng.
- Xóa toàn bộ Tailwind palette hardcode (`border-slate-200`, `bg-white`, `bg-red-50`, `PRIORITY_COLORS`).

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Frontend checks | `npm --prefix frontend run typecheck; lint; format; test; build` (16 files, 97 tests, 0 lint warnings) | PASSED |
| AI Planner integration | `tests/integration/ai-planner.test.tsx` (3 tests) | PASSED |
| Production bundle isolation | `Select-String` trên `frontend/dist/assets/*.js` cho `"Set up CI/CD pipeline"` (0 matches) | PASSED |
| Live browser QA (`390/1440px`, contrast, zoom 200%) | Chưa chạy headless browser mới trong phiên | NOT VERIFIED (`REFINE-07` / `REDESIGN-15–16`) |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Đủ 4 bước bằng bàn phím, lỗi giữ draft, confirm demo không ghi task | PASSED | Verified qua `ai-planner.test.tsx` |
| Zero hardcoded hex/slate/red/green classes | PASSED | Dùng hoàn toàn semantic tokens V2 |
| Demo off / production hiển thị trạng thái capability chưa kích hoạt | PASSED | Verified qua test và kiểm tra `dist/assets/*.js` |

## 7. Task tiếp theo

`REDESIGN-14` (Profile & Settings) và `REFINE-07` / `REDESIGN-15–16` (Browser & Visual QA).
