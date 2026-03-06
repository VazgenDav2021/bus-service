export declare function getDriverProfile(driverId: string): Promise<{
    id: string;
    email: string;
    name: string;
}>;
export declare function getStudentByQr(driverId: string, qrToken: string): Promise<{
    student: {
        id: string;
        studentId: string;
        name: string;
        email: string | null;
        imageUrl: string | null;
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