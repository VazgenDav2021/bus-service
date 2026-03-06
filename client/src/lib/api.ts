import type { Role } from '../types/domain';
import type {
  BoardingResponse,
  CreateDriverResponse,
  CreateOwnerResponse,
  CreateStudentPayload,
  CreateStudentResponse,
  DriverListResponse,
  DriverScanListResponse,
  DriverMeResponse,
  LoginResponse,
  ListQueryParams,
  OwnerListResponse,
  RefreshResponse,
  StudentScanResponse,
  StudentListResponse,
  UpdateStudentPayload,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function toQueryString(params?: ListQueryParams): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  if (typeof params.page === 'number') {
    searchParams.set('page', String(params.page));
  }
  if (typeof params.pageSize === 'number') {
    searchParams.set('pageSize', String(params.pageSize));
  }
  if (params.search && params.search.trim().length > 0) {
    searchParams.set('search', params.search.trim());
  }
  if (typeof params.isActive === 'boolean') {
    searchParams.set('isActive', String(params.isActive));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : '';
}

export interface ApiError {
  error: string;
  code?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers = new Headers(options.headers);
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

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
    drivers: (params?: ListQueryParams) =>
      request<DriverListResponse>(`/admin/drivers${toQueryString(params)}`),
    owners: (params?: ListQueryParams) =>
      request<OwnerListResponse>(`/admin/owners${toQueryString(params)}`),
    students: (params?: ListQueryParams) =>
      request<StudentListResponse>(`/admin/students${toQueryString(params)}`),
    createStudent: (payload: CreateStudentPayload) => {
      const formData = new FormData();
      formData.set('name', payload.name);
      formData.set('isActive', String(payload.isActive));
      if (payload.email) {
        formData.set('email', payload.email);
      }
      if (payload.image) {
        formData.set('image', payload.image);
      }
      return request<CreateStudentResponse>('/admin/students', {
        method: 'POST',
        body: formData,
      });
    },
    deleteStudent: (id: string) =>
      request<{ success: boolean }>(`/admin/students/${id}`, {
        method: 'DELETE',
      }),
    updateStudent: (id: string, payload: UpdateStudentPayload) => {
      const formData = new FormData();
      formData.set('studentId', payload.studentId);
      formData.set('name', payload.name);
      formData.set('isActive', String(payload.isActive));
      if (payload.email) {
        formData.set('email', payload.email);
      }
      if (payload.image) {
        formData.set('image', payload.image);
      }
      return request<CreateStudentResponse>(`/admin/students/${id}`, {
        method: 'PATCH',
        body: formData,
      });
    },
    createOwner: (name: string, email: string, password: string, phone?: string) =>
      request<CreateOwnerResponse>('/admin/owners', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      }),
  },
  busOwner: {
    drivers: (params?: ListQueryParams) =>
      request<DriverListResponse>(`/bus-owner/drivers${toQueryString(params)}`),
    driverScans: (driverId: string, params?: ListQueryParams) =>
      request<DriverScanListResponse>(
        `/bus-owner/drivers/${driverId}/scans${toQueryString(params)}`
      ),
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
  },
};
