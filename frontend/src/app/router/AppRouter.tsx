import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { InitStatusPage } from '@/pages/InitStatusPage';
import { WorkspaceSettingsPage } from '@/pages/workspace/WorkspaceSettingsPage';
import { AcceptInvitePage } from '@/pages/workspace/AcceptInvitePage';

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
        {/* Sprint 2: workspace, project, board routes will nest here */}
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
