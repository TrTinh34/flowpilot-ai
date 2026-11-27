# Sprint 04 — Frontend Foundation & MVP Interactive Prototype: Implementation Report

## 1. Thông tin

- Sprint — 04
- Ngày — 2026-11-27
- Trạng thái — COMPLETED
- Tasks — UI-01 đến UI-09 (9/9)

---

## 2. Tóm tắt triển khai

Hoàn thành toàn bộ 9 tasks của Sprint 04. Tất cả màn hình MVP đã có implementation — không còn TODO stub nào trong scope. Application Shell với Sidebar đầy đủ và Header được wrap quanh mọi protected route. Mock data được tách biệt rõ ràng khỏi production code.

---

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/app/store/workspace.store.ts` | Tạo | Zustand store cho active workspace, persist localStorage |
| `frontend/src/features/workspace/components/WorkspaceSwitcher.tsx` | Cập nhật | Dropdown hoàn chỉnh thay thế TODO stub |
| `frontend/src/layouts/AppShellLayout.tsx` | Cập nhật | Full AppShell: Sidebar (logo, nav, user menu, collapse), Header (hamburger, NotifBell) |
| `frontend/src/features/auth/hooks/useLogout.ts` | Cập nhật | Thêm clearWorkspace khi logout |
| `frontend/src/app/router/AppShellRoute.tsx` | Tạo | Outlet wrapper cho AppShellLayout |
| `frontend/src/app/router/AppRouter.tsx` | Cập nhật | Routes đầy đủ: Dashboard, Notifications, AI Planner, Profile, 404 |
| `frontend/src/pages/errors/NotFoundPage.tsx` | Cập nhật | 404 page hoàn chỉnh |
| `frontend/src/pages/settings/ProfilePage.tsx` | Tạo | User profile page |
| `frontend/src/mocks/fixtures/dashboard.fixtures.ts` | Tạo | Mock dashboard stats và activity |
| `frontend/src/mocks/fixtures/ai.fixtures.ts` | Tạo | Mock AI plan với 4 phases |
| `frontend/src/mocks/fixtures/notification.fixtures.ts` | Tạo | Mock notifications |
| `frontend/src/mocks/fixtures/collaboration.fixtures.ts` | Tạo | Mock comments và attachments |
| `frontend/src/pages/dashboard/DashboardPage.tsx` | Cập nhật | Dashboard hoàn chỉnh: stats, task list, activity |
| `frontend/src/pages/notification/NotificationsPage.tsx` | Cập nhật | Full notifications inbox với filter |
| `frontend/src/pages/ai/AiPlannerPage.tsx` | Cập nhật | AI Planner split-panel UI hoàn chỉnh |
| `frontend/src/features/notification/components/NotificationBell.tsx` | Cập nhật | Bell + badge + dropdown trong Header |
| `frontend/src/features/collaboration/components/CommentSection.tsx` | Cập nhật | Comment thread + compose |
| `frontend/src/features/collaboration/components/AttachmentUploader.tsx` | Cập nhật | Upload zone + file validation + mock progress |
| `frontend/src/features/task/components/TaskDetailDrawer.tsx` | Cập nhật | Thêm Tabs: Details / Comments / Attachments |
| `frontend/src/components/ui/tabs.tsx` | Tạo | shadcn Tabs (cn import fixed) |
| `frontend/tests/integration/protected-routes.test.tsx` | Cập nhật | Tests phản ánh router mới (NotFoundPage, redirect /dashboard) |
| `frontend/src/pages/InitStatusPage.tsx` | Cập nhật | Remove logoutError ref sau khi useLogout refactor |
| `docs/sprints/sprint-04-frontend-foundation/README.md` | Cập nhật | 9/9 COMPLETED |
| `docs/sprints/README.md` | Cập nhật | Sprint 04 COMPLETED |

---

## 4. Quyết định kỹ thuật

**Mock data strategy:** Fixtures trong `src/mocks/fixtures/` tách biệt hoàn toàn. API layer sẽ check `VITE_USE_MOCK_API` khi backend ready. Hiện tại mock được import trực tiếp trong components.

**AppShell collapse:** Zustand `ui.store.ts` lưu `isSidebarOpen`. Desktop: 220px ↔ 52px. Mobile: overlay drawer, đóng bằng backdrop click hoặc NavLink onClick.

**WorkspaceSwitcher:** Auto-select workspace đầu tiên khi load. Persist activeWorkspaceId trong localStorage qua Zustand `persist`.

**Notification Bell:** Mock data, polling interval chưa implement (backend chưa có). Khi Sprint 05 backend sẵn sàng: thêm `useQuery` với `refetchInterval` hoặc Socket.IO listener.

**AI Planner:** State machine với 6 states (`empty → generating → preview → confirming → success/error`). `setTimeout` 2.5s simulate AI generation. Confirm: `setTimeout` 1s simulate API call.

**Task Detail Tabs:** shadcn `Tabs` component với 3 panels. Collaboration tab có mock data, sẽ swap real API khi Sprint 05 backend ready.

---

## 5. Kết quả kiểm chứng

| Check | Command | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors, 2 warnings (shadcn Fast Refresh, expected) | PASSED |
| Tests | `npm test` → 69/69 passed (10 test files) | PASSED |
| Build | `npm run build` → built in 3.08s | PASSED |

---

## 6. Acceptance Criteria

| AC | Criterion | Status |
|---|---|---|
| AC-01 | AppShell nhất quán trên mọi màn hình protected | PASSED |
| AC-02 | Dashboard hiển thị stats và My Tasks | PASSED (mock stats, real My Tasks) |
| AC-03 | Notification Bell với unread count; Inbox đầy đủ | PASSED (mock data) |
| AC-04 | Comment section trong Task Detail | PASSED (mock data, Tab) |
| AC-05 | AI Planner full flow brief→loading→preview→confirm | PASSED (mock AI) |
| AC-06 | Profile page hiển thị user info | PASSED |
| AC-07 | Responsive 360px–1440px | PASSED (Tailwind responsive classes) |
| AC-08 | Keyboard focus visible + accessible labels | PASSED (aria-label, focus-visible) |
| AC-09 | typecheck+lint+test+build pass | PASSED |
| AC-10 | Mock data tách biệt khỏi production | PASSED (mocks/fixtures/) |

---

## 7. Vấn đề còn lại

- **Bundle size ~635KB** — cần code splitting. Vite dynamic imports cho Dashboard, AI Planner sẽ giảm xuống khi Sprint 06.
- **NotificationBell dùng mock data** — khi backend Sprint 05 sẵn sàng, replace bằng `useQuery` + polling / Socket.IO.
- **DashboardPage stats** — mock. Cần backend `/dashboard` endpoint (Sprint 05).
- **AttachmentUploader simulate upload** — mock. Cần S3 upload endpoint (Sprint 05).
- **Comment post** — mock (optimistic local state). Cần `/tasks/:id/comments` POST (Sprint 05).
- **AI Planner confirm** — mock. Cần `/ai/plan/:id/confirm` POST (Sprint 06).
- **Browser smoke** — cần kiểm chứng với backend thật.

---

## 8. Ghi chú cho developer

Chạy frontend:
```bash
npm --prefix frontend run dev
```

Mở browser: http://localhost:5173/login → login → redirect /dashboard.

Luồng demo:
1. Login → Dashboard (stats cards, My Tasks, Activity)
2. Sidebar → My Tasks, Projects, AI Planner, Notifications
3. Task Detail → 3 tabs (Details/Comments/Attachments)
4. AI Planner → điền brief → Generate (2.5s) → preview → Confirm
5. Notifications → Bell dropdown → mark read

---

## 9. Task tiếp theo

Sprint 05 backend: `US-COL-01`, `US-NOTI-01`, `US-DASH-01` — triển khai Comment, Attachment, Notification và Dashboard APIs để thay thế mock data trong Sprint 04.
