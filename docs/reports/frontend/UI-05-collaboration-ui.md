# UI-05 — Collaboration UI

## 1. Thông tin Task

- Task ID — UI-05
- Tên Task — Collaboration UI
- Sprint — 4, Frontend Foundation & MVP Interactive Prototype
- Ngày triển khai — 2026-11-27
- Trạng thái — COMPLETED
- Yêu cầu liên quan — FR-COL-01, UC-COL-01

## 2. Tóm tắt triển khai

Triển khai `CommentSection` (comment thread + compose với Ctrl+Enter submit) và `AttachmentUploader` (drag-and-drop zone, file validation, mock progress bar). Tích hợp cả hai vào `TaskDetailDrawer` qua Tabs (Details / Comments / Attachments). Tất cả dùng mock data.

## 3. File thay đổi

| File | Action | Mô tả |
|---|---|---|
| `frontend/src/features/collaboration/components/CommentSection.tsx` | Cập nhật | Thread + compose — thay thế TODO stub |
| `frontend/src/features/collaboration/components/AttachmentUploader.tsx` | Cập nhật | Drop zone + validation + mock upload |
| `frontend/src/mocks/fixtures/collaboration.fixtures.ts` | Tạo | Mock comments và attachments |
| `frontend/src/features/task/components/TaskDetailDrawer.tsx` | Cập nhật | Thêm Tabs + import CommentSection + AttachmentUploader |
| `frontend/src/components/ui/tabs.tsx` | Tạo (UI-02) | shadcn Tabs primitive |

## 4. Quyết định kỹ thuật

- **Tabs trong TaskDetail:** `defaultValue="details"` — Details tab active mặc định.
- **CommentSection:** `useState` local cho comment list. Post mới append optimistic (không cần API round-trip trong mock).
- **Keyboard shortcut:** `Ctrl+Enter` / `Cmd+Enter` submit comment.
- **AttachmentUploader validation:**
  - MIME types: `application/pdf`, `image/png`, `image/jpeg` (theo FR-COL-01)
  - Max size: 10MB (theo FR-COL-01)
  - Fake progress: `setInterval` 300ms × 5 = 1.5s
- **Drop zone:** `role="button"` + `tabIndex={0}` cho keyboard accessibility.

## 5. Kết quả kiểm chứng

| Check | Command hoặc Evidence | Status |
|---|---|---|
| TypeScript | `npm run typecheck` → exit 0 | PASSED |
| Lint | `npm run lint` → 0 errors | PASSED |
| Build | `npm run build` → exit 0 | PASSED |

## 6. Acceptance Criteria

| Criterion | Status |
|---|---|
| TaskDetail có 3 tabs | PASSED |
| Comment thread render với timestamps | PASSED |
| Post comment append thread | PASSED |
| File > 10MB bị reject với error | PASSED |
| File type không hợp lệ bị reject | PASSED |
| Mock upload progress bar | PASSED |

## 7. Vấn đề và blocker

- Backend `/tasks/:id/comments` và `/tasks/:id/attachments` chưa có (Sprint 05).
- Mention `@` dropdown chưa implement — cần project member list từ API.
- S3 upload thực chưa có — mock progress only.

## 9. Task tiếp theo

UI-06 — AI Planner UI.
