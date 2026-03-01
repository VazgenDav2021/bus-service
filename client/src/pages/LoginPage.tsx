import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, LogIn } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import type { Role } from '../types/domain';
import { DEFAULT_PASSWORD, ROLE_EMAILS, isRole } from '../constants/auth';
import { ROLE_HOME_ROUTES } from '../constants/routes';
import { getErrorMessage } from '../utils/errors';

export function LoginPage() {
  const [role, setRole] = useState<Role>('DRIVER');
  const [email, setEmail] = useState(ROLE_EMAILS.DRIVER[0]);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleRoleChange(nextRole: Role) {
    setRole(nextRole);
    setEmail(ROLE_EMAILS[nextRole][0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(ROLE_HOME_ROUTES[role]);
    } catch (err) {
      setError(getErrorMessage(err, 'Մուտքը ձախողվեց'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-primary-600 rounded-xl">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Ուսանողների տեղափոխում
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Դեր
              </label>
              <select
                value={role}
                onChange={(e) => {
                  if (isRole(e.target.value)) {
                    handleRoleChange(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="DRIVER">Վարորդ</option>
                <option value="ADMIN">Ադմին</option>
                <option value="BUS_OWNER">Ավտոբուսի սեփականատեր</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Էլ. փոստ
              </label>
              <select
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {ROLE_EMAILS[role].map((roleEmail) => (
                  <option key={roleEmail} value={roleEmail}>
                    {roleEmail}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Գաղտնաբառ
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Մուտք...' : 'Մուտք գործել'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Քաղաքային ուսանողների տեղափոխման կառավարման համակարգ
          </p>
        </div>
      </div>
    </div>
  );
}
