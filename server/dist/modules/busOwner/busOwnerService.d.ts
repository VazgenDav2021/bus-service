import { type PaginationParams } from '../../utils/pagination.js';
interface OwnerListQuery extends Partial<PaginationParams> {
    search?: string;
}
export declare function getBusOwnerStats(ownerId: string, _from?: Date, _to?: Date): Promise<{
    buses: number;
    drivers: number;
}>;
export declare function getOwnerBuses(ownerId: string, query: OwnerListQuery): Promise<{
    buses: {
        id: string;
        plateNumber: string;
        capacity: number;
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function createOwnerBus(ownerId: string, data: {
    plateNumber: string;
    capacity: number;
}): Promise<{
    id: string;
    createdAt: Date;
    plateNumber: string;
    capacity: number;
}>;
export declare function getOwnerDrivers(ownerId: string, query: OwnerListQuery): Promise<{
    drivers: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        bus: {
            id: string;
            plateNumber: string;
        };
        activeAssignment: {
            startDate: string;
            endDate: string;
        } | null;
        createdAt: Date;
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function createOwnerDriver(ownerId: string, data: {
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
export declare function getOwnerAssignments(ownerId: string, query: OwnerListQuery): Promise<{
    assignments: {
        id: string;
        driver: {
            id: string;
            email: string;
            name: string;
        };
        startDate: Date;
        endDate: Date;
        bus: {
            id: string;
            plateNumber: string;
        };
    }[];
    pagination: import("../../utils/pagination.js").PaginationMeta;
}>;
export declare function createOwnerAssignment(ownerId: string, data: {
    driverId: string;
    busId: string;
    startDate: Date;
    endDate: Date;
}): Promise<{
    id: string;
    driver: {
        id: string;
        email: string;
        name: string;
    };
    startDate: Date;
    endDate: Date;
    bus: {
        id: string;
        plateNumber: string;
    };
}>;
export {};
//# sourceMappingURL=busOwnerService.d.ts.map