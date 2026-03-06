export type Role = 'ADMIN' | 'DRIVER' | 'BUS_OWNER';

export interface DriverProfile {
  id: string;
  name: string;
  email: string;
}

export interface BusRef {
  id: string;
  plateNumber: string;
}

export interface StudentListItem {
  id: string;
  studentId: string;
  name: string;
  email: string | null;
  isActive: boolean;
  imageUrl: string | null;
  qrToken: string | null;
}

export interface DriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface OwnerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface OwnerStats {
  drivers: number;
}

export interface StudentScanResult {
  student: {
    id: string;
    studentId: string;
    name: string;
    email: string | null;
    imageUrl: string | null;
  };
  bus: BusRef;
}

export interface BoardingResult {
  success: boolean;
  message: string;
  student: { studentId: string; name: string };
  bus: BusRef;
}
