import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, Bus, Users, Plus } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import type {
  AssignmentListItem,
  BusListItem,
  DriverListItem,
  OwnerStats,
} from '../../types/domain';
import { DEFAULT_PASSWORD } from '../../constants/auth';
import { APP_ROUTES } from '../../constants/routes';
import { getErrorMessage } from '../../utils/errors';
import { toDateInputRange, toLocaleDate } from '../../utils/date';
import { PaginationControls } from '../../components/PaginationControls';

const PAGE_SIZE = 10;
type BusOwnerSection =
  | 'analytics'
  | 'drivers'
  | 'assignments'
  | 'driversCreate'
  | 'assignmentsCreate'
  | 'buses';

const BUS_OWNER_ROUTE_PATHS = {
  analytics: APP_ROUTES.busOwnerAnalytics,
  drivers: APP_ROUTES.busOwnerDrivers,
  assignments: APP_ROUTES.busOwnerAssignments,
  driversCreate: APP_ROUTES.busOwnerDriversCreate,
  assignmentsCreate: APP_ROUTES.busOwnerAssignmentsCreate,
  buses: APP_ROUTES.busOwnerBuses,
} as const;

function getBusOwnerSection(pathname: string): BusOwnerSection | null {
  if (pathname === BUS_OWNER_ROUTE_PATHS.analytics) return 'analytics';
  if (pathname === BUS_OWNER_ROUTE_PATHS.drivers) return 'drivers';
  if (pathname === BUS_OWNER_ROUTE_PATHS.assignments) return 'assignments';
  if (pathname === BUS_OWNER_ROUTE_PATHS.driversCreate) return 'driversCreate';
  if (pathname === BUS_OWNER_ROUTE_PATHS.assignmentsCreate) return 'assignmentsCreate';
  if (pathname === BUS_OWNER_ROUTE_PATHS.buses) return 'buses';
  return null;
}

