import type {
  AssignmentListItem,
  BoardingResult,
  BusListItem,
  DriverListItem,
  DriverProfile,
  OwnerListItem,
  OwnerStats,
  Role,
  StudentListItem,
  StudentScanResult,
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
}

export interface BusListResponse {
  buses: BusListItem[];
}

export interface OwnerListResponse {
  owners: OwnerListItem[];
}

export interface StudentListResponse {
  students: StudentListItem[];
}

export interface OwnerStatsResponse extends OwnerStats {}

export interface AssignmentListResponse {
  assignments: AssignmentListItem[];
}

export interface CreateStudentResponse {
  id: string;
  studentId: string;
  name: string;
  email: string | null;
  qrToken: string;
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

export interface CreateBusResponse {
  id: string;
  plateNumber: string;
  capacity: number;
  createdAt: string;
}

export type DriverMeResponse = DriverProfile;
export type StudentScanResponse = StudentScanResult;
export type BoardingResponse = BoardingResult;
