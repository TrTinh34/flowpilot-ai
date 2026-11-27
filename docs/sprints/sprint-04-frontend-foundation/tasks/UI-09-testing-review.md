# UI-09 — Frontend Foundation Testing & Integration Review

## Thông tin Task

- Task ID — UI-09
- Sprint — [Sprint 04](../README.md)
- Priority — P1
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-01–08, TASK-BOARD-INT-01
- Related Requirements — NFR-05, NFR-02

## Objective

Chạy toàn bộ regression test suite, bổ sung component tests cho Sprint 04 components, kiểm chứng browser smoke qua các luồng chính, và đóng Sprint 04.

## Scope

### Component Tests (Vitest + RTL)

Mỗi feature UI-01 đến UI-07 cần ít nhất:
- Render test (component mount không lỗi)
- Interaction test (click, type, submit)
- Error state test
- Loading state test
- Empty state test

### Integration Tests

- `AppShellLayout` render với authenticated user
- Sidebar navigation items render + active state
- Dashboard mock data hiển thị
- Notification Bell badge increment/decrement
- AI Planner brief form submit + mock response

### Regression

Chạy toàn bộ test suite hiện có (68+ tests) xác nhận không có regression:
```bash
npm --prefix frontend test
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build
```

### Browser Smoke (manual)

Với backend đang chạy:
1. Login → Dashboard hiển thị
2. Navigate Sidebar: My Tasks, Projects, AI Planner, Notifications
3. Task Detail → Comments tab → Attachments tab
4. AI Planner → Brief form → Generate (mock) → Preview → Confirm
5. Notification Bell → dropdown → mark read
6. Profile page

Viewport: 1440px, 768px, 390px

### Mock API verification

- `VITE_USE_MOCK_API=true`: tất cả mock features hoạt động
- `VITE_USE_MOCK_API=false`: real APIs được call, mock không leak

### Build verification

```bash
npm --prefix frontend run build
# Verify chunk size warning < 1MB sau code splitting
```

## Acceptance Criteria

- AC-09-01: `npm test` pass (tất cả tests kể cả tests Sprint 04)
- AC-09-02: `typecheck` pass
- AC-09-03: `lint` pass (0 errors)
- AC-09-04: `build` pass
- AC-09-05: Browser smoke qua 6 luồng chính đạt
- AC-09-06: Mock và real API tách biệt hoàn toàn
- AC-09-07: Responsive verification tại 390px, 768px, 1024px, 1440px

## Development Report Reference

`docs/reports/frontend/UI-09-testing-review.md`
(Sprint Review báo cáo đây)

## Next Task

Sprint 05 backend: COL + NOTI + DASH APIs.
