import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { InitStatusPage } from '@/pages/InitStatusPage';

/**
 * Application router.
 *
 * Sprint 1 routes:
 *   /           → InitStatusPage (temporary dev health check)
 *   /login      → LoginPage (public)
 *   /register   → RegisterPage (public)
 *   *           → 404 fallback (InitStatusPage until NotFoundPage is styled)
 *
 * AUTH-10 will add ProtectedRoute wrapping around authenticated routes
 * and replace the / fallback with a proper app shell.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<InitStatusPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<InitStatusPage />} />
    </Routes>
  );
}
