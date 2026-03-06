import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bus, QrCode } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { api } from '../../lib/api';
import type { DriverProfile } from '../../types/domain';
import { APP_ROUTES } from '../../constants/routes';

export function DriverDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState<DriverProfile | null>(null);

  const loadDriverInfo = useCallback(async () => {
    try {
      const data = await api.driver.me();
      setDriverInfo(data);
    } catch {
      logout();
      navigate(APP_ROUTES.login);
    }
  }, [logout, navigate]);

  useEffect(() => {
    loadDriverInfo();
  }, [loadDriverInfo]);

  function handleLogout() {
    logout();
    navigate(APP_ROUTES.login);
  }

  if (!driverInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Բեռնվում է...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-6 h-6 text-primary-600" />
            <span className="font-semibold text-slate-800">Վարորդ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{driverInfo.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Վարորդի պրոֆիլ</h2>
          <p className="text-slate-600">Անուն՝ <strong>{driverInfo.name}</strong></p>
          <p className="text-slate-600">Էլ. փոստ՝ <strong>{driverInfo.email}</strong></p>
          <button
            onClick={() => navigate(APP_ROUTES.driverScan)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white"
          >
            <QrCode className="w-4 h-4" />
            Բացել QR սկանավորման էջը
          </button>
        </div>
      </main>
    </div>
  );
}
