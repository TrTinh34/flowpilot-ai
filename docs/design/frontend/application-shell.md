# Application Shell

`AppRouter → ProtectedRoute → AppShellRoute → AppShellLayout → Outlet`. Public Auth dùng AuthLayout. Một main landmark mỗi màn protected, skip link tới main. Header giữ toggle, breadcrumb theo route, workspace/project context, bell và user menu. Actions ưu tiên đặt ở PageHeader nếu cần dùng khi scroll. Search toàn cục chỉ hiển thị sau khi có contract.

Desktop sidebar 232–248px, rail 60–64px khi collapse, workspace switcher trên navigation. Nhóm Workspace, Tools, Settings, shortcut dựa trên dữ liệu project quyền hiện hành. Active state có visual marker và `aria-current`. Dưới 1024px dùng drawer đóng khi chọn route, Escape, backdrop, focus trap và restore. Header co gọn breadcrumb và giữ tooltip/accessible label cho nút icon. Sidebar và body scroll có chuỗi focus tự nhiên. Main `min-width:0`, workspace pages dùng available width, reading/settings dùng max-width riêng.

```text
Desktop
┌───────────────┬───────────────────────────────────────────┐
│ Brand         │ Toggle  Workspace / Project       Bell User│
│ Workspace ▾   ├───────────────────────────────────────────┤
│ Workspace     │ Title                         Primary CTA │
│ Tools         │ Filters / main workspace content           │
│ Settings      │                                           │
│ Account       │                                           │
└───────────────┴───────────────────────────────────────────┘
Mobile
┌────────────────────────────┐
│ Menu  Short context  Bell  │
│ Title         Page action  │
│ Single column or board    │
└────────────────────────────┘
```

Nghiệm thu bằng route navigation, desktop collapse, mobile open/close/return focus, viewport không tràn ngang và không hiển thị shortcut ngoài quyền.
