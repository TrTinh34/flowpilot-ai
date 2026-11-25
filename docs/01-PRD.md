# FlowPilot AI — Product Requirements Document
**v0.1 | Draft | MVP**

## Problem & vision
Đội phần mềm nhỏ thường mất thời gian chuyển yêu cầu thành công việc, phân công và tổng hợp tiến độ từ nhiều công cụ. FlowPilot tập trung công việc và hỗ trợ lập kế hoạch bằng AI có người duyệt.

## Target users
Nhóm 3–15 người: Owner quản lý workspace; Manager lập kế hoạch; Member thực hiện công việc. Giả thuyết sản phẩm chưa được xác thực bằng phỏng vấn người dùng.

## Value proposition
Từ mô tả dự án đến danh sách task có thể chỉnh sửa, xác nhận và theo dõi trên Kanban. Khác biệt dự kiến là luồng AI gắn với nghiệp vụ, không chỉ chatbot.

## MVP scope
- **AUTH**: Đăng ký, đăng nhập, refresh, logout
- **WS**: Tạo workspace, mời và quản lý thành viên
- **PROJ**: Tạo, cập nhật, lưu trữ project và quản lý thành viên
- **TASK**: Tạo task, subtask, giao việc, deadline, priority
- **BOARD**: Kanban, kéo thả và sắp xếp task
- **COL**: Bình luận, mention, đính kèm
- **NOTI**: Thông báo trong app và real-time
- **DASH**: Dashboard tiến độ, My Tasks, audit log
- **AI**: Sinh kế hoạch AI, chỉnh sửa và xác nhận

## Out of scope
Sprint, Gantt, dependency graph, RAG, chat nhóm, thanh toán, OAuth2 và GitHub integration chuyển sang phiên bản sau. Không xây microservices trong MVP.

## Success criteria (mục tiêu thử nghiệm, chưa đo)
- 5 người dùng thử hoàn thành luồng tạo project → AI plan → xác nhận → kéo task; ít nhất 4 người hoàn thành không cần trợ giúp.
- So sánh thời gian lập kế hoạch thủ công và có AI trên cùng bộ 5 brief; mục tiêu giảm 30% thời gian trung vị, tính cả thời gian chỉnh sửa.
- Không có lỗi truy cập chéo workspace trong bộ kiểm thử bảo mật.

## Demo journey
Owner tạo workspace, mời Member; Manager tạo project và thêm Member; AI đề xuất task; Manager duyệt; Member cập nhật task; dashboard và notification thay đổi.

## Constraints
Một developer; ngân sách AI/hosting chưa chốt; ưu tiên bản chạy được. Dữ liệu demo giả lập, không gửi dữ liệu bí mật đến AI. Timeline tham chiếu 12 tuần, có thể điều chỉnh.
