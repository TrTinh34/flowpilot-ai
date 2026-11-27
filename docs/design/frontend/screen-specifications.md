# Screen Redesign Specifications

A–D là ảnh desktop người dùng mô tả trong [audit](frontend-audit.md), các trường hợp khác tham chiếu source hiện hành trong audit. Các phác thảo là cấu trúc bố cục bằng chữ, đang chờ phê duyệt. Shared tokens và gutter dùng [Design System](design-system.md), trạng thái và focus dùng [Component Inventory](component-inventory.md), chế độ dữ liệu theo [API matrix](api-readiness-matrix.md).

## Auth

- Route và mục tiêu — `/login · /register` · Đăng nhập hoặc đăng ký; đổi màn và hiện mật khẩu.
- Hiện trạng — AuthLayout và form thật; phiên restore dùng ProtectedRoute.
- Wireframe — `[Hai pane / brand; form 420px, field stack, error dưới trường; mobile một pane]`.
- Trạng thái — Form pending khóa submit; validation và API error riêng; focus đến lỗi đầu tiên.
- Nghiệm thu — Tại 360px form vừa viewport và tab sequence hoàn thành cả hai luồng; refresh/logout regression đạt.

## Dashboard

- Route và mục tiêu — `/dashboard` · Mở Projects/My Tasks; quick actions chỉ khi có đích hợp lệ.
- Hiện trạng — Fixture trực tiếp, card và activity chưa có dữ liệu thật.
- Wireframe — `[Header workspace / KPI grid 4-2-1 / progress + due dates / activity; full width]`.
- Trạng thái — Skeleton theo khu vực; workspace trống có CTA; production chỉ hiển thị phần có API, demo có nhãn.
- Nghiệm thu — Tổng KPI demo khớp tập dữ liệu; dưới 768px đọc được legend, không scroll toàn trang.

## Workspace

- Route và mục tiêu — `/workspaces · /invitations/accept` · Tạo/chọn workspace, mời và thao tác theo role; accept invite.
- Hiện trạng — Switcher và forms thật; layout chưa phân lớp.
- Wireframe — `[Workspace header / danh sách / tabs hoặc sections Members, Invitations, Settings; invite/create dialog]`.
- Trạng thái — Thành viên, invite pending/expired và lỗi permission riêng; retry duy trì context.
- Nghiệm thu — Owner và Member thấy actions khác nhau; invite lỗi/expired có phản hồi, dialog restore focus.

## Projects

- Route và mục tiêu — `/workspaces/:workspaceId/projects · /projects/:projectId` · Tạo, mở Tasks/Board, quản lý members/archival theo role; lọc dữ liệu đã load nếu có nhãn.
- Hiện trạng — Ảnh C; form inline, pagination khi trống (ảnh C).
- Wireframe — `[Title/breadcrumb và Create / project list-grid / metadata role,status; dialog form có manager select]`.
- Trạng thái — Skeleton cùng mật độ; trống có Create CTA theo quyền; lỗi giữ draft và retry; success sau 201.
- Nghiệm thu — Create có label, manager bắt buộc, giữ dữ liệu khi lỗi; 1920 dùng không gian, 390 một cột.

## My Tasks và Project Tasks

- Route và mục tiêu — `/my-tasks · /projects/:projectId/tasks` · Mở task; Create chỉ ở project có quyền; filter page-level có nhãn khi lọc client.
- Hiện trạng — Ảnh A; 500 local, rows thiếu hierarchy (ảnh A).
- Wireframe — `[Header / filters được hỗ trợ / rows title, status, priority, deadline; project và assignee dùng dữ liệu sẵn có]`.
- Trạng thái — Skeleton rows; empty phân biệt 0 task và 0 kết quả; lỗi 500 có Retry, không trả demo.
- Nghiệm thu — Có thể nhận biết 500 và retry; pagination theo API; mobile stacked rows không mất title/status.

## Board

