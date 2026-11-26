# AUTH-11 — Frontend & Backend Integration

**Nghiệm thu 2026-11-26 — COMPLETED.** Đã nối Current User vào SessionProvider. Edge headless với PostgreSQL test xác nhận hồ sơ xuất hiện sau Login và reload, cùng luồng Register, lỗi email trùng/credentials sai và Logout. Client regression 54/54 đạt. Các ghi chú blocker bên dưới là lịch sử trước khi chốt hợp đồng.

## 1. Thông tin Task

- Task ID — AUTH-11
- Sprint — 01, Foundation + AUTH
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-AUTH-01`, `NFR-02`, `UC-AUTH-01`

## 2. Tóm tắt triển khai

Register và Login tiếp tục dùng endpoint hiện hành. Bootstrap phiên và retry sau 401 dùng chung refresh. Protected page có thao tác Sign out, hiển thị lỗi và giữ phiên cho phép thử lại khi server chưa xác nhận thu hồi.

## 3. File thay đổi

| File | Action | Description |
|---|---|---|
| `frontend/src/services/api-client.ts`, `frontend/src/features/auth/api/auth.api.ts` | Cập nhật | Refresh single-flight, khóa cookie và điều kiện retry |
| `frontend/src/app/store/auth.store.ts`, `frontend/src/app/providers/SessionProvider.tsx` | Cập nhật | Theo dõi phiên và ngăn response cũ tác động phiên mới |
| `frontend/src/features/auth/hooks/useLogout.ts`, `frontend/src/pages/InitStatusPage.tsx` | Cập nhật | Sign out và phản hồi lỗi |
| `frontend/tests/integration/auth-session-client.test.ts` | Tạo | Kiểm chứng Axios adapter, refresh, login/register errors và logout |
| Sprint Index, Sprint Backlog, Reports Index, Task Spec và Product Backlog | Cập nhật | Tiến độ và bằng chứng |

## 4. Quyết định kỹ thuật

- Frontend giữ access token trong memory và dùng TTL do backend trả về. Cookie do browser quản lý theo `withCredentials`.
- Web Locks tuần tự hóa Login, Refresh và Logout giữa tab cùng origin trên browser hỗ trợ. Fallback dùng queue trong tab. Bootstrap và concurrent 401 dùng chung một promise refresh trong tab.
- Chỉ tự retry một lần nếu một request có Bearer bị 401 và vẫn thuộc phiên ban đầu. Lỗi của các endpoint Auth đi thẳng về caller.
- Logout chỉ chuyển về Login sau khi server trả thành công hoặc 401 cho phiên đã không hợp lệ. Lỗi mạng hoặc 5xx hiển thị lỗi để thử lại.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Frontend | `npm run test`, 54 đạt. 4 ca integration client mới chạy lại và đạt. | PASSED |
| Frontend build, typecheck, lint | Build và typecheck đạt. Lint có một warning React Fast Refresh sẵn có. Build báo chunk >500 KB. | PASSED |
| Backend PostgreSQL | `npm run test:integration`, 26 đạt | PASSED |
| Browser với PostgreSQL test | Edge headless qua CORS thật. Register thành công, email trùng hiển thị lỗi, Login sai bị từ chối, Login đúng nhận cookie HttpOnly, reload khôi phục phiên, Sign out chuyển về Login và xóa cookie. | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Register, Login, Refresh và Logout | PASSED | Client, PostgreSQL API test và browser flow đã đạt. |
| Điều phối refresh đồng thời | PASSED | Client test single-flight, khóa dùng chung và stale session. Chưa chạy race đa tab trên browser thật. Phạm vi fallback là một tab. |
| Current User | BLOCKED | OpenAPI chưa định nghĩa endpoint |

## 7. Vấn đề và blocker

Current User chờ hợp đồng AUTH-07. Browser thiếu Web Locks chỉ có điều phối trong tab. Reports Index có liên kết AUTH-10 nhưng báo cáo đích chưa có trong workspace lúc bắt đầu. Trạng thái AUTH-10 lấy từ Sprint Backlog và code hiện có.

## 8. Ghi chú cho developer

Review [API client](../../../frontend/src/services/api-client.ts) cho refresh và retry, và [SessionProvider](../../../frontend/src/app/providers/SessionProvider.tsx) cho bootstrap. Dùng PostgreSQL test và mở frontend qua origin nằm trong CORS allowlist.

## 9. Task tiếp theo

Chốt hợp đồng và tích hợp Current User, rồi hoàn tất kiểm chứng AUTH-11 trước khi nghiệm thu Sprint.
