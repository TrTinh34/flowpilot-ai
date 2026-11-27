import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/router/ProtectedRoute';
import { AppShellRoute } from '@/app/router/AppShellRoute';

// ── Auth pages ────────────────────────────────────────────────────────────────
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// ── Protected pages ───────────────────────────────────────────────────────────
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { WorkspaceSettingsPage } from '@/pages/workspace/WorkspaceSettingsPage';
import { AcceptInvitePage } from '@/pages/workspace/AcceptInvitePage';
import { ProjectsPage } from '@/pages/project/ProjectsPage';
import { ProjectSettingsPage } from '@/pages/project/ProjectSettingsPage';
import { ProjectTasksPage } from '@/pages/task/ProjectTasksPage';
import { ProjectBoardPage } from '@/pages/task/ProjectBoardPage';
import { MyTasksPage } from '@/pages/task/MyTasksPage';
import { TaskDetailPage } from '@/features/task/components/TaskDetailDrawer';
import { NotificationsPage } from '@/pages/notification/NotificationsPage';
import { AiPlannerPage } from '@/pages/ai/AiPlannerPage';
import { ProfilePage } from '@/pages/settings/ProfilePage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';

/**
 * Application router — Sprint 04 (UI-01).
 *
 * Structure:
 *   Public-only  → /login, /register
 *   Protected    → ProtectedRoute > AppShellRoute > page components
 *   Default      → / → /dashboard
 *   Fallback     → * → 404
 */
export function AppRouter() {
  return (
    <Routes>
      {/* ── Public-only ───────────────────────────────────────────────── */}
      <Route element={<PublicOnlyRoute redirectTo="/dashboard" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Protected + App Shell ─────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShellRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/workspaces" element={<WorkspaceSettingsPage />} />
          <Route path="/workspaces/:workspaceId/projects" element={<ProjectsPage />} />
          <Route path="/invitations/accept" element={<AcceptInvitePage />} />
          <Route path="/projects/:projectId" element={<ProjectSettingsPage />} />
          <Route path="/projects/:projectId/tasks" element={<ProjectTasksPage />} />
          <Route path="/projects/:projectId/board" element={<ProjectBoardPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/ai/planner" element={<AiPlannerPage />} />
          <Route path="/settings/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Default redirect ──────────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── 404 ──────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
