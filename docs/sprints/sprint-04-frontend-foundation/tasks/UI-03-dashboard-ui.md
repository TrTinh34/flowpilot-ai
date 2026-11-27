# UI-03 — Dashboard UI

## Thông tin Task

- Task ID — UI-03
- Sprint — [Sprint 04](../README.md)
- Priority — P1
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-01, UI-02
- Related Requirements — FR-DASH-01, UC-DASH-01

## Objective

Triển khai `DashboardPage` với project metrics, task summary và recent activity. Dùng real API khi endpoint có; mock data khi chưa có. Dashboard là màn hình chính sau khi đăng nhập.

## Context

`DashboardPage.tsx` hiện là TODO stub. Backend dashboard API (`/dashboard`, `/me/tasks`, `/audit`) chưa triển khai (Sprint 05 backend). Components `ProjectMetricsChart`, `MyTasksList`, `AuditLogTable` là TODO stubs.

## Scope

### DashboardPage layout

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader: "Dashboard" + workspace name                 │
├───────────────────────────┬─────────────────────────────┤
│ Project Progress Cards     │ My Tasks (top 5)            │
│ (3 cards: To Do / Done /  │ - Task name, priority, due  │
│  In Progress count)        │ - Link to task detail       │
├───────────────────────────┴─────────────────────────────┤
│ Project Status Chart (Recharts BarChart / PieChart)      │
│ - Tasks by status per project                           │
├─────────────────────────────────────────────────────────┤
│ Recent Activity (audit log entries, mock data)           │
└─────────────────────────────────────────────────────────┘
```

### Real API (available)

- `GET /my-tasks` — task được giao cho user hiện tại (đã có từ TASK-02)
- `GET /workspaces` — danh sách workspace (đã có từ WS-02)

### Mock API (required, backend not ready)

- Dashboard stats: task counts by status per project
- Recent activity entries
- Upcoming deadlines

### Recharts integration

Cài Recharts: `npm install recharts`

Sử dụng:
- `BarChart` hoặc `PieChart` cho task distribution
- Responsive container
- Màu dùng `var(--chart-1)` đến `var(--chart-5)` từ design tokens

### Mock data location

`frontend/src/mocks/fixtures/dashboard.fixtures.ts`

## Technical Design

### Mock service pattern

```typescript
// src/mocks/fixtures/dashboard.fixtures.ts
export const mockDashboardStats = { ... };
export const mockRecentActivity = [ ... ];
```

```typescript
// src/features/dashboard/api/dashboard.api.ts
export async function getDashboardStats() {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDashboardStats;
  }
  return apiClient.get('/dashboard');
}
```

### Environment config

`.env.development.local`:
```
VITE_USE_MOCK_API=true
```

Production `.env.production`:
```
VITE_USE_MOCK_API=false
```

## Acceptance Criteria

- AC-03-01: Dashboard hiển thị sau khi login
- AC-03-02: My Tasks section hiển thị task được giao (real API hoặc mock rõ ràng)
- AC-03-03: Progress chart render không lỗi
- AC-03-04: Loading skeleton hiển thị khi đang fetch
- AC-03-05: Empty state khi không có data
- AC-03-06: Responsive 2 cột ≥ 768px, 1 cột < 768px
- AC-03-07: Mock data được label rõ ràng trong UI hoặc console (không phải sản xuất)

## Development Report Reference

`docs/reports/frontend/UI-03-dashboard-ui.md`

## Next Task

UI-04 — Notification Center UI.
