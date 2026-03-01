import { Router } from 'express';
import * as shiftService from '../modules/shift/shiftService.js';
import { startShiftSchema } from '../modules/shift/shiftValidation.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { setAuthCookies } from '../utils/authCookies.js';
export const shiftRouter = Router();
shiftRouter.post('/start', authenticate, requireRole('DRIVER'), async (req, res, next) => {
    try {
        const parsed = startShiftSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: parsed.error.errors[0]?.message ?? 'Validation failed',
                code: 'VALIDATION_ERROR',
            });
            return;
        }
        const driverId = req.user.sub;
        const startTime = new Date(parsed.data.startTime);
        const endTime = new Date(parsed.data.endTime);
        const result = await shiftService.startShift({
            driverId,
            busId: parsed.data.busId,
            startTime,
            endTime,
        });
        setAuthCookies(res, result.accessToken, result.refreshToken, result.expiresAt);
        res.json({
            shift: result.shift,
            expiresAt: result.expiresAt,
        });
    }
    catch (e) {
        next(e);
    }
});
shiftRouter.get('/', authenticate, requireRole('DRIVER'), async (req, res, next) => {
    try {
        const driverId = req.user.sub;
        const from = req.query.from
            ? new Date(req.query.from)
            : undefined;
        const to = req.query.to ? new Date(req.query.to) : undefined;
        const shifts = await shiftService.getDriverShifts(driverId, from, to);
        res.json({ shifts });
    }
    catch (e) {
        next(e);
    }
});
