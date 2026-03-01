export declare const ERROR_CODES: {
    readonly validationError: "VALIDATION_ERROR";
    readonly unauthorized: "UNAUTHORIZED";
    readonly forbidden: "FORBIDDEN";
    readonly notFound: "NOT_FOUND";
    readonly internalError: "INTERNAL_ERROR";
    readonly unknownError: "UNKNOWN_ERROR";
    readonly invalidCredentials: "INVALID_CREDENTIALS";
    readonly invalidRefreshToken: "INVALID_REFRESH_TOKEN";
    readonly duplicateStudent: "DUPLICATE_STUDENT";
    readonly duplicateBusOwner: "DUPLICATE_BUS_OWNER";
    readonly duplicateBus: "DUPLICATE_BUS";
    readonly duplicateDriver: "DUPLICATE_DRIVER";
    readonly invalidDateRange: "INVALID_DATE_RANGE";
    readonly driverForbidden: "DRIVER_FORBIDDEN";
    readonly busForbidden: "BUS_FORBIDDEN";
    readonly assignmentOverlap: "ASSIGNMENT_OVERLAP";
    readonly noActiveBusAssignment: "NO_ACTIVE_BUS_ASSIGNMENT";
    readonly qrNotFound: "QR_NOT_FOUND";
    readonly nonWorkingDay: "NON_WORKING_DAY";
    readonly dailyBoardingLimitReached: "DAILY_BOARDING_LIMIT_REACHED";
    readonly rateLimitExceeded: "RATE_LIMIT_EXCEEDED";
    readonly scanRateLimitExceeded: "SCAN_RATE_LIMIT_EXCEEDED";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
//# sourceMappingURL=errorCodes.d.ts.map