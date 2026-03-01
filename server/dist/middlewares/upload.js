import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import multer from 'multer';
import { STUDENT_UPLOADS_DIR } from '../utils/studentImage.js';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        mkdirSync(STUDENT_UPLOADS_DIR, { recursive: true });
        cb(null, STUDENT_UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
        cb(null, `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`);
    },
});
function imageFileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Անվավեր ֆայլի տիպ։ Թույլատրվում են միայն նկարներ։'));
        return;
    }
    cb(null, true);
}
export const uploadStudentImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
});
