// ─── Central Route Configuration ────────────────────────────────────────────
// All frontend route paths are defined here as a single source of truth.
// Import ROUTES from this file instead of hardcoding path strings.

export const ROUTES = {
  HOME: '/',
  UNIVERSITIES: '/universities',
  STUDENT_LOGIN: '/student/login',
  STUDENT_DASHBOARD: '/student/dashboard',
  ADMIN: '/admin',
} as const;
