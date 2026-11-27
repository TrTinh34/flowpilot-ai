# UI-05 — Collaboration UI

## Thông tin Task

- Task ID — UI-05
- Sprint — [Sprint 04](../README.md)
- Priority — P1
- Trạng thái — PENDING
- Effort — M (1–2 ngày)
- Dependencies — UI-02, TASK-03 (TaskDetailDrawer)
- Related Requirements — FR-COL-01, UC-COL-01

## Objective

Triển khai `CommentSection` (thread + mention) và `AttachmentUploader` tích hợp vào `TaskDetailDrawer`. Dùng mock data khi backend Comment/Attachment API chưa có.

## Context

- `CommentSection.tsx` — TODO stub
- `AttachmentUploader.tsx` — TODO stub
- Backend: Comment/Attachment API chưa tồn tại (Sprint 05)
- `TaskDetailDrawer.tsx` đã hoàn chỉnh cho task editing — cần thêm tabs

## Scope

### TaskDetailDrawer — thêm Tabs

Bọc nội dung detail trong `Tabs` component:
- Tab "Details" — form hiện có
- Tab "Comments" — `CommentSection`
- Tab "Attachments" — `AttachmentUploader`

### CommentSection

```
┌────────────────────────────────────────┐
│ [Avatar] Comment text, 2h ago          │
│ [Avatar] Reply text, 1h ago            │
├────────────────────────────────────────┤
│ [Avatar] [Input: Add a comment...  ]   │
│          [@Mention support]             │
│          [Post Comment]                 │
└────────────────────────────────────────┘
```

- Mention trigger: `@` → dropdown với project members
- Textarea tự mở rộng
- Timestamp relative (e.g. "2 hours ago")
- Loading skeleton khi đang fetch
- Empty state: "No comments yet"

### AttachmentUploader

- Drag-and-drop zone hoặc click-to-browse
- Preview file name + size
- File type constraint: PDF, PNG, JPEG (theo FR-COL-01)
- Max size: 10MB (client-side validation)
- Mock upload: simulate progress bar 0→100% sau 1.5s
- List existing attachments với download link (mock)

### Mock strategy

```typescript
// src/mocks/fixtures/collaboration.fixtures.ts
export const mockComments: Comment[] = [ ... ];
export const mockAttachments: Attachment[] = [ ... ];
```

## Acceptance Criteria

- AC-05-01: TaskDetail có 3 tabs: Details, Comments, Attachments
- AC-05-02: Comment thread hiển thị với timestamps
- AC-05-03: Post comment thêm vào thread (optimistic update mock)
- AC-05-04: Mention dropdown hiển thị khi nhập `@`
- AC-05-05: AttachmentUploader reject file > 10MB với error message
- AC-05-06: AttachmentUploader reject file type không hợp lệ
- AC-05-07: Mock upload hiển thị progress bar

## Development Report Reference

`docs/reports/frontend/UI-05-collaboration-ui.md`

## Next Task

UI-06 — AI Planner UI.
