# TASK-BOARD-INT-01 — Task & Board integration và review

## 1. Thông tin Task

- Sprint 03 · 2026-11-27 · PARTIAL
- FR-TASK-01, FR-BOARD-01, NFR-07
- Bằng chứng lấy từ kiểm thử và self-review tại revision `1cc5ab5`.

## 2. Tóm tắt triển khai

Đã kiểm chứng vòng đời task trên Edge với API và PostgreSQL test, cùng các ca phân quyền, tenant isolation và concurrency. Sprint còn chờ điều kiện CI.

## 3. File thay đổi

- `docs/08-Test-Plan.md` ghi kết quả các ca Task & Board.
- Sprint Backlog, Task Spec, Reports Index và Product Backlog ghi kết quả review và điều kiện nghiệm thu.
- Prettier chuẩn hóa 10 tệp backend và 13 tệp frontend được báo lỗi.

## 4. Quyết định kỹ thuật

Kiểm chứng revision làm việc hiện tại, gồm commit UI đã có trên nhánh. Browser smoke dùng tiến trình local riêng và dữ liệu fixture trên PostgreSQL test.

## 5. Kết quả kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Backend `test:db:migrate` | PASSED · 4 migration, schema đã cập nhật |
| Backend `test:unit`, `test:architecture`, `test:integration` | PASSED · 68 unit, 5 architecture, 38 integration |
| Frontend `test` | PASSED · 69 test |
| Backend và frontend `lint` và `build` | PASSED · TypeScript chạy trong build. Frontend có cảnh báo Fast Refresh và chunk lớn |
| Backend và frontend `format` | PASSED · chạy lại sau khi chuẩn hóa 23 tệp |
| Edge headless + API + PostgreSQL | PASSED · đăng nhập, tạo và giao task, tạo subtask, My Tasks, chuyển cột bằng phím, sự kiện kéo thả, phục hồi sau HTTP 409 |
| GitHub Actions | NOT VERIFIED · revision kiểm thử chỉ có trên nhánh local |

## 6. Acceptance Criteria

| Tiêu chí | Kết quả |
|---|---|
| Phân quyền và tenant isolation | PASSED · 403 khi thiếu quyền trong project, 404 ngoài tenant, 409 khi ghi project đã archive |
| Concurrency | PASSED · hai yêu cầu move dùng cùng version trả một 200 và một 409 |
| Thao tác không dùng chuột | PASSED · chuyển cột bằng phím mũi tên trên Edge |
| Regression | PASSED · PostgreSQL, unit, architecture và frontend |
| CI xanh | NOT VERIFIED · chờ GitHub Actions trên revision nghiệm thu |

## 7. Vấn đề và blocker

Các lệnh kiểm tra local dùng Node 24, dependencies đã cài và PostgreSQL test hiện có. Nhánh remote chưa có revision cần nghiệm thu.

Ca kéo thả phát sự kiện DOM trên Edge. Động tác kéo bằng con trỏ vật lý chưa được kiểm chứng.

## 8. Ghi chú cho developer

Self-review đối chiếu ca kiểm thử Task API với hợp đồng Board Move. API dùng version để từ chối ghi đè, board tải lại truy vấn sau 409 và điều khiển chọn cột hỗ trợ bàn phím.

## 9. Task tiếp theo

Hoàn tất điều kiện CI và cập nhật Sprint Review sau khi có kết quả trên revision nghiệm thu.
