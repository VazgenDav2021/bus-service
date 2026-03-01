import { Router } from 'express';
import * as busOwnerService from '../modules/busOwner/busOwnerService.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { createAssignmentSchema, createBusSchema, createDriverSchema, paginatedListQuerySchema, } from '../modules/busOwner/busOwnerValidation.js';
import { parseOrThrow } from '../utils/validation.js';
export const busOwnerRouter = Router();
busOwnerRouter.use(authenticate, requireRole('BUS_OWNER'));
busOwnerRouter.get('/stats', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const from = req.query.from ? new Date(req.query.from) : undefined;
        const to = req.query.to ? new Date(req.query.to) : undefined;
        const stats = await busOwnerService.getBusOwnerStats(ownerId, from, to);
        res.json(stats);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.get('/buses', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const query = paginatedListQuerySchema.parse(req.query);
        const result = await busOwnerService.getOwnerBuses(ownerId, query);
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.post('/buses', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const parsed = parseOrThrow(createBusSchema, req.body);
        const bus = await busOwnerService.createOwnerBus(ownerId, parsed);
        res.status(201).json(bus);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.get('/drivers', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const query = paginatedListQuerySchema.parse(req.query);
        const result = await busOwnerService.getOwnerDrivers(ownerId, query);
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.post('/drivers', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const parsed = parseOrThrow(createDriverSchema, req.body);
        const driver = await busOwnerService.createOwnerDriver(ownerId, parsed);
        res.status(201).json(driver);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.get('/assignments', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const query = paginatedListQuerySchema.parse(req.query);
        const result = await busOwnerService.getOwnerAssignments(ownerId, query);
        res.json(result);
    }
    catch (e) {
        next(e);
    }
});
busOwnerRouter.post('/assignments', async (req, res, next) => {
    try {
        const ownerId = req.user.sub;
        const parsed = parseOrThrow(createAssignmentSchema, req.body);
        const assignment = await busOwnerService.createOwnerAssignment(ownerId, {
            driverId: parsed.driverId,
            busId: parsed.busId,
            startDate: new Date(parsed.startDate),
            endDate: new Date(parsed.endDate),
        });
        res.status(201).json(assignment);
    }
    catch (e) {
        next(e);
    }
});
