# Sprint 06 — Frontend Redesign Planning

## 1. Thông tin

- 2026-11-27 · Planning đã lập, chờ review.
- Baseline `c5b0aa5`, bốn ảnh desktop do người dùng cung cấp và HTTP/Prisma diagnostic chỉ đọc.

## 2. Phạm vi đã lập

Frontend Audit, Design System, component inventory, app shell, screen inventory, screen specs và wireframes, navigation, API matrix, Sprint Backlog, dependency graph, quality gates và 17 task specs. [Sprint 06](../../sprints/sprint-06-frontend-redesign/README.md) · [Frontend Audit](../../design/frontend/frontend-audit.md)

## 3. Tài liệu và quyết định

Thiết kế đề xuất trong `docs/design/frontend/`. Sprint task tracker và acceptance trong `docs/sprints/sprint-06-frontend-redesign/`. Roadmap, Sprint/Reports Index, Design Index, AGENTS và Kiro đã đồng bộ. Backlog 108 giờ dự kiến chia 31/39/38 giờ. Timebox A kéo dài hai tuần, các đợt sau mở riêng.

## 4. Kiểm chứng hiện trạng

Đã kiểm tra ứng dụng local, route mounts, API modes và schema bằng HTTP/SQL chỉ đọc. GET My Tasks tái hiện 500, catalog thiếu `tasks`, Prisma trả `P2021`. Migration status xác nhận Task, Collaboration và Outbox chưa áp dụng trên local. ENV-01 ghi thủ tục khôi phục theo migration có sẵn. Log lịch sử tiến trình đang chạy chưa có trong phiên.

Edge kiểm tra Login ở 390 và 1440px, nút hiện mật khẩu và chuyển hướng My Tasks khi thiếu phiên. Màn protected dùng 4 ảnh người dùng làm baseline.

Đã kiểm tra 17 task specs, các liên kết tương đối trong tài liệu mới và `git diff --check`.

## 5. Rủi ro và approval

Fixture hiện được dùng trực tiếp ở một số màn. Notification, dashboard/audit và AI backend chưa mount. S3 thật cần cấu hình. Wireframe là phác thảo bằng chữ, chưa có mockup render. Task triển khai và visual QA ở trạng thái pending. Planning không chạy bộ regression triển khai.

## 6. Task tiếp theo

Developer duyệt direction trong REDESIGN-01. Sau khi duyệt, [REDESIGN-02](../../sprints/sprint-06-frontend-redesign/tasks/REDESIGN-02-design-system.md) là task UI triển khai đầu tiên. [ENV-01](../../sprints/sprint-06-frontend-redesign/tasks/ENV-01-my-tasks-local-schema.md) là corrective task độc lập.
