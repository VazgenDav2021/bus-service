import 'dotenv/config';
export const config = {
    port: parseInt(process.env.PORT ?? '4000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseUrl: process.env.DATABASE_URL ?? '',
    appBaseUrl: process.env.APP_BASE_URL ?? 'http://localhost:3000',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10),
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100', 10),
        scanMax: parseInt(process.env.SCAN_RATE_LIMIT_MAX ?? '30', 10),
    },
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    mail: {
        host: process.env.SMTP_HOST ?? '',
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
        from: process.env.SMTP_FROM ?? '',
        defaultRecipient: process.env.MAIL_DEFAULT_RECIPIENT ?? 'd.2100.v@gmail.com',
    },
};
