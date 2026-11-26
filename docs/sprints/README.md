# Sprint FlowPilot AI

[Product Backlog & Roadmap](../07-Backlog-Roadmap.md) quản lý ưu tiên và kế hoạch toàn dự án. Index liệt kê các Sprint đã mở và lưu lịch sử nghiệm thu.

| Sprint ID | Tên | Mục tiêu | Trạng thái | Tiến độ | Dependencies | Tài liệu |
|---|---|---|---|---|---|---|
| Sprint 01 | Foundation + AUTH | Hoàn thành nền tảng monorepo, CI và luồng Authentication | COMPLETED | 13/13 Task hoàn thành. GitHub Actions đạt. | Hoàn tất | [Sprint 01](sprint-01-authentication/README.md) |
| Sprint 02 | Workspace & Project | Tạo workspace, mời thành viên và quản lý project theo quyền | IN_PROGRESS | 7/8 Task hoàn thành | Auth, PostgreSQL test, RBAC và tenant isolation | [Sprint 02](sprint-02-workspace-project/README.md) |

## Nguồn quản lý

- **Sprint Backlog trong Sprint README** là nơi cập nhật trạng thái chính thức của từng Task và tổng hợp tiến độ Sprint.
- **Task File** mô tả yêu cầu, phạm vi, dependencies và tiêu chí nghiệm thu.
- **Development Report** ghi kết quả và bằng chứng theo phiên. [Reports Index](../reports/README.md) dùng để tra cứu báo cáo.
- **Product Backlog** giữ thứ tự ưu tiên và các mốc dự án. Liên kết đến Sprint để xem trạng thái từng Task.

## Trạng thái

| Trạng thái | Ý nghĩa |
|---|---|
| PENDING | Chưa bắt đầu |
| IN_PROGRESS | Đang triển khai hoặc kiểm chứng |
| IN_REVIEW | Chờ review |
| COMPLETED | Mọi tiêu chí bắt buộc đã được kiểm chứng |
| PARTIAL | Đã hoàn thành một phần, còn thiếu phạm vi hoặc bằng chứng |
| BLOCKED | Có trở ngại đang ngăn Task tiếp tục |

Dùng [Sprint Template](SPRINT-TEMPLATE.md) và [Task Template](TASK-TEMPLATE.md) khi tạo tài liệu mới.
