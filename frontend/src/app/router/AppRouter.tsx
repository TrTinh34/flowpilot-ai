import { Route, Routes } from 'react-router-dom';
import { InitStatusPage } from '@/pages/InitStatusPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<InitStatusPage />} />
      <Route path="*" element={<InitStatusPage />} />
    </Routes>
  );
}
