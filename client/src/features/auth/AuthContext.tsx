import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '../../lib/api';
import type { Role } from '../../types/domain';
import { isRole } from '../../constants/auth';

interface User {
  role: Role;
  expiresAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  setSessionExpiry: (expiresAt: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setSessionExpiry = useCallback(
    (expiresAt: string) => {
      localStorage.setItem('expiresAt', expiresAt);
      const role = localStorage.getItem('role');
      if (isRole(role)) {
        setUser({
          role,
          expiresAt,
        });
      }
    },
    []
  );

  useEffect(() => {
    const role = localStorage.getItem('role');
    const expiresAt = localStorage.getItem('expiresAt');

    if (!isRole(role)) {
      setLoading(false);
      return;
    }

    const expires = expiresAt ? new Date(expiresAt) : null;
    if (expires && expires <= new Date()) {
      localStorage.removeItem('role');
      localStorage.removeItem('expiresAt');
      setUser(null);
      setLoading(false);
      return;
    }

    setUser({
      role,
      expiresAt: expiresAt ?? '',
    });
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: Role) => {
      const tokens = await api.auth.login(email, password, role);
      localStorage.setItem('expiresAt', tokens.expiresAt);
      localStorage.setItem('role', role);
      setUser({
        role,
        expiresAt: tokens.expiresAt,
      });
    },
    []
  );

  const logout = useCallback(() => {
    void api.auth.logout().catch(() => undefined);
    localStorage.removeItem('role');
    localStorage.removeItem('expiresAt');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, setSessionExpiry }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
