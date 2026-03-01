import { type PaginationParams } from '../../utils/pagination.js';
interface AdminListQuery extends Partial<PaginationParams> {
    search?: string;
}
export declare function getDrivers(query: AdminListQuery): Promise<{
    drivers: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        bus: {
            plateNumber: string;
        };
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function getBuses(query: AdminListQuery): Promise<{
    buses: {
        id: string;
        owner: {
            email: string;
            name: string;
        };
        plateNumber: string;
        capacity: number;
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function getBusOwners(query: AdminListQuery): Promise<{
    owners: {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        _count: {
            buses: number;
        };
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function getStudents(query: AdminListQuery & {
    isActive?: boolean;
}): Promise<{
    students: {
        id: string;
        studentId: string;
        name: string;
        email: string | null;
        isActive: boolean;
        imageUrl: string | null;
        qrToken: string | null;
        qrUsageCount: number;
        qrUsageTotal: number;
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function createStudent(data: {
    name: string;
    email?: string;
    isActive: boolean;
    image?: {
        filePath: string;
    };
}): Promise<{
    qrToken: string;
    imageUrl: string | null;
    id: string;
    email: string | null;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    studentId: string;
}>;
export declare function deleteStudent(studentId: string): Promise<void>;
export declare function updateStudent(studentId: string, data: {
    name: string;
    email?: string;
    isActive: boolean;
    image?: {
        filePath: string;
    };
}): Promise<{
    imageUrl: string | null;
    id: string;
    email: string | null;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    studentId: string;
}>;
export declare function createBusOwner(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
}): Promise<{
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    phone: string | null;
}>;
export {};
//# sourceMappingURL=adminService.d.ts.map