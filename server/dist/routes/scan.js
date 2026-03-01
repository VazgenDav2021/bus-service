import { Router } from 'express';
import * as scanService from '../modules/scan/scanService.js';
import { scanSchema } from '../modules/scan/scanValidation.js';
import { authenticate, requireActiveDriverShift, } from '../middlewares/auth.js';
import { scanRateLimiter } from '../middlewares/rateLimiter.js';
export const scanRouter = Router();
scanRouter.post('/', authenticate, requireActiveDriverShift, scanRateLimiter, async (req, res, next) => {
    try {
        const parsed = scanSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: parsed.error.errors[0]?.message ?? 'Validation failed',
                code: 'VALIDATION_ERROR',
            });
            return;
        }
        const user = req.user;
        const shift = req.shift;
        const result = await scanService.processScan({
            qrToken: parsed.data.qrToken,
            driverId: user.sub,
            shiftId: shift.id,
            busId: shift.busId,
            direction: parsed.data.direction,
        });
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
