import { Routes, Route } from 'react-router-dom';
import App from './App';
// TEMP: Point to Maintenance page while backend deployment is in progress.
// To revert, uncomment these imports and restore their elements in the routes below:
// import StudentLogin from './pages/StudentLogin';
// import StudentDashboard from './pages/StudentDashboard';
import StudentMaintenance from './pages/StudentMaintenance';
import AdminConfig from './pages/AdminConfig';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      {/* Student Portal under maintenance routes */}
      <Route path="/student/login" element={<StudentMaintenance />} />
      <Route path="/student/dashboard" element={<StudentMaintenance />} />
      <Route path="/admin" element={<AdminConfig />} />
    </Routes>
  );
}

