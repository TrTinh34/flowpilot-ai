# 03 — Sitemap & Navigation Architecture

## Application Routes

### Sprint 1 — Authentication (hiện tại)

```
/ ──────────────────── InitStatusPage (dev health check, temporary)
/login ─────────────── LoginPage (public)
/register ──────────── RegisterPage (public)
* ──────────────────── NotFoundPage
```

### Sprint 2 — Workspace & Project (planned)

```
/ ──────────────────── WorkspaceDashboard hoặc redirect theo workspace
/workspace/:id ─────── WorkspaceDashboard
/workspace/:id/settings WorkspaceSettings
/workspace/:id/members WorkspaceMembers
/workspace/:id/projects ProjectList
/project/:id ───────── ProjectOverview
/project/:id/board ──── KanbanBoard
/project/:id/list ───── TaskList
/project/:id/settings── ProjectSettings
/project/:id/members ── ProjectMembers
```

### Sprint 3–5 (planned)

```
/my-tasks ──────────── MyTasksPage
/inbox ─────────────── NotificationInbox
/ai/planner ────────── AiPlannerPage
```

---

## Navigation Architecture

### Sidebar (authenticated, Sprint 2+)

```
FlowPilot AI Logo
─────────────────
▼ [Workspace Switcher]        ← dropdown, danh sách workspace của user
─────────────────
📊 Overview
✓  My Tasks
🔔 Inbox
─────────────────
📁 Projects                   ← expandable, list dự án hiện tại
─────────────────
👥 Members
✨ AI Planner
─────────────────
⚙  Workspace Settings
─────────────────
[User Avatar + Name]          ← dropdown: Profile, Logout
[Collapse Sidebar]            ← bottom
```

**Rules:**
- Navigation items chỉ hiện khi feature đã implement
- Active item highlight với `bg-surface-secondary` và `text-primary`
- Expandable project list với indent, task count badge
- Keyboard navigable (Arrow keys, Enter, Escape)

### Topbar (authenticated, Sprint 2+)

```
[Breadcrumb: Workspace / Project / Page]  [Search]  [🔔 Notifs]  [🌙 Theme]  [Avatar]
```

Height: 56px. Border-bottom: 1px `--border`.

---

## Screen Inventory

| Screen ID | Route | Sprint | Status | Notes |
|---|---|---|---|---|
| SCR-AUTH-01 | `/login` | 1 | Planned AUTH-09 | Split-screen, public |
| SCR-AUTH-02 | `/register` | 1 | Planned AUTH-09 | Split-screen, public |
| SCR-APP-01 | `*` dev | 1 | EXISTS | InitStatusPage, temporary |
| SCR-ERR-01 | `*` | 1 | EXISTS stub | NotFoundPage |
| SCR-ERR-02 | — | 1 | EXISTS stub | ForbiddenPage |
| SCR-WS-01 | `/` | 2 | Future | Workspace Dashboard |
| SCR-WS-02 | `/workspace/:id/settings` | 2 | Future | Workspace Settings |
| SCR-WS-03 | `/workspace/:id/members` | 2 | Future | Members Management |
| SCR-PROJ-01 | `/workspace/:id/projects` | 2 | Future | Project List |
| SCR-PROJ-02 | `/project/:id` | 2 | Future | Project Overview |
| SCR-BOARD-01 | `/project/:id/board` | 3 | Future | Kanban Board |
| SCR-TASK-01 | `/project/:id/list` | 3 | Future | Task List |
| SCR-TASK-02 | — (drawer) | 3 | Future | Task Detail |
| SCR-DASH-01 | `/` | 4 | Future | Workspace Dashboard |
| SCR-MYTASK-01 | `/my-tasks` | 4 | Future | My Tasks |
| SCR-INBOX-01 | `/inbox` | 4 | Future | Notification Inbox |
| SCR-AI-01 | `/ai/planner` | 5 | Future | AI Project Planner |
