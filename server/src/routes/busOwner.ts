import { Router } from 'express';
import * as busOwnerService from '../modules/busOwner/busOwnerService.js';
import { authenticate, requireRole, type AuthRequest } from '../middlewares/auth.js';
import {
  createAssignmentSchema,
  createBusSchema,
  createDriverSchema,
} from '../modules/busOwner/busOwnerValidation.js';
import { parseOrThrow } from '../utils/validation.js';

export const busOwnerRouter = Router();

busOwnerRouter.use(authenticate, requireRole('BUS_OWNER'));

busOwnerRouter.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    const stats = await busOwnerService.getBusOwnerStats(ownerId, from, to);
    res.json(stats);
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.get('/buses', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const buses = await busOwnerService.getOwnerBuses(ownerId);
    res.json({ buses });
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.post('/buses', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const parsed = parseOrThrow(createBusSchema, req.body);
    const bus = await busOwnerService.createOwnerBus(ownerId, parsed);
    res.status(201).json(bus);
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.get('/drivers', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const drivers = await busOwnerService.getOwnerDrivers(ownerId);
    res.json({ drivers });
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.post('/drivers', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const parsed = parseOrThrow(createDriverSchema, req.body);
    const driver = await busOwnerService.createOwnerDriver(ownerId, parsed);
    res.status(201).json(driver);
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.get('/assignments', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const assignments = await busOwnerService.getOwnerAssignments(ownerId);
    res.json({ assignments });
  } catch (e) {
    next(e);
  }
});

busOwnerRouter.post('/assignments', async (req: AuthRequest, res, next) => {
  try {
    const ownerId = req.user!.sub;
    const parsed = parseOrThrow(createAssignmentSchema, req.body);
    const assignment = await busOwnerService.createOwnerAssignment(ownerId, {
      driverId: parsed.driverId,
      busId: parsed.busId,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
    });
    res.status(201).json(assignment);
  } catch (e) {
    next(e);
  }
});

