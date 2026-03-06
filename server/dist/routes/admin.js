import { Router } from 'express';
import * as adminService from '../modules/admin/adminService.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { createBusOwnerSchema, createStudentSchema, paginatedListQuerySchema, studentListQuerySchema, updateStudentSchema, } from '../modules/admin/adminValidation.js';
import { parseOrThrow } from '../utils/validation.js';
import { uploadStudentImage } from '../middlewares/upload.js';
import { removeStoredStudentImage } from '../utils/studentImage.js';
import { asyncHandler } from '../shared/http/asyncHandler.js';
export const adminRouter = Router();
adminRouter.use(authenticate, requireRole('ADMIN'));
function getUploadedStudentImagePath(filename) {
    return filename ? `students/${filename}` : undefined;
}
function withStudentImageCleanup(handler) {
    return asyncHandler(async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            const imagePath = getUploadedStudentImagePath(req.file?.filename);
            if (imagePath) {
                await removeStoredStudentImage(imagePath).catch(() => undefined);
            }
            throw error;
        }
    });
}
adminRouter.get('/drivers', asyncHandler(async (req, res) => {
    const query = paginatedListQuerySchema.parse(req.query);
    const result = await adminService.getDrivers(query);
    res.json(result);
}));
adminRouter.get('/owners', asyncHandler(async (req, res) => {
    const query = paginatedListQuerySchema.parse(req.query);
    const result = await adminService.getBusOwners(query);
    res.json(result);
}));
adminRouter.get('/students', asyncHandler(async (req, res) => {
    const query = studentListQuerySchema.parse(req.query);
    const result = await adminService.getStudents(query);
    res.json(result);
}));
adminRouter.post('/owners', asyncHandler(async (req, res) => {
    const parsed = parseOrThrow(createBusOwnerSchema, req.body);
    const owner = await adminService.createBusOwner(parsed);
    res.status(201).json(owner);
}));
adminRouter.post('/students', uploadStudentImage.single('image'), withStudentImageCleanup(async (req, res) => {
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
}));
adminRouter.delete('/students/:id', asyncHandler(async (req, res) => {
    await adminService.deleteStudent(req.params.id);
    res.json({ success: true });
}));
adminRouter.patch('/students/:id', uploadStudentImage.single('image'), withStudentImageCleanup(async (req, res) => {
    const parsed = parseOrThrow(updateStudentSchema, req.body);
    const email = typeof parsed.email === 'string' ? parsed.email : undefined;
    const isActive = typeof parsed.isActive === 'boolean' ? parsed.isActive : true;
    const updated = await adminService.updateStudent(req.params.id, {
        studentId: parsed.studentId,
        name: parsed.name,
        email,
        isActive,
        image: req.file
            ? { filePath: `students/${req.file.filename}` }
            : undefined,
    });
    res.json(updated);
}));
