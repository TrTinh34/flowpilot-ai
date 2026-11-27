# Test Plan & Test Cases
**v0.1 | Draft — chưa chạy test**

## Testing Strategy
- **Backend Unit Tests:** **Vitest** (với `vi.mock` / fake adapters cho AI Provider, email và object storage) để kiểm thử business rules, Zod schemas, auth helpers và error mapping.
- **Backend Integration Tests:** **Vitest + Supertest** chạy trên Express app kết nối **PostgreSQL Test Database** riêng (áp dụng `prisma migrate deploy` trước khi chạy, cô lập/reset dữ liệu giữa các test).
- **Frontend Tests:** **Vitest + React Testing Library** cho form validation, component states (loading/error/empty) và UI interactions.
- **End-to-End Tests:** **Playwright** cho luồng nghiệp vụ đầy đủ từ trình duyệt.
- **CI & Staging:** Dùng fake AI/email/storage trong CI; smoke test provider thật ở staging. Không dùng dữ liệu production. Mỗi PR chạy unit/integration; trước release chạy E2E, security và load test.

| ID | Trace | Setup / action | Expected | Status |
|---|---|---|---|---|
| TC-AUTH-01 | FR-AUTH-01 / UC-AUTH-01 | Seed actor đúng quyền; thực hiện luồng chính Đăng ký, đăng nhập, refresh, logout | Đăng nhập đúng trả token; sai trả 401 | Not run |
| TC-WS-01 | FR-WS-01 / UC-WS-01 | Seed actor đúng quyền; thực hiện luồng chính Tạo workspace, mời và quản lý thành viên | Người được mời đúng email chấp nhận một lần | Passed trên PostgreSQL test |
| TC-PROJ-01 | FR-PROJ-01 / UC-PROJ-01 | Seed actor đúng quyền; thực hiện luồng chính Tạo, cập nhật, lưu trữ project và quản lý thành viên | Manager tạo task trong project được cấp quyền | PASSED · bước Manager tạo task qua API PostgreSQL Sprint 03 |
| TC-TASK-01 | FR-TASK-01 / UC-TASK-01 | Seed actor đúng quyền; thực hiện luồng chính Tạo task, subtask, giao việc, deadline, priority | Task được giao xuất hiện trong My Tasks | PASSED · PostgreSQL integration và test giao diện |
| TC-BOARD-01 | FR-BOARD-01 / UC-BOARD-01 | Seed actor đúng quyền; thực hiện luồng chính Kanban, kéo thả và sắp xếp task | Hai cập nhật đồng thời không ghi đè âm thầm | PASSED · PostgreSQL integration và test giao diện |
| TC-COL-01 | FR-COL-01 / UC-COL-01 | Seed actor đúng quyền; thực hiện luồng chính Bình luận, mention, đính kèm | Bình luận hiển thị và người được mention nhận thông báo | Not run |
| TC-NOTI-01 | FR-NOTI-01 / UC-NOTI-01 | Seed actor đúng quyền; thực hiện luồng chính Thông báo trong app và real-time | Reconnect tải lại thông báo chưa đọc | Not run |
| TC-DASH-01 | FR-DASH-01 / UC-DASH-01 | Seed actor đúng quyền; thực hiện luồng chính Dashboard tiến độ, My Tasks, audit log | Số task hoàn thành khớp dữ liệu | Not run |
| TC-AI-01 | FR-AI-01 / UC-AI-01 | Seed actor đúng quyền; thực hiện luồng chính Sinh kế hoạch AI, chỉnh sửa và xác nhận | JSON sai không tạo task; xác nhận hai lần không nhân đôi | Not run |
| TC-SEC-01 | NFR-03 | User workspace A gọi GET/PATCH task B, file B, AI plan B | 404, không lộ dữ liệu | Not run |
| TC-SEC-02 | NFR-03 | Kết nối Socket.IO không JWT hoặc cố gắng join/subscribe room `user:{otherUserId}` / `project:{otherProjectId}` | Handshake bị từ chối hoặc join room bị từ chối (Denied) | Not run |
| TC-SEC-03 | FR-WS-01 | Xóa Owner cuối | 409 | Passed trên PostgreSQL test |
| TC-SEC-04 | FR-WS-01 | Accept invite sai email hoặc hết hạn | 403 hoặc 422; không membership | Passed trên PostgreSQL test |
| TC-TASK-02 | NFR-07 | Hai request move cùng version | Một thành công, một 409 | PASSED · PostgreSQL integration |
| TC-AI-02 | NFR-04 | Provider trả JSON sai hoặc 31 tasks (Zod schema fail) | FAILED; 0 task | Not run |
| TC-AI-03 | NFR-04 | Provider timeout | FAILED; không task | Not run |
| TC-AI-04 | FR-AI-01 | Confirm hai lần đồng thời | Cùng IDs, không duplicate | Not run |
| TC-AI-05 | NFR-03 | Thu hồi quyền trước confirm | 403/404; không task | Not run |
| TC-AI-06 | NFR-04 | Brief yêu cầu đọc tenant khác | Không truy xuất dữ liệu ngoài scope | Not run |
| TC-COL-02 | FR-COL-01 | Upload >10MB hoặc MIME giả | 413 hoặc 422 | Not run |
| TC-AUTH-02 | NFR-02 | Reuse refresh token đã rotate | 401, revoke family | Not run |
| TC-PERF-01 | NFR-01 | 20 concurrent users, 1000 task/project | p95 <500ms cho API không AI | Not run |
| TC-E2E-01 | BR-01/02/03 | Owner invite → project → AI plan → confirm → member move | Task và dashboard đúng, notification nhận được | Not run |

## Release gates
Tất cả luồng MVP và security tests pass; không critical/high defect; báo cáo p95 và AI evaluation lưu kết quả thật. AI evaluation: 5 brief cố định, chấm task relevance, completeness, feasible estimates, schema validity; ghi thời gian và số chỉnh sửa; không tuyên bố đạt mục tiêu PRD trước khi đo. Nếu performance chưa đạt, ghi rõ hạn chế và quyết định release. Backup/restore smoke test trước production.
