# COL-03 — Attachment API và lưu trữ

## 1. Thông tin Task

- Sprint 05 · 2026-11-27 · COMPLETED
- FR-COL-01, UC-COL-01

## 2. Tóm tắt triển khai

API đọc metadata phân trang, tải lên một tệp multipart và cấp URL tải xuống có hiệu lực 300 giây. Quyền truy cập dùng chung với Task API.

## 3. File thay đổi

- `backend/src/modules/collaboration/` chứa ports, use cases, Prisma adapter và routes.
- `backend/src/integrations/storage/s3-storage.provider.ts` chứa adapter tương thích S3.
- `backend/src/app.ts`, `backend/src/config/env.ts` và `backend/.env.example` cấu hình storage.
- `backend/tests/` kiểm thử use case và HTTP với PostgreSQL.
- `docs/06-API-Specification.yaml` ghi hợp đồng list, upload và download.

## 4. Quyết định kỹ thuật

- Multer giới hạn một phần multipart tối đa 10 MiB. Application kiểm tra MIME khớp chữ ký PDF, PNG hoặc JPEG.
- Upload object trước khi khóa workspace và project để kiểm tra lại quyền và ghi metadata. Khi lỗi, use case yêu cầu xóa object. Nếu cleanup thất bại, lỗi được ghi qua error middleware.
- Object key được tạo nội bộ. Danh sách và phản hồi upload chỉ trả metadata. URL tải xuống dùng Content-Disposition dạng attachment và phản hồi có cache-control no-store.

## 5. Kết quả kiểm chứng

| Kiểm tra | Bằng chứng |
|---|---|
| Backend | PASSED · 75 unit, 41 integration PostgreSQL, 5 architecture, lint, typecheck, format và build |
| OpenAPI | PASSED · parse YAML thành công |
| S3 thật | NOT VERIFIED · chưa có bucket kiểm thử trong phiên |

## 6. Acceptance Criteria

| Tiêu chí | Bằng chứng |
|---|---|
| Upload, list và tải xuống | PASSED · HTTP lưu metadata, liệt kê tệp và cấp URL bằng fake storage |
| Kiểm tra file, tenant và quyền | PASSED · MIME/chữ ký, tệp đúng 10 MiB, tệp vượt giới hạn, 403 và 404 |
| Cleanup | PASSED · khi ghi metadata thất bại hoặc project chuyển sang archived trong lúc upload |

## 7. Vấn đề và blocker

Ứng dụng cần `S3_BUCKET` và AWS credentials phù hợp để upload hoặc ký URL. Với dịch vụ tương thích S3, dùng `S3_ENDPOINT` và `S3_REGION`. Khi chưa cấu hình storage, upload và ký URL trả 503 sau kiểm tra quyền. npm audit báo cảnh báo ở chuỗi Prisma hiện có.

## 8. Ghi chú cho developer

Các route gồm `GET/POST /api/v1/tasks/:taskId/attachments` và `GET /api/v1/attachments/:attachmentId/download`.

## 9. Task tiếp theo

COL-04 — Tích hợp giao diện Collaboration.
