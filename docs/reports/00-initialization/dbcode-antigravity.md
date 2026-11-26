# Kết nối PostgreSQL bằng DBCode trong Antigravity

## 1. Thông tin Task

- Ngày thực hiện 2026-11-26
- Trạng thái `PARTIAL`
- Task cấu hình môi trường ngoài Sprint. Bằng chứng từ cấu hình cài đặt và truy vấn PostgreSQL trực tiếp.

## 2. Tóm tắt triển khai

Dấu phẩy đứng riêng trong object ở dòng 2 của User Settings gây lỗi JSONC `ValueExpected`. Đã sao lưu file và xóa đúng dấu phẩy. Cấu hình workspace trong repo không có file cần sửa.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `docs/reports/00-initialization/dbcode-antigravity.md` | Thêm | Kết quả và bước thao tác trong IDE |
| `docs/reports/README.md` | Cập nhật | Liên kết báo cáo |

Ngoài repo, thư mục `Antigravity IDE/User` trong AppData Roaming chứa User Settings đã sửa và bản sao `settings.json.flowpilot-20261126.bak`.

## 4. Quyết định kỹ thuật

DBCode 1.39.4 khai báo `dbcode.connections`, driver `postgres` và kiểu lưu `secretStorage`. Dùng giao diện DBCode để lưu password vào Secret Storage. Bật MCP qua lệnh tích hợp của extension sau khi thiết lập quyền chỉ đọc cho các kết nối AI có thể sử dụng. [DBCode MCP](https://dbcode.io/docs/ai/mcp)

## 5. Kết quả kiểm chứng

| Check | Evidence | Status |
|---|---|---|
| Cú pháp User Settings | JSONC báo `ValueExpected` trước sửa, `ConvertFrom-Json` thành công sau sửa | PASSED |
| Development qua terminal | `backend/.env` qua `DATABASE_URL` → `flowpilot_ai`, `public` | PASSED |
| Testing qua terminal | `backend/.env.test` qua `TEST_DATABASE_URL` → `flowpilot_ai_test`, `public` | PASSED |
| PostgreSQL và bảng | Cả hai trả về PostgreSQL 17.10, `users`, `refresh_tokens`, `_prisma_migrations` | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Lưu và mở hai kết nối DBCode | NOT VERIFIED | Cần thao tác Secret Storage và Test Connection trong IDE |
| Hiển thị schema và bảng trong DBCode | NOT VERIFIED | Đã xác minh catalog qua terminal |
| MCP chỉ đọc | NOT VERIFIED | Extension có lệnh tích hợp Antigravity. File MCP hiện rỗng khi kiểm tra |
| An toàn thay đổi | PASSED | Truy vấn trong transaction chỉ đọc. Không sửa source, file môi trường hay dữ liệu |

## 7. Vấn đề và blocker

Secret Storage cần giao diện DBCode của Antigravity. Phiên này thiếu quyền điều khiển giao diện để hoàn tất thao tác lưu và kiểm chứng.

## 8. Ghi chú cho developer

Trong DBCode, dùng Add Connection → PostgreSQL. Cả hai dùng `localhost:5434` và schema `public`. Tạo `FlowPilot AI - Development` với database `flowpilot_ai`, và `FlowPilot AI - Testing` với database `flowpilot_ai_test`. Lấy username và password từ biến môi trường tương ứng và chọn Secret Storage → Test Connection → Save. Mở cây schema và kiểm tra ba bảng.

## 9. Task tiếp theo

Đặt AI Access thành Read-only cho cả hai kết nối. Nếu không có tùy chọn AI Access, có thể dùng chế độ Read Only của toàn bộ kết nối nếu phù hợp với cách sử dụng. Chỉ bật `DBCode: Enable AI Tools in This Editor` sau khi đã xác nhận giới hạn quyền, rồi reload cửa sổ và kiểm tra hai database bằng truy vấn metadata qua MCP.
