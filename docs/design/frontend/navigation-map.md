# Navigation Map

- Public-only — `/login`, `/register`. Xác thực xong chuyển Dashboard theo router hiện tại. Protected routes gồm cả invitation accept. Wildcard dùng NotFound; không tạo link `/403` khi route này chưa tồn tại.
- Workspace group — Dashboard, My Tasks, Projects theo workspace đang chọn, Notifications. Workspace switcher trong sidebar. Workspace Settings mở `/workspaces`.
- Tools — AI Planner. Settings — Workspace Settings, Profile và user menu/logout.
- Projects → Project Settings `/projects/:projectId`, Tasks `/projects/:projectId/tasks` và Board `/projects/:projectId/board`. Tasks/Board → Task Detail `/tasks/:taskId` → Details, Comments, Attachments.
- Header breadcrumb dùng tên được phép đọc từ query hiện có; ví dụ Workspace / Project / Board hoặc Project / Tasks / Task Title. Chuyển workspace bỏ project context cũ và hủy hiện shortcut không hợp lệ. Notification destination chỉ dùng đích đã được resolve.
- Mobile drawer share route map với desktop, đóng sau navigation. Kiểm thử direct URL, history/reload, workspace trống, logout và session restore.
