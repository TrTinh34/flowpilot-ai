# UI-04 — Notification Center UI

## Thông tin Task

- Task ID — UI-04
- Sprint — [Sprint 04](../README.md)
- Priority — P1
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-01, UI-02
- Related Requirements — FR-NOTI-01, UC-NOTI-01

## Objective

Triển khai `NotificationBell` trong Header (unread badge) và `NotificationsPage` / `NotificationInbox` dropdown. Sprint 04 dùng mock data + polling interval. Real-time Socket.IO integration được thực hiện khi backend Sprint 05 sẵn sàng.

## Context

- `NotificationBell.tsx` — TODO stub
- `NotificationInbox.tsx` — TODO stub
- `NotificationsPage.tsx` — TODO stub
- Backend notification API chưa tồn tại (Sprint 05)
- Socket.IO client (`socket-client.ts`) đã có nhưng backend chưa triển khai

## Scope

### NotificationBell (Header component)

- Icon `Bell` từ Lucide
- Badge đỏ với unread count khi > 0
- Click mở dropdown inline
- Keyboard accessible: Enter/Space mở, Escape đóng

### NotificationInbox (dropdown panel)

- List 10 notifications mới nhất
- Phân biệt: đã đọc (muted) / chưa đọc (highlight + dot)
- Click item: đánh dấu đã đọc, navigate đến task liên quan
- "Mark all as read" button
- "View all" link → `/notifications`

### NotificationsPage

- Full-page list với pagination
- Filter: All / Unread
- Item: avatar, message text, timestamp, task link
- Empty state khi không có notification

### Mock strategy

```typescript
// src/mocks/fixtures/notification.fixtures.ts
export const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'TASK_ASSIGNED',
    message: 'Alice assigned you to "Set up CI pipeline"',
    taskId: 'mock-task-1',
    isRead: false,
    createdAt: '2026-11-26T10:00:00Z',
  },
  // ...
];
```

API layer check `VITE_USE_MOCK_API` và trả mock data.

### Polling fallback

Khi Socket.IO chưa có: `useQuery` với `refetchInterval: 30_000` để poll notification count.

### Socket.IO readiness

Khi backend Sprint 05 deliver `notifications` event, chỉ cần update `useNotifications` hook để listen event thay vì chỉ poll.

## Acceptance Criteria

- AC-04-01: Bell icon hiển thị unread badge khi có notification chưa đọc
- AC-04-02: Dropdown hiển thị danh sách notification
- AC-04-03: Click notification → mark read + navigate
- AC-04-04: "Mark all as read" cập nhật UI
- AC-04-05: NotificationsPage hiển thị full list với pagination
- AC-04-06: Empty state khi không có notification
- AC-04-07: Mock data isolated (VITE_USE_MOCK_API)

## Development Report Reference

`docs/reports/frontend/UI-04-notification-ui.md`

## Next Task

UI-05 — Collaboration UI.
