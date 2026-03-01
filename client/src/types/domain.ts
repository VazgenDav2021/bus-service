export type Role = 'ADMIN' | 'DRIVER' | 'BUS_OWNER';

export interface BusRef {
  id: string;
  plateNumber: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  bus: BusRef | null;
}

export interface StudentListItem {
  id: string;
  studentId: string;
  name: string;
  email: string | null;
  isActive: boolean;
  imageUrl: string | null;
  qrToken: string | null;
  qrUsageCount: number;
  qrUsageTotal: number;
}

export interface DriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bus: { plateNumber: string } | null;
  activeAssignment?: {
    startDate: string;
    endDate: string;
  } | null;
}

export interface OwnerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  _count?: { buses: number };
}

export interface BusListItem {
  id: string;
  plateNumber: string;
  capacity: number;
  owner?: { name: string; email?: string };
}

export interface AssignmentListItem {
  id: string;
  startDate: string;
  endDate: string;
  driver: { id: string; name: string; email?: string };
  bus: { id: string; plateNumber: string };
}

export interface StudentScanResult {
  student: { id: string; studentId: string; name: string; email: string | null };
  bus: BusRef;
}

export interface BoardingResult {
  success: boolean;
  message: string;
  student: { studentId: string; name: string };
  bus: BusRef;
}

export interface OwnerStats {
  buses: number;
  drivers: number;
}
