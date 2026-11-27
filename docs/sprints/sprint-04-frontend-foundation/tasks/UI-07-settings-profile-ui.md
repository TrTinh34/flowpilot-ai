# UI-07 — Settings & Profile UI

## Thông tin Task

- Task ID — UI-07
- Sprint — [Sprint 04](../README.md)
- Priority — P2
- Trạng thái — PENDING
- Effort — S (0.5–1 ngày)
- Dependencies — UI-01, UI-02, AUTH-10
- Related Requirements — FR-AUTH-01 (user profile)

## Objective

Triển khai `/settings/profile` với user profile view/edit. Nếu `GET /me` endpoint đã available (AUTH-07), dùng real API. Nếu không, hiển thị thông tin từ auth store.

## Scope

### Profile Page (`/settings/profile`)

```
┌─────────────────────────────────────────┐
│ Profile                                  │
├─────────────────────────────────────────┤
│ [Avatar large]  Display Name            │
│                 email@example.com       │
│                 [Edit Profile]          │
├─────────────────────────────────────────┤
│ Account                                 │
│ Email:  [input, disabled if no API]    │
│ Name:   [input]                         │
│         [Save Changes]                  │
├─────────────────────────────────────────┤
│ Security                                │
│ [Change Password] (placeholder, links  │
│  to future password change flow)        │
└─────────────────────────────────────────┘
```

### Data source

Priority 1: `GET /me` (nếu AUTH-07 HTTP route đã có)
Priority 2: `useAuthStore().user` (từ login response)
Priority 3: Mock data với `VITE_USE_MOCK_API`

### Workspace Settings (link từ Sidebar)

- Hiển thị workspace name, description (read-only nếu không phải Owner)
- Link sang `WorkspaceSettingsPage` hiện có (WS-04)

## Acceptance Criteria

- AC-07-01: Profile page hiển thị user display name và email
- AC-07-02: Edit form pre-fill thông tin hiện tại
- AC-07-03: Không lộ sensitive data trong UI
- AC-07-04: Page accessible tại `/settings/profile`

## Development Report Reference

`docs/reports/frontend/UI-07-settings-profile-ui.md`

## Next Task

UI-08 — Design System Consistency Pass.
