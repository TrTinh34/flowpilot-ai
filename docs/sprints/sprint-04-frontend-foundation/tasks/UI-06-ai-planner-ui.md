# UI-06 — AI Planner UI

## Thông tin Task

- Task ID — UI-06
- Sprint — [Sprint 04](../README.md)
- Priority — P1
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-01, UI-02
- Related Requirements — FR-AI-01, UC-AI-01

## Objective

Triển khai `AiPlannerPage` với split-panel layout: input brief bên trái, preview plan bên phải. Sprint 04 dùng Fake AI provider (đã có `FakeAiProvider` ở backend) qua mock response hoặc gọi backend nếu endpoint đã sẵn sàng. AI-generated plan luôn là preview — không tạo task trước khi user confirm.

## Context

- `AiBriefForm.tsx` — TODO stub
- `AiPlanDraftEditor.tsx` — TODO stub
- `AiPlannerPage.tsx` — TODO stub
- Backend: AI module stub đã có (`src/modules/ai/`), `FakeAiProvider` đã implement
- OpenAPI: AI endpoints có trong spec (`/ai/plan`, `/ai/plan/:id/confirm`)

## Scope

### AiPlannerPage layout

```
┌─────────────────────────┬───────────────────────────────┐
│ INPUT PANEL             │ PREVIEW PANEL                 │
│                         │                               │
│ Project Description     │ [Empty: "Generate a plan..."] │
│ [Textarea ≤8000 chars]  │   OR                          │
│                         │ Generated Plan:               │
│ Project Name            │  Phase 1: Setup               │
│ [Input]                 │   • Task 1 [edit] [remove]    │
│                         │   • Task 2 [edit] [remove]    │
│ [Generate Plan]         │  Phase 2: Development         │
│                         │   • Task 3 [edit] [remove]    │
│                         │                               │
│                         │ [Regenerate] [Confirm Plan]   │
└─────────────────────────┴───────────────────────────────┘
```

Mobile: stacked (input top, preview bottom).

### States

| State | UI |
|---|---|
| Empty | Illustration + "Describe your project to get started" |
| Generating | Skeleton animation + "Generating your plan..." |
| Preview | Editable task list |
| Editing task | Inline edit form |
| Confirming | Loading spinner on "Confirm Plan" |
| Success | Toast "Plan confirmed! X tasks created" + redirect to project |
| Failure | Error banner + "Try again" |

### AiBriefForm

- Textarea: `name="description"`, max 8000 chars với counter
- Input: `name="projectName"` (required)
- Input: `name="teamSize"` (optional number)
- Submit: "Generate Plan" (disabled saat generating)

### AiPlanDraftEditor

- List phases và tasks từ AI response
- Inline edit: task title, priority, estimated days
- Remove button per task
- "Add task manually" button per phase
- Confirm button: `POST /ai/plan/:id/confirm` → creates tasks

### Mock strategy

```typescript
// src/mocks/fixtures/ai.fixtures.ts
export const mockAiPlan = {
  id: 'mock-plan-1',
  status: 'READY',
  phases: [
    {
      name: 'Phase 1: Setup',
      tasks: [
        { title: 'Set up CI/CD pipeline', priority: 'HIGH', estimatedDays: 2 },
        { title: 'Configure database', priority: 'HIGH', estimatedDays: 1 },
      ]
    },
    // ...
  ]
};
```

Khi `VITE_USE_MOCK_API=true`: sau 2.5s delay, trả `mockAiPlan`.

### Validation

- Description: required, max 8000 chars (theo NFR-04)
- Không gửi request khi generating
- Confirm: disabled khi không có plan

## Acceptance Criteria

- AC-06-01: Brief form validate required fields
- AC-06-02: "Generate Plan" hiển thị loading state trong 2–3s
- AC-06-03: Preview panel hiển thị tasks từ AI response
- AC-06-04: Inline edit task title hoạt động
- AC-06-05: Remove task button xóa task khỏi preview
- AC-06-06: "Confirm Plan" disabled khi không có plan
- AC-06-07: Confirm tạo tasks (mock), hiển thị success toast
- AC-06-08: AI content violet accent (`var(--color-accent-ai)`) applied

## Development Report Reference

`docs/reports/frontend/UI-06-ai-planner-ui.md`

## Next Task

UI-07 — Settings & Profile UI.
