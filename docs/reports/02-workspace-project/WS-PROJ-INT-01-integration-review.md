# WS-PROJ-INT-01 — Workspace & Project integration và review

## 1. Thông tin Task

- Sprint — 02, Workspace & Project
- Ngày — 2026-11-26
- Trạng thái — COMPLETED
- Yêu cầu liên quan — `FR-WS-01`, `FR-PROJ-01`, `NFR-03`, `TC-WS-01`, `TC-PROJ-01`, `TC-SEC-03`, `TC-SEC-04`

## 2. Tóm tắt triển khai

Đã kiểm chứng hợp đồng, migration, vai trò và cách ly tenant bằng regression trên PostgreSQL thật và browser smoke. Hai job GitHub Actions đều đạt trên commit Sprint 02 `2da836e`.

## 3. File thay đổi

- `docs/08-Test-Plan.md` ghi kết quả WS và phạm vi test liên Sprint.
- Sprint Backlog, Task Spec, Reports Index và Roadmap ghi kết quả và điều kiện còn lại.

## 4. Quyết định kỹ thuật

Kiểm tra mutation role, ownership, invitation và project membership trong transaction dùng khóa workspace. Tenant scope lấy từ membership hiện hành trong PostgreSQL. Các directory GET mới chỉ trả ID, vai trò và display name. Browser dùng fake email preview trong môi trường test, và token lời mời nằm trong URL fragment.

## 5. Kết quả kiểm chứng

| Check | Command or Evidence | Status |
|---|---|---|
| Migration | `npm run test:db:migrate`, 3 migration đã áp dụng trên `flowpilot_ai_test` | PASSED |
| Backend regression | `npm test`, 97 đạt, gồm 62 unit và 35 integration | PASSED |
| Frontend regression | `npm test`, 58 đạt | PASSED |
| Code quality | Format, lint, typecheck và build backend/frontend | PASSED |
| Browser smoke | Tạo Workspace, mời, đăng nhập qua link, chấp nhận, tạo Project, chọn Manager, thêm thành viên và archive | PASSED |
| GitHub Actions | Backend Checks và Frontend Checks đều đạt trên commit `2da836e`. [CI #45853025353](https://github.com/TrTinh34/flowpilot-ai/actions/runs/45853025353) | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Membership, invitation và tenant isolation | PASSED | 404 ngoài tenant, 403 thiếu quyền trong tenant, lời mời sai/hết hạn bị từ chối, hai request accept chỉ tạo một membership |
| Owner cuối và Project archive | PASSED | PostgreSQL concurrency và write vào project đã archive nhận 409 |
| Browser smoke và review | PASSED | Kiểm chứng toàn luồng trong Edge. Review migration, contract và regression Auth. |
| GitHub Actions có bằng chứng | PASSED | Cả hai job thành công trên revision Sprint 02 |

## 7. Vấn đề và blocker

Production cần adapter gửi mail thật trước khi phát lời mời. Local/test dùng preview. Bước Manager tạo task của TC-PROJ-01 chờ Task API Sprint 03. Frontend còn cảnh báo Fast Refresh và bundle trên 500 kB.

Đã khôi phục API development trên cổng 3000 sau khi bổ sung cấu hình ký JWT local và áp dụng hai migration Workspace/Project lên `flowpilot_ai`. Prisma báo schema đã cập nhật, `GET /health` trả 200, Register CORS preflight từ cổng 5173 trả 204 và Workspace thiếu phiên trả 401.

## 8. Ghi chú cho developer

Chạy backend với PostgreSQL đã áp dụng migration Workspace và Project. Các ca test ghi dữ liệu sử dụng test database và cleanup fixture riêng.

## 9. Task tiếp theo

Sprint 02 đã nghiệm thu. Sprint 03 — Task & Board chờ yêu cầu bắt đầu riêng.
