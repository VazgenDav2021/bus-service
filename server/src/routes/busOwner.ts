import { Router } from 'express';
import * as busOwnerService from '../modules/busOwner/busOwnerService.js';
import { authenticate, requireRole, type AuthRequest } from '../middlewares/auth.js';
import {
  createDriverSchema,
  paginatedListQuerySchema,
} from '../modules/busOwner/busOwnerValidation.js';
import { parseOrThrow } from '../utils/validation.js';
import { asyncHandler } from '../shared/http/asyncHandler.js';

export const busOwnerRouter = Router();

busOwnerRouter.use(authenticate, requireRole('BUS_OWNER'));

busOwnerRouter.get('/drivers', asyncHandler<AuthRequest>(async (req, res) => {
  const ownerId = req.user!.sub;
  const query = paginatedListQuerySchema.parse(req.query);
  const result = await busOwnerService.getOwnerDrivers(ownerId, query);
  res.json(result);
}));

busOwnerRouter.post('/drivers', asyncHandler<AuthRequest>(async (req, res) => {
  const ownerId = req.user!.sub;
  const parsed = parseOrThrow(createDriverSchema, req.body);
  const driver = await busOwnerService.createOwnerDriver(ownerId, parsed);
  res.status(201).json(driver);
}));

busOwnerRouter.get('/drivers/:driverId/scans', asyncHandler<AuthRequest>(async (req, res) => {
  const ownerId = req.user!.sub;
  const query = paginatedListQuerySchema.parse(req.query);
  const result = await busOwnerService.getOwnerDriverScans(
    ownerId,
    req.params.driverId,
    query
  );
  res.json(result);
}));

