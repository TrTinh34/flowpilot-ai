# Navigation Map — FlowPilot AI MVP

## Route Map

```
/ ──────────────────────── Redirect → /dashboard (authenticated)
                           Redirect → /login (unauthenticated)

/login ─────────────────── LoginPage [PUBLIC ONLY]
/register ──────────────── RegisterPage [PUBLIC ONLY]
/invitations/accept ────── AcceptInvitePage [PROTECTED]

/dashboard ─────────────── DashboardPage [PROTECTED, AppShell]
/my-tasks ──────────────── MyTasksPage [PROTECTED, AppShell]
/notifications ─────────── NotificationsPage [PROTECTED, AppShell]
/ai/planner ────────────── AiPlannerPage [PROTECTED, AppShell]
/settings/profile ──────── ProfilePage [PROTECTED, AppShell]

/workspaces ────────────── WorkspaceSettingsPage [PROTECTED, AppShell]
/workspaces/:id/projects ── ProjectsPage [PROTECTED, AppShell]

/projects/:id ──────────── ProjectSettingsPage [PROTECTED, AppShell]
/projects/:id/tasks ────── ProjectTasksPage [PROTECTED, AppShell]
/projects/:id/board ────── ProjectBoardPage [PROTECTED, AppShell]

/tasks/:id ─────────────── TaskDetailPage [PROTECTED, AppShell]

/403 ───────────────────── ForbiddenPage [PUBLIC]
* ──────────────────────── Redirect → /dashboard
```

## Sidebar Navigation Structure

```
FlowPilot AI [Logo]
─────────────────────
▼ [Workspace Switcher]      ← dropdown, all user workspaces
─────────────────────
📊  Dashboard               /dashboard
✓   My Tasks                /my-tasks
🔔  Notifications           /notifications
─────────────────────
📁  Projects                /workspaces/:id/projects
    └─ [Project Name]       /projects/:id/tasks
       └─ Board             /projects/:id/board
─────────────────────
✨  AI Planner              /ai/planner
─────────────────────
⚙   Settings               /settings/profile
─────────────────────
[Avatar] [Name]
         [Logout]
[◀ Collapse]
```

## Breadcrumb Examples

| Route | Breadcrumb |
|---|---|
| `/dashboard` | Dashboard |
| `/workspaces/:id/projects` | {Workspace Name} / Projects |
| `/projects/:id/tasks` | {Workspace} / {Project Name} / Tasks |
| `/projects/:id/board` | {Workspace} / {Project Name} / Board |
| `/tasks/:id` | {Project Name} / Tasks / {Task Title} |
| `/my-tasks` | My Tasks |
| `/ai/planner` | AI Planner |
| `/settings/profile` | Settings / Profile |

## Default Redirect Logic

```
App loads → SessionProvider attempts /auth/refresh
  ├── Success → status: 'authenticated'
  │   ├── On /login or /register → redirect /dashboard
  │   └── On protected route → render page
  └── Failure → status: 'unauthenticated'
      ├── On /login or /register → render page
      └── On protected route → redirect /login?from=<original_path>
          └── After login → redirect back to <original_path>
```
