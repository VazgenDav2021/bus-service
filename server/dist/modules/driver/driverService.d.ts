export declare function getDriverProfile(driverId: string): Promise<{
    id: string;
    name: string;
    email: string;
    bus: {
        id: string;
        plateNumber: string;
    } | null;
}>;
export declare function getStudentByQr(driverId: string, qrToken: string): Promise<{
    student: {
        id: string;
        studentId: string;
        name: string;
        email: string | null;
    };
    bus: {
        id: string;
        plateNumber: string;
    };
}>;
export declare function createBoarding(driverId: string, qrToken: string): Promise<{
    success: boolean;
    message: string;
    boarding: {
        id: string;
        boardedAt: Date;
    };
    student: {
        studentId: string;
        name: string;
    };
    bus: {
        id: string;
        plateNumber: string;
    };
}>;
//# sourceMappingURL=driverService.d.ts.map