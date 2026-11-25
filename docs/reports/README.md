# Báo cáo triển khai FlowPilot AI

Thư mục này lưu kết quả triển khai, quyết định kỹ thuật và bằng chứng kiểm chứng để tiếp tục công việc giữa các phiên. Phạm vi và thứ tự triển khai lấy từ [Product Backlog & Roadmap](../07-Backlog-Roadmap.md).

## Quy ước

- Dùng [REPORT-TEMPLATE.md](REPORT-TEMPLATE.md). Mỗi Task có một báo cáo chính.
- Gom báo cáo theo thư mục `NN-chu-de`. Dùng `TASK-ID-ten-task.md` nếu đã có Task ID, `ten-giai-doan.md` cho các báo cáo nền tảng khôi phục từ repo.
- `COMPLETED` nghĩa là phạm vi của Task đã hoàn thành. `PARTIAL` nghĩa là còn phần việc chưa hoàn thành. `BLOCKED` nghĩa là có trở ngại ngăn việc tiếp tục.
- Ghi nguồn và loại báo cáo. Dùng `NOT VERIFIED` khi có ghi nhận nhưng thiếu bằng chứng xác minh, và `UNKNOWN` khi không có thông tin.
- Trong bảng Changed Files, ghi đường dẫn từ repository root. Liên kết Markdown dùng đường dẫn tương đối từ file chứa liên kết.

## Danh sách báo cáo

| Task ID | Task Name | Status | Report |
|---|---|---|---|
| — | Project Scaffolding | COMPLETED | [Báo cáo](00-initialization/project-scaffolding.md) |
| — | Project Initialization | COMPLETED | [Báo cáo](00-initialization/project-initialization.md) |
| AUTH-01 | Authentication Database Schema & Migration | COMPLETED | [Báo cáo](01-authentication/AUTH-01-database-schema.md) |
| AUTH-02 | User Registration API | PARTIAL | [Báo cáo](01-authentication/AUTH-02-user-registration.md) |

`AUTH-01` là Task ID của hạng mục database thuộc story `US-AUTH-01`.

## Tiến độ theo Sprint

| Giai đoạn | Tiến độ |
|---|---|
| Nền tảng | Scaffolding và Initialization đã hoàn thành theo README và hiện trạng repo |
| Sprint 1 — Foundation + AUTH | Migration đã áp dụng trên development. Register đã triển khai, còn chờ kiểm chứng ghi dữ liệu trên PostgreSQL test. |
