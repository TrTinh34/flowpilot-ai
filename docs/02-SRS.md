# SRS — Software Requirements Specification
**v0.1 | Draft**

## Business requirements
BR-01: Tập trung quản lý công việc (WS, PROJ, TASK, BOARD).
BR-02: Giảm công sức lập kế hoạch (AI).
BR-03: Cộng tác và minh bạch tiến độ (COL, NOTI, DASH).
BR-04: Bảo vệ dữ liệu và phân quyền (AUTH và mọi module).

## Functional requirements & rules
| ID | Requirement | Actor | Business rule | Acceptance criterion |
|---|---|---|---|---|
| FR-AUTH-01 | Đăng ký, đăng nhập, refresh, logout | Guest / User | Email duy nhất; refresh token xoay vòng và thu hồi | Đăng nhập đúng trả token; sai trả 401 |
| FR-WS-01 | Tạo workspace, mời và quản lý thành viên | Owner / Admin | Owner cuối không được rời; lời mời hết hạn sau 48 giờ | Người được mời đúng email chấp nhận một lần |
| FR-PROJ-01 | Tạo, cập nhật, lưu trữ project và quản lý thành viên | Owner / Admin / Manager | Project thuộc đúng workspace; project lưu trữ chỉ đọc | Manager tạo task trong project được cấp quyền |
| FR-TASK-01 | Tạo task, subtask, giao việc, deadline, priority | Manager / Member | Assignee thuộc project; subtask cùng project; deadline hợp lệ | Task được giao xuất hiện trong My Tasks |
| FR-BOARD-01 | Kanban, kéo thả và sắp xếp task | Manager / Member | Kiểm tra version khi di chuyển; cập nhật thứ tự nguyên tử | Hai cập nhật đồng thời không ghi đè âm thầm |
| FR-COL-01 | Bình luận, mention, đính kèm | Manager / Member | Mention chỉ thành viên project; file tối đa 10 MB | Bình luận hiển thị và người được mention nhận thông báo |
| FR-NOTI-01 | Thông báo trong app và real-time | User | Chỉ người nhận đọc hoặc đánh dấu đã đọc | Reconnect tải lại thông báo chưa đọc |
| FR-DASH-01 | Dashboard tiến độ, My Tasks, audit log | Manager / Member | Thống kê theo quyền; audit chỉ Owner/Admin/Manager trong phạm vi | Số task hoàn thành khớp dữ liệu |
| FR-AI-01 | Sinh kế hoạch AI, chỉnh sửa và xác nhận | Manager | Không tạo task trước xác nhận; xác nhận idempotent | JSON sai không tạo task; xác nhận hai lần không nhân đôi |

## Authorization matrix
Owner/Admin quản lý workspace và mọi project trong workspace; chỉ Owner chuyển quyền sở hữu. Manager là role cấp project, quản lý project được giao. Member chỉ đọc project được tham gia, cập nhật trạng thái task được giao, bình luận và upload; không tạo/giao/xóa task. Owner/Admin/Manager tạo và giao task, di chuyển mọi task trong project. Người dùng chỉ xem notification của mình. Quyền được kiểm tra ở backend cho từng resource, kể cả WebSocket và AI. Mọi truy cập resource ngoài workspace trả 404; thiếu quyền trong phạm vi trả 403.

## Lifecycle
Task: TODO → IN_PROGRESS → IN_REVIEW → DONE; cho phép chuyển ngược hoặc chuyển trực tiếp giữa các trạng thái. Priority: LOW/MEDIUM/HIGH/URGENT. Project: ACTIVE/ARCHIVED. Invitation: PENDING/ACCEPTED/REVOKED/EXPIRED. AI plan: GENERATING/READY/FAILED/CONFIRMED. Workspace role: OWNER/ADMIN/MEMBER; project role: MANAGER/MEMBER.

## Non-functional requirements
- NFR-01: p95 API không AI dưới 500 ms với 20 concurrent users, 1.000 task/project, đo trên staging; chưa xác nhận.
- NFR-02: BCrypt, HTTPS production, access token 15 phút, refresh 7 ngày; không log token/password.
- NFR-03: Kiểm tra tenant isolation trên mọi API, file, event và AI.
- NFR-04: AI timeout 60 giây, tối đa 30 task/plan, 5 lần tạo/người/giờ; validate schema và nội dung trước lưu.
- NFR-05: Responsive 360px trở lên; Kanban có thao tác thay thế kéo thả bằng nút chọn trạng thái.
- NFR-06: Migration có version; lỗi có request ID; backup hàng ngày mục tiêu RPO 24h, RTO 4h (cần diễn tập).
- NFR-07: Các thao tác nhiều bản ghi phải transactional; version conflict trả 409.
