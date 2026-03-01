import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { parseOrThrow } from '../utils/validation.js';
import { createBoardingSchema, studentScanQuerySchema, } from '../modules/driver/driverValidation.js';
import * as driverService from '../modules/driver/driverService.js';
import { sendError } from '../utils/response.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
export const driverRouter = Router();
driverRouter.use(authenticate, requireRole('DRIVER'));
driverRouter.get('/me', async (req, res, next) => {
    try {
        const driver = await driverService.getDriverProfile(req.user.sub);
        res.json(driver);
    }
    catch (e) {
        next(e);
    }
});
driverRouter.get('/scan/student', async (req, res, next) => {
    try {
        const parsed = studentScanQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            sendError(res, 400, parsed.error.errors[0]?.message ?? ERROR_MESSAGES.qrTokenRequired, ERROR_CODES.validationError);
            return;
        }
        const studentInfo = await driverService.getStudentByQr(req.user.sub, parsed.data.qrToken);
        res.json(studentInfo);
    }
    catch (e) {
        next(e);
    }
});
driverRouter.post('/scan/board', async (req, res, next) => {
    try {
        const parsed = parseOrThrow(createBoardingSchema, req.body);
        const result = await driverService.createBoarding(req.user.sub, parsed.qrToken);
        res.status(201).json(result);
    }
    catch (e) {
        next(e);
    }
});
