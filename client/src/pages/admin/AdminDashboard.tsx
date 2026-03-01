import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Users,
  Bus,
  Plus,
  QrCode,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { api } from '../../lib/api';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { toast } from 'react-toastify';
import type {
  BusListItem,
  DriverListItem,
  OwnerListItem,
  StudentListItem,
} from '../../types/domain';
import type { CreateStudentResponse } from '../../types/api';
import { DEFAULT_PASSWORD } from '../../constants/auth';
import { APP_ROUTES } from '../../constants/routes';
import { getErrorMessage } from '../../utils/errors';

type Tab = 'students' | 'drivers' | 'buses' | 'owners';

export function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('students');
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [buses, setBuses] = useState<BusListItem[]>([]);
  const [owners, setOwners] = useState<OwnerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentId: '',
    name: '',
    email: '',
  });
  const [newOwner, setNewOwner] = useState({
    name: '',
    email: '',
    phone: '',
    password: DEFAULT_PASSWORD,
  });
  const [createdStudentQR, setCreatedStudentQR] = useState<{
    studentId: string;
    name: string;
    qrToken: string;
  } | null>(null);
  const [viewingQR, setViewingQR] = useState<{
    studentId: string;
    name: string;
    qrToken: string;
  } | null>(null);

  useEffect(() => {
    if (tab === 'students') {
      setLoading(true);
      api.admin.students().then((d) => setStudents(d.students)).finally(() => setLoading(false));
    } else if (tab === 'drivers') {
      setLoading(true);
      api.admin.drivers().then((d) => setDrivers(d.drivers)).finally(() => setLoading(false));
    } else if (tab === 'buses') {
      setLoading(true);
      api.admin.buses().then((d) => setBuses(d.buses)).finally(() => setLoading(false));
    } else if (tab === 'owners') {
      setLoading(true);
      api.admin.owners().then((d) => setOwners(d.owners)).finally(() => setLoading(false));
    }
  }, [tab]);

  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await api.admin.createStudent(
        newStudent.studentId,
        newStudent.name,
        newStudent.email || undefined
      );
      const qrStudentResult: CreateStudentResponse = result;
      setCreatedStudentQR({
        studentId: qrStudentResult.studentId,
        name: qrStudentResult.name,
        qrToken: qrStudentResult.qrToken,
      });
      setNewStudent({ studentId: '', name: '', email: '' });
      setTab('students');
      api.admin.students().then((d) => setStudents(d.students));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել ուսանող'));
    }
  }

  async function handleCreateOwner(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.admin.createOwner(
        newOwner.name,
        newOwner.email,
        newOwner.password,
        newOwner.phone || undefined
      );
      setNewOwner({ name: '', email: '', phone: '', password: DEFAULT_PASSWORD });
      setTab('owners');
      api.admin.owners().then((d) => setOwners(d.owners));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Չհաջողվեց ստեղծել ավտոբուսի սեփականատեր'));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary-600" />
            <span className="font-semibold text-slate-800">Ադմինի վահանակ</span>
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

      <div className="max-w-6xl mx-auto p-4">
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'students' as Tab, label: 'Ուսանողներ', icon: Users },
            { id: 'drivers' as Tab, label: 'Վարորդներ', icon: Users },
            { id: 'buses' as Tab, label: 'Ավտոբուսներ', icon: Bus },
            { id: 'owners' as Tab, label: 'Սեփականատերեր', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                tab === id ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {tab === 'students' && (
          <div className="space-y-6">
            {createdStudentQR && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-green-800">
                    Ուսանողը ստեղծվել է — QR կոդ
                  </h3>
                  <button
                    onClick={() => setCreatedStudentQR(null)}
                    className="p-1 rounded hover:bg-green-100 text-green-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <QRCodeDisplay
                    value={createdStudentQR.qrToken}
                    size={180}
                    studentName={createdStudentQR.name}
                  />
                </div>
                <p className="mt-3 text-sm text-green-700">
                  Տպեք կամ կիսվեք այս QR կոդը ուսանողի հետ։ Վարորդները այն սկանավորում են երթերի ընթացքում։
                </p>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ավելացնել ուսանող
              </h2>
              <form onSubmit={handleCreateStudent} className="space-y-3 max-w-md">
                <input
                  placeholder="Ուսանողի ID"
                  value={newStudent.studentId}
                  onChange={(e) =>
                    setNewStudent((s) => ({ ...s, studentId: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  placeholder="Անուն"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="email"
                  placeholder="Էլ. փոստ (ոչ պարտադիր)"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                >
                  Ստեղծել ուսանող
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Ուսանողներ</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 text-left text-sm text-slate-600">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Անուն</th>
                        <th className="px-4 py-3">Էլ. փոստ</th>
                        <th className="px-4 py-3">QR կոդ</th>
                        <th className="px-4 py-3">QR օգտագործում այսօր</th>
                        <th className="px-4 py-3">QR ընդհանուր օգտագործում</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id} className="border-t border-slate-100">
                          <td className="px-4 py-3">{s.studentId}</td>
                          <td className="px-4 py-3">{s.name}</td>
                          <td className="px-4 py-3">{s.email ?? '-'}</td>
                          <td className="px-4 py-3">
                            {s.qrToken ? (
                              <button
                                onClick={() => setViewingQR({ studentId: s.studentId, name: s.name, qrToken: s.qrToken! })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-sm font-medium"
                              >
                                <QrCode className="w-4 h-4" />
                                Դիտել QR
                              </button>
                            ) : (
                              <span className="text-slate-400 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">{s.qrUsageCount}</td>
                          <td className="px-4 py-3">{s.qrUsageTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {viewingQR && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingQR(null)}>
                <div className="bg-white rounded-xl p-6 max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">QR կոդ — {viewingQR.name}</h3>
                    <button
                      onClick={() => setViewingQR(null)}
                      className="p-2 rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <QRCodeDisplay value={viewingQR.qrToken} size={220} studentName={viewingQR.name} />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'drivers' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600">
                    <th className="px-4 py-3">Անուն</th>
                    <th className="px-4 py-3">Էլ. փոստ</th>
                    <th className="px-4 py-3">Ավտոբուս</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{d.name}</td>
                      <td className="px-4 py-3">{d.email}</td>
                      <td className="px-4 py-3">{d.bus?.plateNumber ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'buses' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Բեռնվում է...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-600">
                    <th className="px-4 py-3">Համարանիշ</th>
                    <th className="px-4 py-3">Տարողություն</th>
                    <th className="px-4 py-3">Սեփականատեր</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((b) => (
                    <tr key={b.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{b.plateNumber}</td>
                      <td className="px-4 py-3">{b.capacity}</td>
                      <td className="px-4 py-3">{b.owner?.name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'owners' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ավելացնել ավտոբուսի սեփականատեր
              </h2>
              <form onSubmit={handleCreateOwner} className="space-y-3 max-w-md">
                <input
                  placeholder="Անուն"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner((s) => ({ ...s, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="email"
                  placeholder="Էլ. փոստ"
                  value={newOwner.email}
                  onChange={(e) => setNewOwner((s) => ({ ...s, email: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  placeholder="Հեռախոս (ոչ պարտադիր)"
                  value={newOwner.phone}
                  onChange={(e) => setNewOwner((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  placeholder="Գաղտնաբառ"
                  value={newOwner.password}
                  onChange={(e) => setNewOwner((s) => ({ ...s, password: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300"
                />
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Ստեղծել ավտոբուսի սեփականատեր
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Ավտոբուսի սեփականատերեր</h2>
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
                      <th className="px-4 py-3">Ավտոբուսներ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.map((o) => (
                      <tr key={o.id} className="border-t border-slate-100">
                        <td className="px-4 py-3">{o.name}</td>
                        <td className="px-4 py-3">{o.email}</td>
                        <td className="px-4 py-3">{o.phone ?? '-'}</td>
                        <td className="px-4 py-3">{o._count?.buses ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
