import type { Role } from '../types/domain';
import type {
  AssignmentListResponse,
  BoardingResponse,
  BusListResponse,
  CreateBusResponse,
  CreateDriverResponse,
  CreateOwnerResponse,
  CreateStudentResponse,
  DriverListResponse,
  DriverMeResponse,
  LoginResponse,
  OwnerListResponse,
  OwnerStatsResponse,
  RefreshResponse,
  StudentListResponse,
  StudentScanResponse,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface ApiError {
  error: string;
  code?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ApiError;
    throw new Error(err.error || 'Հարցումը ձախողվեց');
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string, role: Role) =>
      request<LoginResponse>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password, role }),
        }
      ),
    refresh: () =>
      request<RefreshResponse>(
        '/auth/refresh',
        {
          method: 'POST',
        }
      ),
    logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
  },
  driver: {
    me: () => request<DriverMeResponse>('/driver/me'),
    getStudentByQr: (qrToken: string) =>
      request<StudentScanResponse>(`/driver/scan/student?qrToken=${encodeURIComponent(qrToken)}`),
    submitBoarding: (qrToken: string) =>
      request<BoardingResponse>('/driver/scan/board', {
        method: 'POST',
        body: JSON.stringify({ qrToken }),
      }),
  },
  admin: {
    drivers: () => request<DriverListResponse>('/admin/drivers'),
    buses: () => request<BusListResponse>('/admin/buses'),
    owners: () => request<OwnerListResponse>('/admin/owners'),
    students: () => request<StudentListResponse>('/admin/students'),
    createStudent: (studentId: string, name: string, email?: string) =>
      request<CreateStudentResponse>('/admin/students', {
        method: 'POST',
        body: JSON.stringify({ studentId, name, email }),
      }),
    createOwner: (name: string, email: string, password: string, phone?: string) =>
      request<CreateOwnerResponse>('/admin/owners', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      }),
  },
  busOwner: {
    stats: (from?: string, to?: string) =>
      request<OwnerStatsResponse>(
        `/bus-owner/stats?${from ? `from=${from}` : ''}${to ? `&to=${to}` : ''}`
      ),
    buses: () => request<BusListResponse>('/bus-owner/buses'),
    createBus: (plateNumber: string, capacity: number) =>
      request<CreateBusResponse>('/bus-owner/buses', {
        method: 'POST',
        body: JSON.stringify({ plateNumber, capacity }),
      }),
    drivers: () => request<DriverListResponse>('/bus-owner/drivers'),
    createDriver: (
      name: string,
      email: string,
      password: string,
      phone?: string
    ) =>
      request<CreateDriverResponse>('/bus-owner/drivers', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      }),
    assignments: () => request<AssignmentListResponse>('/bus-owner/assignments'),
    createAssignment: (
      driverId: string,
      busId: string,
      startDate: string,
      endDate: string
    ) =>
      request<AssignmentListResponse['assignments'][number]>('/bus-owner/assignments', {
        method: 'POST',
        body: JSON.stringify({ driverId, busId, startDate, endDate }),
      }),
  },
};
