# Sprint 05 — Collaboration

## Sprint Information

- Ngày mở — 2026-11-27
- Trạng thái — IN_PROGRESS
- Tiến độ — 4/5 task
- Nguồn — [US-COL-01](../../07-Backlog-Roadmap.md#us-col-01--bình-luận-mention-đính-kèm)

## Sprint Goal

Thành viên thao tác bình luận, mention và tệp đính kèm trên Task Detail với dữ liệu từ backend.

## Scope

Schema, Comment API, Attachment API, tích hợp giao diện và kiểm thử. Phát sự kiện mention qua outbox thuộc Comment API. Inbox, real-time delivery, Dashboard và AI theo backlog riêng.

## Sprint Backlog

| Task ID | Task | Trạng thái | Dependencies |
|---|---|---|---|
| COL-01 | [Schema và migration](tasks/COL-01-collaboration-schema.md) | COMPLETED | TASK-01 |
| COL-02 | [Comment API và mention](tasks/COL-02-comment-api.md) | COMPLETED | COL-01, TASK-02 |
| COL-03 | [Attachment API và lưu trữ](tasks/COL-03-attachment-api.md) | COMPLETED | COL-01, TASK-02 |
| COL-04 | [Tích hợp giao diện Collaboration](tasks/COL-04-collaboration-frontend.md) | COMPLETED | COL-02, COL-03, UI-05 |
| COL-INT-01 | [Kiểm thử tích hợp và Sprint Review](tasks/COL-INT-01-integration-review.md) | PENDING | COL-01–04 |

## Dependencies

Sprint 03 đã nghiệm thu 7/7 task. Sprint Index ghi Sprint 04 hoàn thành 9/9 task. UI-05 cung cấp giao diện Collaboration để tích hợp.

## Acceptance Criteria

Bình luận và tệp bám quyền truy cập task. Mention giới hạn trong thành viên project và tạo sự kiện outbox. Tệp hợp lệ tối đa 10 MiB. Luồng tích hợp được kiểm chứng với PostgreSQL và fake storage.

## Definition of Done

Theo [Product Backlog](../../07-Backlog-Roadmap.md#definition-of-done). Cần migration, API, UI, regression, browser smoke và GitHub Actions.

## Risks and Blockers

Cần fake storage cho kiểm thử và cấu hình object storage khi triển khai thật. Hiển thị thông báo mention cho người nhận phụ thuộc Notification.

## Sprint Review

COL-01 đã kiểm chứng migration và ràng buộc trên PostgreSQL test. [Báo cáo COL-01](../../reports/05-collaboration/COL-01-collaboration-schema.md)

COL-02 đã kiểm chứng Comment API, quyền theo task và tính nguyên tử của sự kiện mention. [Báo cáo COL-02](../../reports/05-collaboration/COL-02-comment-api.md)

COL-03 đã kiểm chứng upload, danh sách, URL tải xuống và cleanup bằng PostgreSQL và fake storage. [Báo cáo COL-03](../../reports/05-collaboration/COL-03-attachment-api.md)

COL-04 đã nối Task Detail với API thật. [Báo cáo COL-04](../../reports/05-collaboration/COL-04-collaboration-frontend.md)

## Sprint Retrospective

Chờ Sprint Review.
