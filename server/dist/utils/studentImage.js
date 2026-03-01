import { unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
export const STUDENT_UPLOADS_DIR = path.join(UPLOADS_DIR, 'students');
export const STUDENT_IMAGE_SIZE_PX = 176;
export function getStudentImagePublicUrl(filePath) {
    return `/uploads/${filePath.replace(/\\/g, '/')}`;
}
export async function removeStoredStudentImage(filePath) {
    const absolutePath = path.join(UPLOADS_DIR, filePath);
    try {
        await unlink(absolutePath);
    }
    catch (error) {
        const err = error;
        if (err.code !== 'ENOENT') {
            throw error;
        }
    }
}
export async function standardizeStudentImage(filePath) {
    const absolutePath = path.join(UPLOADS_DIR, filePath);
    const resizedBuffer = await sharp(absolutePath)
        .resize(STUDENT_IMAGE_SIZE_PX, STUDENT_IMAGE_SIZE_PX, {
        fit: 'cover',
        position: 'centre',
    })
        .toBuffer();
    await writeFile(absolutePath, resizedBuffer);
}
