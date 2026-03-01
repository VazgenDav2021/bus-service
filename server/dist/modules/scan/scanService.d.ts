import type { TripDirection } from '@prisma/client';
export interface ScanInput {
    qrToken: string;
    driverId: string;
    shiftId: string;
    busId: string;
    direction: TripDirection;
}
export interface StudentTripInput {
    studentId: string;
    driverId: string;
    shiftId: string;
    busId: string;
    direction: TripDirection;
}
export interface ScanResult {
    success: boolean;
    studentName: string;
    direction: TripDirection;
    remainingTrips: number;
    message: string;
}
export declare function createTripFromContext(input: ScanInput): Promise<ScanResult>;
export declare function createTripFromStudentId(input: StudentTripInput): Promise<ScanResult>;
export declare function processScan(input: ScanInput): Promise<ScanResult>;
//# sourceMappingURL=scanService.d.ts.map