# UI-02 — Shared UI Component Library

## Thông tin Task

- Task ID — UI-02
- Sprint — [Sprint 04](../README.md)
- Priority — P0
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-01 (AppShellLayout context), AUTH-08 (design tokens)
- Related Requirements — NFR-05, NFR-02 (accessibility)

## Objective

Mở rộng component library với các primitive còn thiếu cần thiết cho Dashboard, Notifications, Collaboration và AI Planner. Đảm bảo mọi component tuân thủ design system (tokens, sizing, accessibility).

## Context

Hiện có: `Button`, `Input`, `Label`, `Card`. Các màn hình tiếp theo cần thêm Skeleton, Badge, Avatar, Dialog/Drawer, Tabs, Select, Tooltip, Textarea, Table, Pagination.

## Scope

### Cài đặt qua shadcn/ui CLI

```bash
npx shadcn@latest add skeleton badge avatar dialog sheet tabs select tooltip textarea
```

Sau đó fix `cn` import path cho mọi component mới (pattern từ UI-02-T1).

### Components custom (không có trong shadcn)

| Component | File | Mô tả |
|---|---|---|
| `PageHeader` | `components/common/PageHeader.tsx` | Title + subtitle + actions slot |
| `EmptyState` | `components/common/EmptyState.tsx` | Icon + title + description + CTA (cập nhật stub) |
| `ErrorState` | `components/common/ErrorState.tsx` | Error icon + message + retry (cập nhật stub) |
| `LoadingState` | `components/common/LoadingState.tsx` | Spinner centered (cập nhật stub) |
| `StatusBadge` | `components/common/StatusBadge.tsx` | Task status chip (TODO/IN_PROGRESS/IN_REVIEW/DONE) |
| `PriorityBadge` | `components/common/PriorityBadge.tsx` | Priority chip (LOW/MEDIUM/HIGH/URGENT) |
| `UserAvatar` | `components/common/UserAvatar.tsx` | Avatar + initials fallback |
| `ConfirmDialog` | `components/common/ConfirmDialog.tsx` | Reusable confirmation dialog |

### Design token compliance

- `button.tsx`: confirm `h-11` default size, `rounded-lg`, white text trên primary
- `input.tsx`: confirm `h-11`, `border-slate-200`, subtle focus ring
- Mọi component dùng CSS custom properties, không hardcode hex

## Technical Design

### StatusBadge variant mapping

```tsx
const statusConfig = {
  TODO:        { label: 'To Do',       className: 'bg-slate-100 text-slate-600' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-50 text-blue-700' },
  IN_REVIEW:   { label: 'In Review',   className: 'bg-yellow-50 text-yellow-700' },
  DONE:        { label: 'Done',        className: 'bg-green-50 text-green-700' },
};
```

### PriorityBadge variant mapping

```tsx
const priorityConfig = {
  LOW:    { label: 'Low',    className: 'bg-slate-100 text-slate-500' },
  MEDIUM: { label: 'Medium', className: 'bg-yellow-50 text-yellow-600' },
  HIGH:   { label: 'High',   className: 'bg-orange-50 text-orange-600' },
  URGENT: { label: 'Urgent', className: 'bg-red-50 text-red-600' },
};
```

## Acceptance Criteria

- AC-02-01: Mọi shadcn component import được với alias `@/components/ui/`
- AC-02-02: `StatusBadge` và `PriorityBadge` render đúng variant
- AC-02-03: `ConfirmDialog` accessible (focus trap, Escape closes)
- AC-02-04: `PageHeader` render title + optional subtitle + optional actions
- AC-02-05: Typecheck, lint pass

## Testing Requirements

- Unit: StatusBadge, PriorityBadge variants
- Component: ConfirmDialog open/close, focus trap
- Manual: dark mode visual check

## Development Report Reference

`docs/reports/frontend/UI-02-shared-components.md`

## Next Task

UI-03 — Dashboard UI.
