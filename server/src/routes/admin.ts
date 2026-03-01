import { Router } from 'express';
import * as adminService from '../modules/admin/adminService.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import {
  createBusOwnerSchema,
  createStudentSchema,
} from '../modules/admin/adminValidation.js';
import { parseOrThrow } from '../utils/validation.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/drivers', async (_req, res, next) => {
  try {
    const drivers = await adminService.getDrivers();
    res.json({ drivers });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/buses', async (_req, res, next) => {
  try {
    const buses = await adminService.getBuses();
    res.json({ buses });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/owners', async (_req, res, next) => {
  try {
    const owners = await adminService.getBusOwners();
    res.json({ owners });
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/students', async (_req, res, next) => {
  try {
    const students = await adminService.getStudents();
    res.json({ students });
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/owners', async (req, res, next) => {
  try {
    const parsed = parseOrThrow(createBusOwnerSchema, req.body);
    const owner = await adminService.createBusOwner(parsed);
    res.status(201).json(owner);
  } catch (e) {
    next(e);
  }
});

adminRouter.post('/students', async (req, res, next) => {
  try {
    const parsed = parseOrThrow(createStudentSchema, req.body);
    const student = await adminService.createStudent(parsed);
    res.status(201).json(student);
  } catch (e) {
    next(e);
  }
});
