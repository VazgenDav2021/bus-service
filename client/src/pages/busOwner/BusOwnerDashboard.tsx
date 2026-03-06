import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bus, Users, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import type { DriverListItem } from '../../types/domain';
import { DEFAULT_PASSWORD } from '../../constants/auth';
import { APP_ROUTES } from '../../constants/routes';
import { getErrorMessage } from '../../utils/errors';
import { PaginationControls } from '../../components/PaginationControls';

const PAGE_SIZE = 10;
type DriverScanRow = {
  id: string;
  scannedAt: string;
  student: {
    id: string;
    studentId: string;
    name: string;
    email: string | null;
  };
};
type BusOwnerSection = 'drivers' | 'driversCreate' | 'driverDetails';

const BUS_OWNER_ROUTE_PATHS = {
  drivers: APP_ROUTES.busOwnerDrivers,
  driversCreate: APP_ROUTES.busOwnerDriversCreate,
} as const;

function getBusOwnerSection(pathname: string): BusOwnerSection | null {
  if (pathname.startsWith(`${APP_ROUTES.busOwnerDrivers}/`)) return 'driverDetails';
  if (pathname === BUS_OWNER_ROUTE_PATHS.drivers) return 'drivers';
  if (pathname === BUS_OWNER_ROUTE_PATHS.driversCreate) return 'driversCreate';
  return null;
}

function getDriverIdFromPath(pathname: string): string | null {
  const prefix = `${APP_ROUTES.busOwnerDrivers}/`;
  if (!pathname.startsWith(prefix)) return null;
  const id = pathname.slice(prefix.length).split('/')[0]?.trim();
  return id ? id : null;
}

export function BusOwnerDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const section = getBusOwnerSection(location.pathname);
  const driverIdFromPath = getDriverIdFromPath(location.pathname);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [driverDetails, setDriverDetails] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null>(null);
  const [driverScans, setDriverScans] = useState<DriverScanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    password: DEFAULT_PASSWORD,
  });
  const [driversSearch, setDriversSearch] = useState('');
  const [driversPage, setDriversPage] = useState(1);
  const [driversTotalPages, setDriversTotalPages] = useState(1);
  const [driverScansSearch, setDriverScansSearch] = useState('');
  const [driverScansPage, setDriverScansPage] = useState(1);
  const [driverScansTotalPages, setDriverScansTotalPages] = useState(1);

  useEffect(() => {
    if (
      location.pathname === APP_ROUTES.busOwner ||
      location.pathname === `${APP_ROUTES.busOwner}/`
    ) {
      navigate(BUS_OWNER_ROUTE_PATHS.drivers, { replace: true });
    }
  }, [location.pathname, navigate]);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const driversData = await api.busOwner.drivers({
        page: driversPage,
        pageSize: PAGE_SIZE,
        search: driversSearch,
      });
      setDrivers(driversData.drivers);
      setDriversTotalPages(driversData.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [driversPage, driversSearch]);

  useEffect(() => {
    if (section !== 'drivers') return;
    fetchDrivers();
  }, [section, fetchDrivers]);

  useEffect(() => {
    setDriverScansPage(1);
    setDriverScansSearch('');
  }, [driverIdFromPath]);

  const fetchDriverScans = useCallback(async () => {
    if (!driverIdFromPath) return;
    setLoading(true);
    try {
      const details = await api.busOwner.driverScans(driverIdFromPath, {
        page: driverScansPage,
        pageSize: PAGE_SIZE,
        search: driverScansSearch,
      });
      setDriverDetails(details.driver);
      setDriverScans(details.scans);
      setDriverScansTotalPages(details.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  }, [driverIdFromPath, driverScansPage, driverScansSearch]);

  useEffect(() => {
    if (section !== 'driverDetails') return;
    fetchDriverScans();
  }, [section, fetchDriverScans]);

  async function handleCreateDriver(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.busOwner.createDriver(
        newDriver.name,
        newDriver.email,
        newDriver.password,
        newDriver.phone || undefined
      );
      setNewDriver({
        name: '',
        email: '',
        phone: '',
        password: DEFAULT_PASSWORD,
      });
      navigate(BUS_OWNER_ROUTE_PATHS.drivers);
      await fetchDrivers();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել վարորդ'));
    }
  }

  if (!section) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="w-6 h-6 text-primary-600" />
            <span className="font-semibold text-slate-800">Ավտոբուսի սեփականատիրոջ վահանակ</span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate(APP_ROUTES.login);
            }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.drivers)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.drivers
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Վարորդներ
          </button>
          <button
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.driversCreate)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.driversCreate
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Ստեղծել վարորդ
          </button>
        </div>

        {section === 'drivers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Վարորդներ
                </h2>
              </div>
              <div className="p-4 border-b border-slate-200">
                <input
                  value={driversSearch}
                  onChange={(e) => {
                    setDriversSearch(e.target.value);
                    setDriversPage(1);
                  }}
                  placeholder="Որոնել վարորդներ"
                  className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              {loading ? (
                <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-600">
                      <th className="px-4 py-3">Անուն</th>
                      <th className="px-4 py-3">Էլ. փոստ</th>
                      <th className="px-4 py-3">Հեռախոս</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => navigate(`${APP_ROUTES.busOwnerDrivers}/${d.id}`)}
                        className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">{d.name}</td>
                        <td className="px-4 py-3">{d.email}</td>
                        <td className="px-4 py-3">{d.phone ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <PaginationControls
                page={driversPage}
                totalPages={driversTotalPages}
                onPageChange={setDriversPage}
              />
            </div>
          </div>
        )}

        {section === 'driverDetails' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <button
                onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.drivers)}
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Վերադառնալ վարորդների ցանկ
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">
                  Սկանավորման պատմություն
                </h2>
                {driverDetails && (
                  <p className="text-sm text-slate-600 mt-1">
                    {driverDetails.name} ({driverDetails.email})
                  </p>
                )}
              </div>
              <div className="p-4 border-b border-slate-200">
                <input
                  value={driverScansSearch}
                  onChange={(e) => {
                    setDriverScansSearch(e.target.value);
                    setDriverScansPage(1);
                  }}
                  placeholder="Որոնել ըստ ուսանողի անունի/ID/էլ. փոստի"
                  className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-600">
                      <th className="px-4 py-3">Ուսանողի ID</th>
                      <th className="px-4 py-3">Ուսանող</th>
                      <th className="px-4 py-3">Սկանավորման ժամանակ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverScans.map((scan) => (
                      <tr key={scan.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{scan.student.studentId}</td>
                        <td className="px-4 py-3">{scan.student.name}</td>
                        <td className="px-4 py-3">
                          {new Date(scan.scannedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {driverScans.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          Սկանավորման գրանցումներ չեն գտնվել
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              <PaginationControls
                page={driverScansPage}
                totalPages={driverScansTotalPages}
                onPageChange={setDriverScansPage}
              />
            </div>
          </div>
        )}

        {section === 'driversCreate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ստեղծել վարորդ
              </h2>
              <form onSubmit={handleCreateDriver} className="space-y-3 max-w-md">
                <input
                  placeholder="Անուն"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver((s) => ({ ...s, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="email"
                  placeholder="Էլ. փոստ"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver((s) => ({ ...s, email: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  placeholder="Հեռախոս (ոչ պարտադիր)"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Գաղտնաբառ"
                  value={newDriver.password}
                  onChange={(e) => setNewDriver((s) => ({ ...s, password: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ստեղծել վարորդ
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
