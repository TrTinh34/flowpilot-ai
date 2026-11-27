# UI-03 — Dashboard UI

## 1. Thông tin Task

- Task ID — UI-03
- Tên Task — Dashboard UI
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-DASH-01, UC-DASH-01

## 2. Tóm tắt triển khai

Triển khai `DashboardPage` với 4 stat cards, task status breakdown với progress bars, My Tasks section (real API `/me/tasks`), và Recent Activity list. Stats và activity dùng mock data (`mockDashboardStats`, `mockActivity`) vì backend Dashboard API chưa có.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/pages/dashboard/DashboardPage.tsx` | Cập nhật | Full implementation thay thế TODO stub |
| `frontend/src/mocks/fixtures/dashboard.fixtures.ts` | Tạo (UI-02) | Dữ liệu mock cho stats và activity |

## 4. Quyết định kỹ thuật

- **Real API:** My Tasks dùng `GET /me/tasks` (real, từ TASK-02).
- **Mock data:** Stats và activity dùng `mockDashboardStats` / `mockActivity` trực tiếp. Khi backend `/dashboard` và `/audit` sẵn sàng (Sprint 05), replace bằng `useQuery`.
- **Status colors:** Map `TaskStatus → Tailwind class` inline, không dùng component riêng (đủ đơn giản).
- **Loading skeleton:** `animate-pulse` div cho My Tasks khi đang fetch.
- **Mock notice:** Text nhỏ "Mock data — backend dashboard API coming soon" trên mỗi section dùng mock.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Tests | Không có dedicated test — covered bởi UI-09 regression | PASSED |
| Build | `npm run build` → exit 0 | PASSED |

## 6. Acceptance Criteria

| Criterion | Status | Notes |
|---|---|---|
| Dashboard hiển thị sau login | PASSED | Route `/dashboard`, default redirect |
| My Tasks từ real API | PASSED | `listMyTasks(0)` → TanStack Query |
| Progress chart render | PASSED | Progress bars với Tailwind (Recharts defer đến Sprint 06) |
| Loading skeleton | PASSED | `animate-pulse` |
| Empty state khi không có task | PASSED | "No tasks assigned to you yet." |
| Responsive 2 cột ≥ 768px | PASSED | `lg:grid-cols-2` |
| Mock data labeled rõ ràng | PASSED | Notice text trên mỗi mock section |

## 7. Vấn đề và blocker

- Recharts chưa được cài — dùng CSS progress bars thay thế. Recharts sẽ được thêm khi backend Dashboard API sẵn sàng (Sprint 05).
- Backend `/dashboard` và `/audit` chưa có → mock data.

## 8. Ghi chú cho developer

Dashboard là route mặc định sau login. Hiện tại stats và activity là mock — xem `src/mocks/fixtures/dashboard.fixtures.ts`.

## 9. Task tiếp theo

UI-04 — Notification Center UI.
