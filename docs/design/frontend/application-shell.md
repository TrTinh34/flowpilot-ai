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

REDESIGN-04 dùng sidebar 240px và rail 64px. Workspace switcher và menu tài khoản dùng Radix DropdownMenu. Drawer dưới breakpoint 1024px dùng Radix Dialog. Breadcrumb lấy workspace từ route hoặc lựa chọn hiện hành, lấy tên project/task từ query cache theo phiên. Shell chỉ tải danh sách workspace. Project shortcuts xuất hiện khi route hiện tại có project đọc được.