export function BusOwnerDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const section = getBusOwnerSection(location.pathname);
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [buses, setBuses] = useState<BusListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    password: DEFAULT_PASSWORD,
  });
  const [newBus, setNewBus] = useState({
    plateNumber: '',
    capacity: 40,
  });
  const [newAssignment, setNewAssignment] = useState({
    driverId: '',
    busId: '',
    startDate: '',
    endDate: '',
  });
  const [driversSearch, setDriversSearch] = useState('');
  const [driversPage, setDriversPage] = useState(1);
  const [driversTotalPages, setDriversTotalPages] = useState(1);
  const [assignmentsSearch, setAssignmentsSearch] = useState('');
  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [assignmentsTotalPages, setAssignmentsTotalPages] = useState(1);
  const [busesSearch, setBusesSearch] = useState('');
  const [busesPage, setBusesPage] = useState(1);
  const [busesTotalPages, setBusesTotalPages] = useState(1);
  const [assignmentDriverOptions, setAssignmentDriverOptions] = useState<DriverListItem[]>([]);
  const [assignmentBusOptions, setAssignmentBusOptions] = useState<BusListItem[]>([]);

  useEffect(() => {
    if (
      location.pathname === APP_ROUTES.busOwner ||
      location.pathname === `${APP_ROUTES.busOwner}/`
    ) {
      navigate(BUS_OWNER_ROUTE_PATHS.analytics, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    api.busOwner
      .stats()
      .then((d) => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (section !== 'drivers') return;
    setLoading(true);
    api.busOwner
      .drivers({
        page: driversPage,
        pageSize: PAGE_SIZE,
        search: driversSearch,
      })
      .then((driversData) => {
        setDrivers(driversData.drivers);
        setDriversTotalPages(driversData.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [section, driversPage, driversSearch]);

  useEffect(() => {
    if (section !== 'assignments') return;
    setLoading(true);
    api.busOwner
      .assignments({
        page: assignmentsPage,
        pageSize: PAGE_SIZE,
        search: assignmentsSearch,
      })
      .then((assignmentsData) => {
        setAssignments(assignmentsData.assignments);
        setAssignmentsTotalPages(assignmentsData.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [section, assignmentsPage, assignmentsSearch]);

  useEffect(() => {
    if (section !== 'assignmentsCreate') return;
    setLoading(true);
    Promise.all([api.busOwner.drivers({ page: 1, pageSize: 100 }), api.busOwner.buses({ page: 1, pageSize: 100 })])
      .then(([driverOptionsData, busOptionsData]) => {
        setAssignmentDriverOptions(driverOptionsData.drivers);
        setAssignmentBusOptions(busOptionsData.buses);
        setNewAssignment((prev) => ({
          ...prev,
          busId: prev.busId || busOptionsData.buses[0]?.id || '',
          driverId: prev.driverId || driverOptionsData.drivers[0]?.id || '',
        }));
      })
      .finally(() => setLoading(false));
  }, [section]);

  useEffect(() => {
    if (section !== 'buses') return;
    setLoading(true);
    api.busOwner
      .buses({
        page: busesPage,
        pageSize: PAGE_SIZE,
        search: busesSearch,
      })
      .then((busesData) => {
        setBuses(busesData.buses);
        setBusesTotalPages(busesData.pagination.totalPages);
      })
      .finally(() => setLoading(false));
  }, [section, busesPage, busesSearch]);

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
      const driversData = await api.busOwner.drivers({
        page: driversPage,
        pageSize: PAGE_SIZE,
        search: driversSearch,
      });
      setDrivers(driversData.drivers);
      setDriversTotalPages(driversData.pagination.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել վարորդ'));
    }
  }

  async function handleCreateBus(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.busOwner.createBus(newBus.plateNumber, newBus.capacity);
      setNewBus({ plateNumber: '', capacity: 40 });
      const busesData = await api.busOwner.buses({
        page: busesPage,
        pageSize: PAGE_SIZE,
        search: busesSearch,
      });
      setBuses(busesData.buses);
      setBusesTotalPages(busesData.pagination.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել ավտոբուս'));
    }
  }

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!newAssignment.startDate || !newAssignment.endDate) {
        toast.warn('Պահանջվում են մեկնարկի և ավարտի ամսաթվերը');
        return;
      }
      const { startIso, endIso } = toDateInputRange(
        newAssignment.startDate,
        newAssignment.endDate
      );

      await api.busOwner.createAssignment(
        newAssignment.driverId,
        newAssignment.busId,
        startIso,
        endIso
      );

      const assignmentsData = await api.busOwner.assignments({
        page: assignmentsPage,
        pageSize: PAGE_SIZE,
        search: assignmentsSearch,
      });
      setAssignments(assignmentsData.assignments);
      setAssignmentsTotalPages(assignmentsData.pagination.totalPages);
      setNewAssignment((prev) => ({ ...prev, startDate: '', endDate: '' }));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել կցում'));
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
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.analytics)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.analytics
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Վերլուծություն
          </button>
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
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.assignments)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.assignments
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Կցումներ
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
          <button
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.assignmentsCreate)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.assignmentsCreate
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Ստեղծել կցում
          </button>
          <button
            onClick={() => navigate(BUS_OWNER_ROUTE_PATHS.buses)}
            className={`px-4 py-2 rounded-lg font-medium ${
              location.pathname === BUS_OWNER_ROUTE_PATHS.buses
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Ավտոբուսներ
          </button>
        </div>

        {section === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Պարկի վերլուծություն
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Միայն համախմբված վիճակագրություն։ Ուսանողների անձնական տվյալներ չեն ցուցադրվում։
            </p>

            {loading ? (
              <div className="text-slate-500">Բեռնվում է...</div>
            ) : stats ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-600">Ընդհանուր ավտոբուսներ</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.buses}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Ընդհանուր վարորդներ</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.drivers}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Տվյալներ չկան</p>
            )}
          </div>
        )}

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
                      <th className="px-4 py-3">Ընթացիկ ավտոբուս</th>
                      <th className="px-4 py-3">Գործում է մինչև</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr key={d.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{d.name}</td>
                        <td className="px-4 py-3">{d.email}</td>
                        <td className="px-4 py-3">{d.phone ?? '-'}</td>
                        <td className="px-4 py-3">{d.bus?.plateNumber ?? '-'}</td>
                        <td className="px-4 py-3">
                          {d.activeAssignment?.endDate
                            ? toLocaleDate(d.activeAssignment.endDate)
                            : '-'}
                        </td>
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

        {section === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Կցումներ</h2>
              </div>
              <div className="p-4 border-b border-slate-200">
                <input
                  value={assignmentsSearch}
                  onChange={(e) => {
                    setAssignmentsSearch(e.target.value);
                    setAssignmentsPage(1);
                  }}
                  placeholder="Որոնել կցումներ"
                  className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              {loading ? (
                <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-600">
                      <th className="px-4 py-3">Վարորդ</th>
                      <th className="px-4 py-3">Ավտոբուս</th>
                      <th className="px-4 py-3">Սկիզբ</th>
                      <th className="px-4 py-3">Ավարտ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{a.driver.name}</td>
                        <td className="px-4 py-3">{a.bus.plateNumber}</td>
                        <td className="px-4 py-3">{toLocaleDate(a.startDate)}</td>
                        <td className="px-4 py-3">{toLocaleDate(a.endDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <PaginationControls
                page={assignmentsPage}
                totalPages={assignmentsTotalPages}
                onPageChange={setAssignmentsPage}
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

        {section === 'assignmentsCreate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Կցել ավտոբուս վարորդին (ամսաթվերի միջակայք)
              </h2>
              <form onSubmit={handleCreateAssignment} className="space-y-3 max-w-md">
                <select
                  value={newAssignment.driverId}
                  onChange={(e) => setNewAssignment((s) => ({ ...s, driverId: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                >
                  <option value="">Ընտրել վարորդ</option>
                  {assignmentDriverOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.email})
                    </option>
                  ))}
                </select>
                <select
                  value={newAssignment.busId}
                  onChange={(e) => setNewAssignment((s) => ({ ...s, busId: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                >
                  <option value="">Ընտրել ավտոբուս</option>
                  {assignmentBusOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.plateNumber}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newAssignment.startDate}
                  onChange={(e) => setNewAssignment((s) => ({ ...s, startDate: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="date"
                  value={newAssignment.endDate}
                  onChange={(e) => setNewAssignment((s) => ({ ...s, endDate: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ստեղծել կցում
                </button>
              </form>
            </div>
          </div>
        )}

        {section === 'buses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ստեղծել ավտոբուս
              </h2>
              <form onSubmit={handleCreateBus} className="space-y-3 max-w-md">
                <input
                  placeholder="Համարանիշ"
                  value={newBus.plateNumber}
                  onChange={(e) => setNewBus((s) => ({ ...s, plateNumber: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="number"
                  min={1}
                  value={newBus.capacity}
                  onChange={(e) =>
                    setNewBus((s) => ({ ...s, capacity: Number(e.target.value) || 1 }))
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ստեղծել ավտոբուս
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Իմ ավտոբուսները</h2>
              </div>
              <div className="p-4 border-b border-slate-200">
                <input
                  value={busesSearch}
                  onChange={(e) => {
                    setBusesSearch(e.target.value);
                    setBusesPage(1);
                  }}
                  placeholder="Որոնել ավտոբուսներ"
                  className="w-full max-w-sm px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              {loading ? (
                <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-600">
                      <th className="px-4 py-3">Համարանիշ</th>
                      <th className="px-4 py-3">Տարողություն</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((b) => (
                      <tr key={b.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{b.plateNumber}</td>
                        <td className="px-4 py-3">{b.capacity ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <PaginationControls
                page={busesPage}
                totalPages={busesTotalPages}
                onPageChange={setBusesPage}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
