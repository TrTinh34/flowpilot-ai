import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/router/ProtectedRoute';
import { AppShellRoute } from '@/app/router/AppShellRoute';
import { LoadingState } from '@/components/common/LoadingState';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';

const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const WorkspaceSettingsPage = lazy(() =>
  import('@/pages/workspace/WorkspaceSettingsPage').then((m) => ({
    default: m.WorkspaceSettingsPage,
  })),
);
const AcceptInvitePage = lazy(() =>
  import('@/pages/workspace/AcceptInvitePage').then((m) => ({ default: m.AcceptInvitePage })),
);
const ProjectsPage = lazy(() =>
  import('@/pages/project/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const ProjectSettingsPage = lazy(() =>
  import('@/pages/project/ProjectSettingsPage').then((m) => ({
    default: m.ProjectSettingsPage,
  })),
);
const ProjectTasksPage = lazy(() =>
  import('@/pages/task/ProjectTasksPage').then((m) => ({ default: m.ProjectTasksPage })),
);
const ProjectBoardPage = lazy(() =>
  import('@/pages/task/ProjectBoardPage').then((m) => ({ default: m.ProjectBoardPage })),
);
const MyTasksPage = lazy(() =>
  import('@/pages/task/MyTasksPage').then((m) => ({ default: m.MyTasksPage })),
);
const TaskDetailPage = lazy(() =>
  import('@/pages/task/TaskDetailPage').then((m) => ({ default: m.TaskDetailPage })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/notification/NotificationsPage').then((m) => ({ default: m.NotificationsPage })),
);
const AiPlannerPage = lazy(() =>
  import('@/pages/ai/AiPlannerPage').then((m) => ({ default: m.AiPlannerPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/settings/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

function RouteFallback() {
  return (
    <div className="w-full min-w-0 px-page-gutter py-8">
      <LoadingState label="Loading page" />
    </div>
  );
}

/**
 * Application router — Design System V2 route-level code splitting.
 */
export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  );
}
