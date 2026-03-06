import type {
  BoardingResult,
  DriverListItem,
  DriverProfile,
  OwnerListItem,
  OwnerStats,
  Role,
  StudentScanResult,
  StudentListItem,
} from './domain';

export interface LoginResponse {
  expiresAt: string;
  role: Role;
}

export interface RefreshResponse {
  expiresAt: string;
}

export interface DriverListResponse {
  drivers: DriverListItem[];
  pagination: PaginationMeta;
}

export interface DriverScanListResponse {
  driver: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  scans: Array<{
    id: string;
    scannedAt: string;
    student: {
      id: string;
      studentId: string;
      name: string;
      email: string | null;
    };
  }>;
  pagination: PaginationMeta;
}

export interface OwnerListResponse {
  owners: OwnerListItem[];
  pagination: PaginationMeta;
}

export interface StudentListResponse {
  students: StudentListItem[];
  pagination: PaginationMeta;
}

export interface OwnerStatsResponse extends OwnerStats {}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateStudentResponse {
  id: string;
  studentId: string;
  name: string;
  email: string | null;
  isActive: boolean;
  imageUrl: string | null;
  qrToken: string;
}

export interface CreateStudentPayload {
  name: string;
  email?: string;
  isActive: boolean;
  image?: File;
}

export interface UpdateStudentPayload {
  studentId: string;
  name: string;
  email?: string;
  isActive: boolean;
  image?: File;
}

export interface CreateOwnerResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export type CreateDriverResponse = Omit<CreateOwnerResponse, 'phone'> & {
  phone: string | null;
};

export type DriverMeResponse = DriverProfile;
export type StudentScanResponse = StudentScanResult;
export type BoardingResponse = BoardingResult;
