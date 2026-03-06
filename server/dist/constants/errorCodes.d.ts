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
    readonly duplicateDriver: "DUPLICATE_DRIVER";
    readonly qrNotFound: "QR_NOT_FOUND";
    readonly noAssignedBus: "NO_ASSIGNED_BUS";
    readonly rateLimitExceeded: "RATE_LIMIT_EXCEEDED";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
//# sourceMappingURL=errorCodes.d.ts.map