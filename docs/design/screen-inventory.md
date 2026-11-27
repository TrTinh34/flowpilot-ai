# Screen Inventory — FlowPilot AI MVP

Nguồn: PRD, SRS, Use Cases, OpenAPI Specification.  
Trạng thái: Thực tế từ repo tính đến 2026-11-27.

## Trạng thái legend

| Ký hiệu | Nghĩa |
|---|---|
| ✅ REAL | Real API, production-ready |
| 🟡 MOCK | Mock data, prototype only |
| 🔴 STUB | Chỉ có placeholder (TODO) |
| ⬜ MISSING | Chưa có file |

---

## Authentication

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-AUTH-01 | Login | `/login` | ✅ REAL | Sprint 01 | Real API, session restore |
| SCR-AUTH-02 | Register | `/register` | ✅ REAL | Sprint 01 | Real API |
| SCR-AUTH-03 | Session Restore Loading | — | ✅ REAL | Sprint 01 | Spinner trong ProtectedRoute |
| SCR-AUTH-04 | Session Expired | — | ✅ REAL | Sprint 01 | Redirect /login |
| SCR-AUTH-05 | Unauthorized (403) | — | ✅ REAL | Sprint 02 | ForbiddenPage |

## Workspace

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-WS-01 | Workspace Switcher | Sidebar dropdown | ✅ REAL | Sprint 02 | WorkspaceSwitcher component |
| SCR-WS-02 | Workspace Settings | `/workspaces` | ✅ REAL | Sprint 02 | WorkspaceSettingsPage |
| SCR-WS-03 | Accept Invitation | `/invitations/accept` | ✅ REAL | Sprint 02 | AcceptInvitePage |
| SCR-WS-04 | Workspace Overview/Dashboard | `/` → `/dashboard` | 🔴 STUB | Sprint 04 | DashboardPage TODO |

## Project

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-PROJ-01 | Project List | `/workspaces/:id/projects` | ✅ REAL | Sprint 02 | ProjectsPage |
| SCR-PROJ-02 | Project Settings | `/projects/:id` | ✅ REAL | Sprint 02 | ProjectSettingsPage |
| SCR-PROJ-03 | Project Members | trong ProjectSettings | ✅ REAL | Sprint 02 | Tab trong settings |

## Task Management

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-TASK-01 | Project Task List | `/projects/:id/tasks` | ✅ REAL | Sprint 03 | ProjectTasksPage |
| SCR-TASK-02 | Task Detail | `/tasks/:id` | ✅ REAL | Sprint 03 | TaskDetailPage |
| SCR-TASK-03 | Subtask in Task Detail | — | ✅ REAL | Sprint 03 | SubtaskList |
| SCR-TASK-04 | My Tasks | `/my-tasks` | ✅ REAL | Sprint 03 | MyTasksPage |

## Kanban Board

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-BOARD-01 | Kanban Board | `/projects/:id/board` | ✅ REAL | Sprint 03 | ProjectBoardPage, dnd |
| SCR-BOARD-02 | Task Card | — (in board) | ✅ REAL | Sprint 03 | KanbanCard |
| SCR-BOARD-03 | Task Status Column | — (in board) | ✅ REAL | Sprint 03 | KanbanColumn |

## Dashboard

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-DASH-01 | Dashboard | `/dashboard` | 🔴 STUB | Sprint 04 | DashboardPage TODO |
| SCR-DASH-02 | My Tasks Summary | — (in Dashboard) | 🟡 MOCK | Sprint 04 | Reuse /my-tasks data |
| SCR-DASH-03 | Project Progress Chart | — (in Dashboard) | 🟡 MOCK | Sprint 04 | Recharts, mock stats |
| SCR-DASH-04 | Recent Activity | — (in Dashboard) | 🟡 MOCK | Sprint 04 | Mock audit data |

## Collaboration

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-COL-01 | Comment Section | — (in Task Detail tab) | 🔴 STUB | Sprint 04 | CommentSection TODO |
| SCR-COL-02 | Attachment Uploader | — (in Task Detail tab) | 🔴 STUB | Sprint 04 | AttachmentUploader TODO |
| SCR-COL-03 | Activity Timeline | — (in Task Detail) | ⬜ MISSING | Sprint 04 | To be built in UI-05 |

## Notification

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-NOTI-01 | Notification Bell + Dropdown | Header | 🔴 STUB | Sprint 04 | NotificationBell TODO |
| SCR-NOTI-02 | Notifications Page | `/notifications` | 🔴 STUB | Sprint 04 | NotificationsPage TODO |

## AI Planner

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-AI-01 | AI Planner | `/ai/planner` | 🔴 STUB | Sprint 04 | AiPlannerPage TODO |
| SCR-AI-02 | Brief Form | — (in AI Planner) | 🔴 STUB | Sprint 04 | AiBriefForm TODO |
| SCR-AI-03 | Plan Draft Editor | — (in AI Planner) | 🔴 STUB | Sprint 04 | AiPlanDraftEditor TODO |

## Settings & Profile

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-SETTINGS-01 | User Profile | `/settings/profile` | ⬜ MISSING | Sprint 04 | To be built in UI-07 |

## Application Shell

| SCR ID | Screen | Route | Status | Sprint | Notes |
|---|---|---|---|---|---|
| SCR-SHELL-01 | Application Shell | Authenticated wrapper | 🔴 STUB | Sprint 04 | AppShellLayout TODO |
| SCR-SHELL-02 | Sidebar | — (in Shell) | 🔴 STUB | Sprint 04 | To be built in UI-01 |
| SCR-SHELL-03 | Header/Topbar | — (in Shell) | 🔴 STUB | Sprint 04 | To be built in UI-01 |

## System States

| SCR ID | Screen | Status | Sprint |
|---|---|---|---|
| SCR-SYS-01 | 404 Not Found | ✅ REAL | Sprint 02 |
| SCR-SYS-02 | 403 Forbidden | ✅ REAL | Sprint 02 |
| SCR-SYS-03 | Loading State | ✅ REAL | Sprint 01 |
| SCR-SYS-04 | Empty State | ✅ REAL | Existing component |
| SCR-SYS-05 | Error State | ✅ REAL | Existing component |

---

## Summary

| Status | Count |
|---|---|
| ✅ REAL (production-ready) | 18 |
| 🟡 MOCK (prototype) | 3 |
| 🔴 STUB (TODO placeholder) | 9 |
| ⬜ MISSING | 2 |
| **Total** | **32** |

Sprint 04 target: convert 11 STUB/MISSING → real hoặc mock prototype.
