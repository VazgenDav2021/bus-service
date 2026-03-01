import 'dotenv/config';
export declare const config: {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    appBaseUrl: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
    };
    rateLimit: {
        windowMs: number;
        max: number;
        scanMax: number;
    };
    corsOrigin: string;
    mail: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
        defaultRecipient: string;
    };
};
//# sourceMappingURL=config.d.ts.map