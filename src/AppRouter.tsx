import { Routes, Route } from 'react-router-dom';
import App from './App';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminConfig from './pages/AdminConfig';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminConfig />} />
    </Routes>
  );
}

