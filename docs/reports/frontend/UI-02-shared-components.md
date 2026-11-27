# UI-02 — Shared UI Component Library

## 1. Thông tin Task

- Task ID — UI-02
- Tên Task — Shared UI Component Library
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — NFR-05, NFR-02

## 2. Tóm tắt triển khai

Thêm `Tabs` component từ shadcn/ui. Tạo mock fixtures directory với 4 fixture files (dashboard, ai, notification, collaboration) phục vụ Dashboard, AI Planner, Notifications và Collaboration UI. Tạo `ProfilePage` và `NotFoundPage` hoàn chỉnh. Fix `cn` import path cho `tabs.tsx`.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/components/ui/tabs.tsx` | Tạo (shadcn) | Tabs, TabsList, TabsTrigger, TabsContent — cn import fixed |
| `frontend/src/mocks/fixtures/dashboard.fixtures.ts` | Tạo | Mock stats và activity entries |
| `frontend/src/mocks/fixtures/ai.fixtures.ts` | Tạo | Mock AI plan với 4 phases, 12 tasks |
| `frontend/src/mocks/fixtures/notification.fixtures.ts` | Tạo | Mock notifications list |
| `frontend/src/mocks/fixtures/collaboration.fixtures.ts` | Tạo | Mock comments và attachments |
| `frontend/src/pages/settings/ProfilePage.tsx` | Tạo | User profile page mới |
| `frontend/src/pages/errors/NotFoundPage.tsx` | Cập nhật | 404 page hoàn chỉnh |

## 4. Quyết định kỹ thuật

- **Mock fixtures tách biệt:** Tất cả mock data trong `src/mocks/fixtures/` — không nhúng dataset vào component.
- **shadcn Tabs:** Dùng `radix-ui` Tabs primitive. Tabs đã có trong `radix-ui` package hiện tại, không cần install thêm.
- **ProfilePage data source:** Đọc từ `useAuthStore().user` — không gọi API (GET /me chưa mount route HTTP trong Sprint 04).

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Import test | `import { Tabs } from '@/components/ui/tabs'` trong TaskDetailDrawer | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| Tabs component import được | PASSED |
| Mock fixtures không có hardcoded data trong page components | PASSED |
| ProfilePage accessible tại `/settings/profile` | PASSED |

## 7. Vấn đề và blocker

- `tabsListVariants` export gây warning `react-refresh/only-export-components` — expected behavior của shadcn, không ảnh hưởng production.
- Các shadcn components nâng cao (Dialog, Drawer, Badge, Avatar, Skeleton) chưa install — sẽ thêm khi feature cụ thể cần.

## 8. Ghi chú cho developer

Mock fixtures dùng trực tiếp — khi backend sẵn sàng, thay bằng API call trong feature API file. Pattern:
```typescript
// Hiện tại (mock):
import { mockDashboardStats } from '@/mocks/fixtures/dashboard.fixtures';

// Sau khi backend ready:
const stats = await apiClient.get('/dashboard');
```

## 9. Task tiếp theo

UI-03 — Dashboard UI.
