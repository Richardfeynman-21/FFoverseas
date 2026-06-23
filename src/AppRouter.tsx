import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';

// Lazy-load non-home routes — they are separate pages rarely visited together
const StudentMaintenance = lazy(() => import('./pages/StudentMaintenance'));
const AdminConfig = lazy(() => import('./pages/AdminConfig'));

export default function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Student Portal under maintenance routes */}
        <Route path="/student/login" element={<StudentMaintenance />} />
        <Route path="/student/dashboard" element={<StudentMaintenance />} />
        <Route path="/admin" element={<AdminConfig />} />
      </Routes>
    </Suspense>
  );
}
