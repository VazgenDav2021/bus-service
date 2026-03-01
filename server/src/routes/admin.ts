import { Router } from 'express';
import * as adminService from '../modules/admin/adminService.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import {
  createBusOwnerSchema,
  createStudentSchema,
  paginatedListQuerySchema,
  studentListQuerySchema,
  updateStudentSchema,
} from '../modules/admin/adminValidation.js';
import { parseOrThrow } from '../utils/validation.js';
import { uploadStudentImage } from '../middlewares/upload.js';
import { removeStoredStudentImage } from '../utils/studentImage.js';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/drivers', async (req, res, next) => {
  try {
    const query = paginatedListQuerySchema.parse(req.query);
    const result = await adminService.getDrivers(query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/buses', async (req, res, next) => {
  try {
    const query = paginatedListQuerySchema.parse(req.query);
    const result = await adminService.getBuses(query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/owners', async (req, res, next) => {
  try {
    const query = paginatedListQuerySchema.parse(req.query);
    const result = await adminService.getBusOwners(query);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

adminRouter.get('/students', async (req, res, next) => {
  try {
    const query = studentListQuerySchema.parse(req.query);
    const result = await adminService.getStudents(query);
    res.json(result);
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

adminRouter.post('/students', uploadStudentImage.single('image'), async (req, res, next) => {
  try {
    const parsed = parseOrThrow(createStudentSchema, req.body);
    const email = typeof parsed.email === 'string' ? parsed.email : undefined;
    const isActive = typeof parsed.isActive === 'boolean' ? parsed.isActive : true;
    const student = await adminService.createStudent({
      name: parsed.name,
      email,
      isActive,
      image: req.file
        ? { filePath: `students/${req.file.filename}` }
        : undefined,
    });
    res.status(201).json(student);
  } catch (e) {
    if (req.file) {
      await removeStoredStudentImage(`students/${req.file.filename}`).catch(() => undefined);
    }
    next(e);
  }
});

adminRouter.delete('/students/:id', async (req, res, next) => {
  try {
    await adminService.deleteStudent(req.params.id);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

adminRouter.patch('/students/:id', uploadStudentImage.single('image'), async (req, res, next) => {
  try {
    const parsed = parseOrThrow(updateStudentSchema, req.body);
    const email = typeof parsed.email === 'string' ? parsed.email : undefined;
    const isActive = typeof parsed.isActive === 'boolean' ? parsed.isActive : true;
    const updated = await adminService.updateStudent(req.params.id, {
      name: parsed.name,
      email,
      isActive,
      image: req.file
        ? { filePath: `students/${req.file.filename}` }
        : undefined,
    });
    res.json(updated);
  } catch (e) {
    if (req.file) {
      await removeStoredStudentImage(`students/${req.file.filename}`).catch(() => undefined);
    }
    next(e);
  }
});
