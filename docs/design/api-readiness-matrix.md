# API Readiness Matrix — FlowPilot AI Frontend

Trạng thái của các API endpoint theo góc nhìn frontend. Cập nhật: 2026-11-27.

## Status Legend

| Status | Nghĩa |
|---|---|
| ✅ REAL API AVAILABLE | Backend đã implement, frontend dùng real API |
| 🟡 MOCK API REQUIRED | Frontend cần mock, backend chưa có |
| ❓ CONTRACT NOT DEFINED | Chưa có OpenAPI contract |
| 🔴 BLOCKED | Có dependency chưa giải quyết |

---

## Authentication

| Endpoint | Method | Frontend Use | Status |
|---|---|---|---|
| `/auth/register` | POST | Register form | ✅ REAL API AVAILABLE |
| `/auth/login` | POST | Login form | ✅ REAL API AVAILABLE |
| `/auth/refresh` | POST | Session restore, token refresh | ✅ REAL API AVAILABLE |
| `/auth/logout` | POST | Logout button | ✅ REAL API AVAILABLE |
| `/me` | GET | User profile, auth store | ✅ REAL API AVAILABLE (AUTH-07 completed) |

## Workspace

| Endpoint | Method | Frontend Use | Status |
|---|---|---|---|
| `/workspaces` | GET | Workspace switcher | ✅ REAL API AVAILABLE |
| `/workspaces` | POST | Create workspace | ✅ REAL API AVAILABLE |
| `/workspaces/:id/members` | GET | Members table | ✅ REAL API AVAILABLE |
| `/workspaces/:id/members/:userId` | PATCH | Change role | ✅ REAL API AVAILABLE |
| `/workspaces/:id/members/:userId` | DELETE | Remove member | ✅ REAL API AVAILABLE |
| `/workspaces/:id/invitations` | POST | Invite member | ✅ REAL API AVAILABLE |
| `/invitations/accept` | POST | Accept invite | ✅ REAL API AVAILABLE |
| `/workspaces/:id/transfer` | POST | Transfer ownership | ✅ REAL API AVAILABLE |

## Project

| Endpoint | Method | Frontend Use | Status |
|---|---|---|---|
| `/workspaces/:id/projects` | GET | Project list | ✅ REAL API AVAILABLE |
| `/workspaces/:id/projects` | POST | Create project | ✅ REAL API AVAILABLE |
| `/projects/:id` | PATCH | Update/archive project | ✅ REAL API AVAILABLE |
| `/projects/:id/members` | POST | Add project member | ✅ REAL API AVAILABLE |
| `/projects/:id/members` | GET | Project members (via workspace) | ✅ REAL API AVAILABLE |

## Task

| Endpoint | Method | Frontend Use | Status |
|---|---|---|---|
| `/projects/:id/tasks` | GET | Task list, kanban | ✅ REAL API AVAILABLE |
| `/projects/:id/tasks` | POST | Create task | ✅ REAL API AVAILABLE |
| `/tasks/:id` | GET | Task detail | ✅ REAL API AVAILABLE |
| `/tasks/:id` | PATCH | Update task | ✅ REAL API AVAILABLE |
| `/tasks/:id/move` | POST | Kanban board move | ✅ REAL API AVAILABLE |
| `/me/tasks` | GET | My Tasks page | ✅ REAL API AVAILABLE |

## Dashboard

| Endpoint | Method | Frontend Use | Status | Sprint |
|---|---|---|---|---|
| `/dashboard` | GET | Dashboard stats | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/audit` | GET | Audit log | 🟡 MOCK API REQUIRED | Backend Sprint 05 |

## Collaboration

| Endpoint | Method | Frontend Use | Status | Sprint |
|---|---|---|---|---|
| `/tasks/:id/comments` | GET | Comment thread | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/tasks/:id/comments` | POST | Post comment | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/tasks/:id/attachments` | GET | Attachment list | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/tasks/:id/attachments` | POST | Upload attachment | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/attachments/:id` | GET | Download link | 🟡 MOCK API REQUIRED | Backend Sprint 05 |

## Notification

| Endpoint | Method | Frontend Use | Status | Sprint |
|---|---|---|---|---|
| `/notifications` | GET | Notification inbox | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/notifications/:id/read` | PATCH | Mark read | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/notifications/read-all` | POST | Mark all read | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `socket.io` event: `notification` | WS | Real-time bell update | 🟡 MOCK API REQUIRED | Backend Sprint 05 |

## AI Planner

| Endpoint | Method | Frontend Use | Status | Sprint |
|---|---|---|---|---|
| `/ai/plan` | POST | Generate plan | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/ai/plan/:id` | GET | Poll plan status | 🟡 MOCK API REQUIRED | Backend Sprint 05 |
| `/ai/plan/:id/confirm` | POST | Confirm plan | 🟡 MOCK API REQUIRED | Backend Sprint 05 |

---

## Summary

| Status | Count |
|---|---|
| ✅ REAL API AVAILABLE | 20 |
| 🟡 MOCK API REQUIRED | 12 |
| ❓ CONTRACT NOT DEFINED | 0 |
| 🔴 BLOCKED | 0 |

12 endpoints cần mock trong Sprint 04. Backend sẽ implement Sprint 05 (COL+NOTI+DASH) và Sprint 06 (AI).
Khi backend ready, chỉ cần flip `VITE_USE_MOCK_API=false` và verify integration.
