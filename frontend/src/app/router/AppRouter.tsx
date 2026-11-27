import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { InitStatusPage } from '@/pages/InitStatusPage';
import { WorkspaceSettingsPage } from '@/pages/workspace/WorkspaceSettingsPage';
import { AcceptInvitePage } from '@/pages/workspace/AcceptInvitePage';
import { ProjectsPage } from '@/pages/project/ProjectsPage';
import { ProjectSettingsPage } from '@/pages/project/ProjectSettingsPage';
import { ProjectTasksPage } from '@/pages/task/ProjectTasksPage';
import { MyTasksPage } from '@/pages/task/MyTasksPage';
import { TaskDetailPage } from '@/features/task/components/TaskDetailDrawer';

/**
 * Application router — AUTH-10.
 *
 * Public-only routes (redirect authenticated users away):
 *   /login      → LoginPage
 *   /register   → RegisterPage
 *
 * Protected routes (redirect unauthenticated users to /login):
 *   /           → InitStatusPage (temporary; Sprint 2 will replace with AppShell)
 *
 * Fallback:
 *   *           → Redirect to / for now (NotFoundPage arrives in Sprint 2)
 */
export function AppRouter() {
  return (
    <Routes>
      {/* ── Public-only: redirect if already authenticated ─────────────── */}
      <Route element={<PublicOnlyRoute redirectTo="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Protected: require authentication ──────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<InitStatusPage />} />
        <Route path="/workspaces" element={<WorkspaceSettingsPage />} />
        <Route path="/invitations/accept" element={<AcceptInvitePage />} />
        <Route path="/workspaces/:workspaceId/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectSettingsPage />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectTasksPage />} />
        <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/my-tasks" element={<MyTasksPage />} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
