import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/auth.js';
import * as driverService from '../modules/driver/driverService.js';
import { asyncHandler } from '../shared/http/asyncHandler.js';
import { createBoardingSchema, studentScanQuerySchema, } from '../modules/driver/driverValidation.js';
import { parseOrThrow } from '../utils/validation.js';
export const driverRouter = Router();
driverRouter.use(authenticate, requireRole('DRIVER'));
driverRouter.get('/me', asyncHandler(async (req, res) => {
    const driver = await driverService.getDriverProfile(req.user.sub);
    res.json(driver);
}));
driverRouter.get('/scan/student', asyncHandler(async (req, res) => {
    const parsed = parseOrThrow(studentScanQuerySchema, req.query);
    const student = await driverService.getStudentByQr(req.user.sub, parsed.qrToken);
    res.json(student);
}));
driverRouter.post('/scan/board', asyncHandler(async (req, res) => {
    const parsed = parseOrThrow(createBoardingSchema, req.body);
    const result = await driverService.createBoarding(req.user.sub, parsed.qrToken);
    res.status(201).json(result);
}));
