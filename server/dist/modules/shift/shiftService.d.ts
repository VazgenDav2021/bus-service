export interface StartShiftInput {
    driverId: string;
    busId: string;
    startTime: Date;
    endTime: Date;
}
export declare function startShift(input: StartShiftInput): Promise<{
    shift: {
        id: string;
        startTime: string;
        endTime: string;
        bus: {
            id: string;
            createdAt: Date;
            plateNumber: string;
            capacity: number;
            ownerId: string;
            updatedAt: Date;
        };
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}>;
export declare function getDriverShifts(driverId: string, from?: Date, to?: Date): Promise<{
    id: string;
    startTime: string;
    endTime: string;
    bus: {
        id: string;
        createdAt: Date;
        plateNumber: string;
        capacity: number;
        ownerId: string;
        updatedAt: Date;
    };
}[]>;
//# sourceMappingURL=shiftService.d.ts.map