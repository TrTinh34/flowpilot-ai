# UI-06 — AI Planner UI

## 1. Thông tin Task

- Task ID — UI-06
- Tên Task — AI Planner UI
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-AI-01, UC-AI-01

## 2. Tóm tắt triển khai

Triển khai `AiPlannerPage` với split-panel layout (input trái / preview phải). State machine 6 states: `empty → generating → preview → confirming → success → error`. Mock AI generation với 2.5s delay. Task list editable (remove per task). Confirm flow với redirect sang My Tasks sau 2s.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/pages/ai/AiPlannerPage.tsx` | Cập nhật | Full implementation — thay thế TODO stub |
| `frontend/src/mocks/fixtures/ai.fixtures.ts` | Tạo (UI-02) | Mock AI plan 4 phases, 12 tasks |

## 4. Quyết định kỹ thuật

- **State machine:** `type State = 'empty' | 'generating' | 'preview' | 'confirming' | 'success' | 'error'` — tường minh hơn boolean flags.
- **Mock generation:** `setTimeout(2500)` simulate AI latency. Response là `mockAiPlan` với 4 phases.
- **Task list state:** `{ phaseIdx, task }[]` flatten từ phases — dễ filter khi remove.
- **Phase rendering:** Re-derive từ original `plan.phases` × filtered `tasks` → hiển thị "All tasks removed" khi phase trống.
- **Confirm:** `setTimeout(1000)` simulate API call. Production: `POST /ai/plan/:id/confirm`.
- **Validation:** description required + max 8000 chars (NFR-04). projectName required. Submit disabled khi generating/confirming.
- **Violet accent:** `var(--color-accent-ai)` cho AI-related elements (icon, summary border).

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Build | `npm run build` → exit 0 | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| Brief form validate required fields | PASSED |
| Generate hiển thị loading skeleton 2.5s | PASSED |
| Preview hiển thị tasks theo phase | PASSED |
| Remove task hoạt động | PASSED |
| Confirm disabled khi không có plan | PASSED |
| Success state + redirect | PASSED |
| AI accent violet applied | PASSED |
| Mock data notice | PASSED |

## 7. Vấn đề và blocker

- Backend `/ai/plan` và `/ai/plan/:id/confirm` chưa có (Sprint 06).
- Regenerate chưa call API — chỉ reset state về `empty`.
- Error state (`error`) chưa có trigger thực — sẽ set khi API timeout/fail.

## 8. Ghi chú cho developer

Khi backend AI sẵn sàng: thay `setTimeout` trong `generate()` bằng `POST /ai/plan`, poll `GET /ai/plan/:id` đến khi `status === 'READY'`, rồi set plan. Thay `setTimeout` trong `confirmPlan()` bằng `POST /ai/plan/:id/confirm`.

## 9. Task tiếp theo

UI-07 — Settings & Profile UI.
