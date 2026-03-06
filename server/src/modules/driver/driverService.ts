import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { normalizeStartOfDayUtc } from '../../utils/date.js';
import { getStudentImagePublicUrl } from '../../utils/studentImage.js';

export async function getDriverProfile(driverId: string) {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!driver) {
    throw new AppError(404, ERROR_MESSAGES.driverNotFound, ERROR_CODES.notFound);
  }

  return driver;
}

async function getDriverBus(driverId: string) {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    select: { ownerId: true },
  });
  if (!driver) {
    throw new AppError(404, ERROR_MESSAGES.driverNotFound, ERROR_CODES.notFound);
  }
  if (!driver.ownerId) {
    throw new AppError(403, ERROR_MESSAGES.driverHasNoAssignedBus, ERROR_CODES.noAssignedBus);
  }

  const bus = await prisma.bus.findFirst({
    where: { ownerId: driver.ownerId },
    select: { id: true, plateNumber: true },
    orderBy: { createdAt: 'asc' },
  });
  if (!bus) {
    throw new AppError(403, ERROR_MESSAGES.driverHasNoAssignedBus, ERROR_CODES.noAssignedBus);
  }
  return bus;
}

export async function getStudentByQr(driverId: string, qrToken: string) {
  const bus = await getDriverBus(driverId);
  const qr = await prisma.qRCode.findUnique({
    where: { token: qrToken },
    include: { student: { include: { image: true } } },
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
      imageUrl: qr.student.image ? getStudentImagePublicUrl(qr.student.image.filePath) : null,
    },
    bus,
  };
}

export async function createBoarding(driverId: string, qrToken: string) {
  const bus = await getDriverBus(driverId);
  const qr = await prisma.qRCode.findUnique({
    where: { token: qrToken },
    include: { student: true },
  });

  if (!qr) {
    throw new AppError(404, ERROR_MESSAGES.studentQrNotFound, ERROR_CODES.qrNotFound);
  }

  const calendarDate = normalizeStartOfDayUtc(new Date());
  const boarding = await prisma.boarding.create({
    data: {
      studentId: qr.student.id,
      driverId,
      busId: bus.id,
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
    bus,
  };
}
