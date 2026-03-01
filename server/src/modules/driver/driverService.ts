import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { isWorkingDayUtc, normalizeStartOfDayUtc } from '../../utils/date.js';

async function getActiveDriverBus(driverId: string) {
  const now = new Date();
  const assignment = await prisma.driverBusAssignment.findFirst({
    where: {
      driverId,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: { bus: true },
    orderBy: { startDate: 'desc' },
  });
  if (!assignment) {
    throw new AppError(
      403,
      ERROR_MESSAGES.driverHasNoActiveBusAssignment,
      ERROR_CODES.noActiveBusAssignment
    );
  }
  return assignment;
}

export async function getDriverProfile(driverId: string) {
  const now = new Date();
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      assignments: {
        where: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
        include: { bus: true },
        orderBy: { startDate: 'desc' },
        take: 1,
      },
    },
  });

  if (!driver) {
    throw new AppError(404, ERROR_MESSAGES.driverNotFound, ERROR_CODES.notFound);
  }

  return {
    id: driver.id,
    name: driver.name,
    email: driver.email,
    bus: driver.assignments[0]?.bus
      ? {
          id: driver.assignments[0].bus.id,
          plateNumber: driver.assignments[0].bus.plateNumber,
        }
      : null,
  };
}

export async function getStudentByQr(driverId: string, qrToken: string) {
  const assignment = await getActiveDriverBus(driverId);
  const qr = await prisma.qRCode.findUnique({
    where: { token: qrToken },
    include: { student: true },
  });

  if (!qr) {
    throw new AppError(404, ERROR_MESSAGES.studentQrNotFound, ERROR_CODES.qrNotFound);
  }

  return {
    student: {
      id: qr.student.id,
      studentId: qr.student.studentId,
      name: qr.student.name,
      email: qr.student.email,
    },
    bus: {
      id: assignment.bus.id,
      plateNumber: assignment.bus.plateNumber,
    },
  };
}

export async function createBoarding(driverId: string, qrToken: string) {
  const assignment = await getActiveDriverBus(driverId);
  const qr = await prisma.qRCode.findUnique({
    where: { token: qrToken },
    include: { student: true },
  });

  if (!qr) {
    throw new AppError(404, ERROR_MESSAGES.studentQrNotFound, ERROR_CODES.qrNotFound);
  }

  const now = new Date();
  if (!isWorkingDayUtc(now)) {
    throw new AppError(400, ERROR_MESSAGES.boardingWorkingDaysOnly, ERROR_CODES.nonWorkingDay);
  }

  const calendarDate = normalizeStartOfDayUtc(now);
  const dailyBoardingsCount = await prisma.boarding.count({
    where: {
      studentId: qr.student.id,
      calendarDate,
    },
  });

  if (dailyBoardingsCount >= 2) {
    throw new AppError(
      409,
      ERROR_MESSAGES.boardingDailyLimitReached,
      ERROR_CODES.dailyBoardingLimitReached
    );
  }

  const boarding = await prisma.boarding.create({
    data: {
      studentId: qr.student.id,
      driverId,
      busId: assignment.bus.id,
      calendarDate,
    },
    select: {
      id: true,
      boardedAt: true,
    },
  });

  return {
    success: true,
    message: `${qr.student.name}-ի մուտքը գրանցվել է`,
    boarding,
    student: {
      studentId: qr.student.studentId,
      name: qr.student.name,
    },
    bus: {
      id: assignment.bus.id,
      plateNumber: assignment.bus.plateNumber,
    },
  };
}
