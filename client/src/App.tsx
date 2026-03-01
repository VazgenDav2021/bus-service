import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverScanPage } from './pages/driver/DriverScanPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BusOwnerDashboard } from './pages/busOwner/BusOwnerDashboard';
import type { Role } from './types/domain';
import { APP_ROUTES } from './constants/routes';

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: Role[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Բեռնվում է...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path={APP_ROUTES.login} element={<LoginPage />} />
      <Route
        path={APP_ROUTES.driver}
        element={
          <ProtectedRoute roles={['DRIVER']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.driverScan}
        element={
          <ProtectedRoute roles={['DRIVER']}>
            <DriverScanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${APP_ROUTES.admin}/*`}
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${APP_ROUTES.busOwner}/*`}
        element={
          <ProtectedRoute roles={['BUS_OWNER']}>
            <BusOwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path={APP_ROUTES.home} element={<Navigate to={APP_ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.login} replace />} />
    </Routes>
  );
}