- Route và mục tiêu — `/projects/:projectId/board` · Kéo thả hoặc dùng move control; card dẫn tới Task Detail.
- Hiện trạng — Native drag/drop, fallback button và version contract đang chạy.
- Wireframe — `[Toolbar + status columns/count / cards và drop indicator; overflow nội bộ trên mobile]`.
- Trạng thái — Skeleton columns; empty column có drop target; xung đột reload và thông báo bằng text.
- Nghiệm thu — 409 giữ thứ tự server; move với keyboard, mobile board scroll nhưng trang không tràn.

## Task Detail và Subtasks

- Route và mục tiêu — `/tasks/:taskId` · Edit và tạo subtask theo quyền, reload version khi 409; link tới board/task list.
- Hiện trạng — Route thật, tabs; page thân rộng hẹp và form lẫn metadata.
- Wireframe — `[Title + status / content và metadata rail / subtasks / Comments và Attachments; mobile stacked]`.
- Trạng thái — Loading giữ shell, 404/403 rõ, form draft và reload; archive read-only.
- Nghiệm thu — Deep link, navigation back, conflict và giới hạn một cấp subtask chạy regression.

## Collaboration

- Route và mục tiêu — `Task Detail · Comments, Attachments` · Gửi mention, upload, tải xuống; hiển thị activity chỉ khi có contract và API.
- Hiện trạng — API thật COL-04; timeline/audit chưa nối.
- Wireframe — `[Thread với avatar/time/content / composer + mention; attachment list + drop zone]`.
- Trạng thái — Giữ draft khi lỗi; upload size/MIME rõ; empty thread và empty file riêng, archived chỉ đọc.
- Nghiệm thu — File đúng byte, label keyboard và thông báo trạng thái; 413/422 có phản hồi, outbox giữ nguyên.

## Notifications

- Route và mục tiêu — `/notifications · Header bell` · Mark read/all ở demo hoặc contract thật; mở task thật có quyền nếu biết đích.
- Hiện trạng — Ảnh B; fixtures và unread state tách (ảnh B).
- Wireframe — `[Reading column / All-Unread / nhóm Today/Earlier / icon theo type / mark read]`.
- Trạng thái — Skeleton; All/Unread empty rõ; retry; demo label không dùng nội dung kỹ thuật.
- Nghiệm thu — Bell và inbox cùng unread count; fixture links không dẫn tới ID giả; production không seed notification.

## AI Planner

- Route và mục tiêu — `/ai/planner` · Generate → Edit → Confirm; Retry, cancel UI chỉ nếu semantics có hỗ trợ.
- Hiện trạng — Fixture generate/edit/confirm kiểu prototype.
- Wireframe — `[Progress steps / brief và prompt examples / draft preview có priority và dependency được model hỗ trợ; mobile một cột]`.
- Trạng thái — Pending có status; lỗi giữ brief, retry; demo confirm chỉ cập nhật state demo.
- Nghiệm thu — Keyboard đi hết luồng demo, không tạo task thật từ mock, success phân biệt demo và production.

## Profile và Settings

- Route và mục tiêu — `/settings/profile` · Đi tới workspace settings, logout qua menu; email và displayName chỉ đọc.
- Hiện trạng — Ảnh D; thông tin account lặp; không có API update (ảnh D).
- Wireframe — `[Identity header / Account section / link Workspace settings; tối đa 760px]`.
- Trạng thái — Loading auth shell; xử lý mất phiên; chỉ có success state cho hành động có thật.
- Nghiệm thu — Tên/email có label rõ, profile không có edit/password/2FA giả, 360px không overflow.

## Route states

- Route và mục tiêu — `* · auth restore · resource 403/404` · Quay lại Dashboard hoặc Login theo ngữ cảnh, retry nếu phù hợp.
- Hiện trạng — NotFoundPage đã nối, ForbiddenPage có file nhưng không có /403 route.
- Wireframe — `[Shell đúng context / state icon, title và hành động có ích]`.
- Trạng thái — Auth pending không lóe nội dung protected, phân biệt 403/404/500.
- Nghiệm thu — Deep link hợp lệ giữ route, unknown mở NotFound và không vòng lặp điều hướng.

