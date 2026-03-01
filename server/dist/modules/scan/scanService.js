import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/errorHandler.js';
function getCalendarDateUtc(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
export async function createTripFromContext(input) {
    const calendarDate = getCalendarDateUtc(new Date());
    return await prisma.$transaction(async (tx) => {
        const qrCode = await tx.qRCode.findUnique({
            where: { token: input.qrToken },
            include: {
                student: {
                    include: {
                        trips: {
                            where: { calendarDate },
                            select: { direction: true },
                        },
                    },
                },
            },
        });
        if (!qrCode) {
            throw new AppError(404, 'Invalid QR code', 'INVALID_QR');
        }
        const student = qrCode.student;
        const existingTrips = student.trips;
        const hasToUni = existingTrips.some((t) => t.direction === 'TO');
        const hasFromUni = existingTrips.some((t) => t.direction === 'FROM');
        if (input.direction === 'TO' && hasToUni) {
            throw new AppError(400, 'Daily limit reached for this direction', 'LIMIT_REACHED');
        }
        if (input.direction === 'FROM' && hasFromUni) {
            throw new AppError(400, 'Daily limit reached for this direction', 'LIMIT_REACHED');
        }
        await tx.trip.create({
            data: {
                studentId: student.id,
                driverId: input.driverId,
                busId: input.busId,
                shiftId: input.shiftId,
                direction: input.direction,
                calendarDate,
            },
        });
        const newToUni = input.direction === 'TO' || hasToUni;
        const newFromUni = input.direction === 'FROM' || hasFromUni;
        const remainingTrips = 2 - (newToUni ? 1 : 0) - (newFromUni ? 1 : 0);
        return {
            success: true,
            studentName: student.name,
            direction: input.direction,
            remainingTrips,
            message: `Trip recorded: ${student.name} - ${input.direction.replace('_', ' ')}`,
        };
    }, {
        isolationLevel: 'Serializable',
    });
}
export async function createTripFromStudentId(input) {
    const calendarDate = getCalendarDateUtc(new Date());
    return await prisma.$transaction(async (tx) => {
        const student = await tx.student.findUnique({
            where: { studentId: input.studentId },
            include: {
                trips: {
                    where: { calendarDate },
                    select: { direction: true },
                },
            },
        });
        if (!student) {
            throw new AppError(404, 'Student not found', 'STUDENT_NOT_FOUND');
        }
        const existingTrips = student.trips;
        const hasToUni = existingTrips.some((t) => t.direction === 'TO');
        const hasFromUni = existingTrips.some((t) => t.direction === 'FROM');
        if (input.direction === 'TO' && hasToUni) {
            throw new AppError(400, 'Daily limit reached for this direction', 'LIMIT_REACHED');
        }
        if (input.direction === 'FROM' && hasFromUni) {
            throw new AppError(400, 'Daily limit reached for this direction', 'LIMIT_REACHED');
        }
        await tx.trip.create({
            data: {
                studentId: student.id,
                driverId: input.driverId,
                busId: input.busId,
                shiftId: input.shiftId,
                direction: input.direction,
                calendarDate,
            },
        });
        const newToUni = input.direction === 'TO' || hasToUni;
        const newFromUni = input.direction === 'FROM' || hasFromUni;
        const remainingTrips = 2 - (newToUni ? 1 : 0) - (newFromUni ? 1 : 0);
        return {
            success: true,
            studentName: student.name,
            direction: input.direction,
            remainingTrips,
            message: `Trip recorded: ${student.name} - ${input.direction}`,
        };
    }, {
        isolationLevel: 'Serializable',
    });
}
export async function processScan(input) {
    const result = await createTripFromContext(input);
    return {
        ...result,
        message: result.message.replace('Trip recorded', 'Scan recorded'),
    };
}
