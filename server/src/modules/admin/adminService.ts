import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middlewares/errorHandler.js';
import { sendStudentQrEmail } from '../../utils/mailer.js';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { normalizeStartOfDayUtc } from '../../utils/date.js';
import { config } from '../../config.js';

export async function getDrivers() {
  const now = new Date();
  return prisma.driver.findMany({
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
  }).then((drivers) =>
    drivers.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      bus: d.assignments[0]?.bus ?? null,
    }))
  );
}

export async function getBuses() {
  return prisma.bus.findMany({
    select: {
      id: true,
      plateNumber: true,
      capacity: true,
      owner: { select: { name: true, email: true } },
    },
  });
}

export async function getBusOwners() {
  return prisma.busOwner.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      _count: { select: { buses: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStudents() {
  const today = normalizeStartOfDayUtc(new Date());
  const [students, totalUsageByStudent, todayUsageByStudent] = await Promise.all([
    prisma.student.findMany({
      include: {
        qrCode: { select: { token: true } },
      },
    }),
    prisma.boarding.groupBy({
      by: ['studentId'],
      _count: { _all: true },
    }),
    prisma.boarding.groupBy({
      by: ['studentId'],
      where: { calendarDate: today },
      _count: { _all: true },
    }),
  ]);

  const totalUsageMap = new Map(
    totalUsageByStudent.map((item) => [item.studentId, item._count._all])
  );
  const todayUsageMap = new Map(
    todayUsageByStudent.map((item) => [item.studentId, item._count._all])
  );

  return students.map((s) => ({
    id: s.id,
    studentId: s.studentId,
    name: s.name,
    email: s.email,
    qrToken: s.qrCode?.token ?? null,
    qrUsageCount: todayUsageMap.get(s.id) ?? 0,
    qrUsageTotal: totalUsageMap.get(s.id) ?? 0,
  }));
}

export async function createStudent(data: {
  studentId: string;
  name: string;
  email?: string;
}) {
  const existing = await prisma.student.findUnique({
    where: { studentId: data.studentId },
  });
  if (existing) {
    throw new AppError(
      400,
      ERROR_MESSAGES.studentIdAlreadyExists,
      ERROR_CODES.duplicateStudent
    );
  }

  const student = await prisma.student.create({
    data: {
      studentId: data.studentId,
      name: data.name,
      email: data.email,
    },
  });

  const token = `QR-${randomBytes(16).toString('hex')}`;
  await prisma.qRCode.create({
    data: { token, studentId: student.id },
  });

  const mailRecipient = config.mail.defaultRecipient || student.email;
  if (mailRecipient) {
    try {
      await sendStudentQrEmail({
        to: mailRecipient,
        studentName: student.name,
        studentId: student.studentId,
        qrToken: token,
      });
    } catch (error) {
      console.error('Failed to send student QR email:', error);
    }
  }

  return { ...student, qrToken: token };
}

export async function createBusOwner(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const existing = await prisma.busOwner.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    throw new AppError(
      400,
      ERROR_MESSAGES.busOwnerEmailAlreadyExists,
      ERROR_CODES.duplicateBusOwner
    );
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
