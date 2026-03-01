import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { sendStudentQrEmail } from '../../utils/mailer.js';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { normalizeStartOfDayUtc } from '../../utils/date.js';
import { config } from '../../config.js';
import { getStudentImagePublicUrl, removeStoredStudentImage, standardizeStudentImage, } from '../../utils/studentImage.js';
import { buildPaginationMeta, toPrismaPagination, } from '../../utils/pagination.js';
export async function getDrivers(query) {
    const pagination = {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
    };
    const now = new Date();
    const where = query.search
        ? {
            OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
            ],
        }
        : {};
    const { skip, take } = toPrismaPagination(pagination);
    const [total, drivers] = await Promise.all([
        prisma.driver.count({ where }),
        prisma.driver.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                assignments: {
                    where: {
                        startDate: { lte: now },
                        endDate: { gte: now },
                    },
                    select: { bus: { select: { plateNumber: true } } },
                    orderBy: { startDate: 'desc' },
                    take: 1,
                },
            },
        }),
    ]);
    return {
        drivers: drivers.map((d) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            bus: d.assignments[0]?.bus ?? null,
        })),
        pagination: buildPaginationMeta(pagination, total),
    };
}
export async function getBuses(query) {
    const pagination = {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
    };
    const where = query.search
        ? {
            OR: [
                { plateNumber: { contains: query.search, mode: 'insensitive' } },
                { owner: { name: { contains: query.search, mode: 'insensitive' } } },
                { owner: { email: { contains: query.search, mode: 'insensitive' } } },
            ],
        }
        : {};
    const { skip, take } = toPrismaPagination(pagination);
    const [total, buses] = await Promise.all([
        prisma.bus.count({ where }),
        prisma.bus.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                plateNumber: true,
                capacity: true,
                owner: { select: { name: true, email: true } },
            },
        }),
    ]);
    return {
        buses,
        pagination: buildPaginationMeta(pagination, total),
    };
}
export async function getBusOwners(query) {
    const pagination = {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
    };
    const where = query.search
        ? {
            OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
            ],
        }
        : {};
    const { skip, take } = toPrismaPagination(pagination);
    const [total, owners] = await Promise.all([
        prisma.busOwner.count({ where }),
        prisma.busOwner.findMany({
            where,
            skip,
            take,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                _count: { select: { buses: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ]);
    return {
        owners,
        pagination: buildPaginationMeta(pagination, total),
    };
}
export async function getStudents(query) {
    const pagination = {
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
    };
    const where = {
        ...(typeof query.isActive === 'boolean' ? { isActive: query.isActive } : {}),
        ...(query.search
            ? {
                OR: [
                    { studentId: { contains: query.search, mode: 'insensitive' } },
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { email: { contains: query.search, mode: 'insensitive' } },
                ],
            }
            : {}),
    };
    const { skip, take } = toPrismaPagination(pagination);
    const today = normalizeStartOfDayUtc(new Date());
    const [total, students] = await Promise.all([
        prisma.student.count({ where }),
        prisma.student.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                qrCode: { select: { token: true } },
                image: { select: { filePath: true } },
            },
        }),
    ]);
    const studentIds = students.map((s) => s.id);
    const [totalUsageByStudent, todayUsageByStudent] = await Promise.all([
        prisma.boarding.groupBy({
            by: ['studentId'],
            where: { studentId: { in: studentIds } },
            _count: { _all: true },
        }),
        prisma.boarding.groupBy({
            by: ['studentId'],
            where: { studentId: { in: studentIds }, calendarDate: today },
            _count: { _all: true },
        }),
    ]);
    const totalUsageMap = new Map(totalUsageByStudent.map((item) => [item.studentId, item._count._all]));
    const todayUsageMap = new Map(todayUsageByStudent.map((item) => [item.studentId, item._count._all]));
    return {
        students: students.map((s) => ({
            id: s.id,
            studentId: s.studentId,
            name: s.name,
            email: s.email,
            isActive: s.isActive,
            imageUrl: s.image ? getStudentImagePublicUrl(s.image.filePath) : null,
            qrToken: s.qrCode?.token ?? null,
            qrUsageCount: todayUsageMap.get(s.id) ?? 0,
            qrUsageTotal: totalUsageMap.get(s.id) ?? 0,
        })),
        pagination: buildPaginationMeta(pagination, total),
    };
}
export async function createStudent(data) {
    const MAX_CREATE_RETRIES = 5;
    async function getNextStudentId() {
        const students = await prisma.student.findMany({
            select: { studentId: true },
        });
        const maxIndex = students.reduce((max, student) => {
            const match = /^SU-(\d+)$/.exec(student.studentId);
            if (!match) {
                return max;
            }
            const parsed = Number.parseInt(match[1], 10);
            return Number.isNaN(parsed) ? max : Math.max(max, parsed);
        }, 0);
        return `SU-${String(maxIndex + 1).padStart(4, '0')}`;
    }
    let student = null;
    for (let attempt = 0; attempt < MAX_CREATE_RETRIES; attempt += 1) {
        const generatedStudentId = await getNextStudentId();
        try {
            student = await prisma.student.create({
                data: {
                    studentId: generatedStudentId,
                    name: data.name,
                    email: data.email,
                    isActive: data.isActive,
                },
            });
            break;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                continue;
            }
            throw error;
        }
    }
    if (!student) {
        throw new AppError(409, ERROR_MESSAGES.studentIdAlreadyExists, ERROR_CODES.duplicateStudent);
    }
    const token = `QR-${randomBytes(16).toString('hex')}`;
    await prisma.qRCode.create({
        data: { token, studentId: student.id },
    });
    if (data.image) {
        await standardizeStudentImage(data.image.filePath);
        await prisma.studentImage.create({
            data: {
                studentId: student.id,
                filePath: data.image.filePath,
            },
        });
    }
    const mailRecipient = config.mail.defaultRecipient || student.email;
    if (mailRecipient) {
        try {
            await sendStudentQrEmail({
                to: mailRecipient,
                studentName: student.name,
                studentId: student.studentId,
                qrToken: token,
            });
        }
        catch (error) {
            console.error('Failed to send student QR email:', error);
        }
    }
    return {
        ...student,
        qrToken: token,
        imageUrl: data.image ? getStudentImagePublicUrl(data.image.filePath) : null,
    };
}
export async function deleteStudent(studentId) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { image: { select: { filePath: true } } },
    });
    if (!student) {
        throw new AppError(404, ERROR_MESSAGES.studentNotFound, ERROR_CODES.notFound);
    }
    await prisma.student.delete({
        where: { id: studentId },
    });
    if (student.image?.filePath) {
        await removeStoredStudentImage(student.image.filePath);
    }
}
export async function updateStudent(studentId, data) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { image: { select: { filePath: true } } },
    });
    if (!student) {
        throw new AppError(404, ERROR_MESSAGES.studentNotFound, ERROR_CODES.notFound);
    }
    if (data.image) {
        await standardizeStudentImage(data.image.filePath);
    }
    const updated = await prisma.student.update({
        where: { id: studentId },
        data: {
            name: data.name,
            email: data.email,
            isActive: data.isActive,
        },
    });
    if (data.image) {
        await prisma.studentImage.upsert({
            where: { studentId },
            update: { filePath: data.image.filePath },
            create: {
                studentId,
                filePath: data.image.filePath,
            },
        });
        if (student.image?.filePath) {
            await removeStoredStudentImage(student.image.filePath);
        }
    }
    return {
        ...updated,
        imageUrl: data.image
            ? getStudentImagePublicUrl(data.image.filePath)
            : student.image
                ? getStudentImagePublicUrl(student.image.filePath)
                : null,
    };
}
export async function createBusOwner(data) {
    const existing = await prisma.busOwner.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        throw new AppError(400, ERROR_MESSAGES.busOwnerEmailAlreadyExists, ERROR_CODES.duplicateBusOwner);
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const owner = await prisma.busOwner.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
        },
    });
    return owner;
}
