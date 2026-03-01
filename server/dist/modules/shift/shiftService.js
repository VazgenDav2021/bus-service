import { prisma } from '../../lib/prisma.js';
import { config } from '../../config.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middlewares/errorHandler.js';
export async function startShift(input) {
    const now = new Date();
    if (input.endTime <= now) {
        throw new AppError(400, 'End time must be in the future', 'INVALID_END_TIME');
    }
    if (input.endTime <= input.startTime) {
        throw new AppError(400, 'End time must be after start time', 'INVALID_END_TIME');
    }
    const driver = await prisma.driver.findUnique({
        where: { id: input.driverId },
        include: { bus: true },
    });
    if (!driver) {
        throw new AppError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }
    if (driver.busId !== input.busId) {
        throw new AppError(403, 'Driver not assigned to this bus', 'BUS_MISMATCH');
    }
    const overlappingShift = await prisma.driverShift.findFirst({
        where: {
            driverId: input.driverId,
            endTime: { gt: now },
        },
    });
    if (overlappingShift) {
        throw new AppError(400, 'Active shift already exists', 'SHIFT_ALREADY_ACTIVE');
    }
    const shift = await prisma.driverShift.create({
        data: {
            driverId: input.driverId,
            busId: input.busId,
            startTime: input.startTime,
            endTime: input.endTime,
        },
        include: { bus: true },
    });
    const nowSeconds = Math.floor(Date.now() / 1000);
    const shiftEndSeconds = Math.floor(shift.endTime.getTime() / 1000);
    const accessExpirySeconds = Math.max(60, shiftEndSeconds - nowSeconds);
    const accessToken = jwt.sign({
        sub: input.driverId,
        role: 'DRIVER',
        shiftId: shift.id,
        shiftEndTime: shift.endTime.toISOString(),
    }, config.jwt.accessSecret, { expiresIn: accessExpirySeconds });
    const remainingShiftSeconds = shiftEndSeconds - nowSeconds;
    const refreshExpiry = Math.max(60, Math.min(remainingShiftSeconds, 7 * 24 * 60 * 60));
    const refreshToken = jwt.sign({
        sub: input.driverId,
        role: 'DRIVER',
        type: 'refresh',
        shiftId: shift.id,
        shiftEndTime: shift.endTime.toISOString(),
    }, config.jwt.refreshSecret, { expiresIn: refreshExpiry });
    const tokenExpiry = shift.endTime;
    const decoded = jwt.decode(accessToken);
    const accessExpiry = decoded?.exp
        ? new Date(decoded.exp * 1000)
        : new Date(Date.now() + 15 * 60 * 1000);
    const effectiveExpiry = tokenExpiry < accessExpiry ? tokenExpiry : accessExpiry;
    return {
        shift: {
            id: shift.id,
            startTime: shift.startTime.toISOString(),
            endTime: shift.endTime.toISOString(),
            bus: shift.bus,
        },
        accessToken,
        refreshToken,
        expiresAt: effectiveExpiry.toISOString(),
    };
}
export async function getDriverShifts(driverId, from, to) {
    const where = {
        driverId,
    };
    if (from || to) {
        where.startTime = {};
        if (from)
            where.startTime.gte = from;
        if (to)
            where.startTime.lte = to;
    }
    const shifts = await prisma.driverShift.findMany({
        where,
        include: { bus: true },
        orderBy: { startTime: 'desc' },
    });
    return shifts.map((s) => ({
        id: s.id,
        startTime: s.startTime.toISOString(),
        endTime: s.endTime.toISOString(),
        bus: s.bus,
    }));
}
