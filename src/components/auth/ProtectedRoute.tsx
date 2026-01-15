import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If user is authenticated but has no projects, force them to create one first
  if (isAuthenticated) {
    try {
      const raw = localStorage.getItem('project_ids');
      const projectIds: string[] = raw ? JSON.parse(raw) : [];
      if ((!projectIds || projectIds.length === 0) && location.pathname !== '/projects/create') {
        return <Navigate to="/projects/create" replace />;
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
