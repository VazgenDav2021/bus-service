import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import { AppError } from '../../../middlewares/errorHandler.js';
import { sendStudentQrEmail } from '../../../utils/mailer.js';
import { ERROR_CODES } from '../../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../../constants/errorMessages.js';
import { config } from '../../../config.js';
import {
  getStudentImagePublicUrl,
  removeStoredStudentImage,
  standardizeStudentImage,
} from '../../../utils/studentImage.js';
import {
  buildPaginationMeta,
  toPrismaPagination,
  type PaginationParams,
} from '../../../utils/pagination.js';

interface AdminListQuery extends Partial<PaginationParams> {
  search?: string;
}

export async function getStudents(
  query: AdminListQuery & {
    isActive?: boolean;
  }
) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.StudentWhereInput = {
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

  return {
    students: students.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      imageUrl: s.image ? getStudentImagePublicUrl(s.image.filePath) : null,
      qrToken: s.qrCode?.token ?? null,
    })),
    pagination: buildPaginationMeta(pagination, total),
  };
}

export async function createStudent(data: {
  name: string;
  email?: string;
  isActive: boolean;
  image?: {
    filePath: string;
  };
}) {
  const MAX_CREATE_RETRIES = 5;

  async function getNextStudentId(): Promise<string> {
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

  let student: Awaited<ReturnType<typeof prisma.student.create>> | null = null;
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        continue;
      }
      throw error;
    }
  }

  if (!student) {
    throw new AppError(
      409,
      ERROR_MESSAGES.studentIdAlreadyExists,
      ERROR_CODES.duplicateStudent
    );
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
    } catch (error) {
      console.error('Failed to send student QR email:', error);
    }
  }

  return {
    ...student,
    qrToken: token,
    imageUrl: data.image ? getStudentImagePublicUrl(data.image.filePath) : null,
  };
}

export async function deleteStudent(studentId: string) {
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

export async function updateStudent(
  studentId: string,
  data: {
    studentId: string;
    name: string;
    email?: string;
    isActive: boolean;
    image?: {
      filePath: string;
    };
  }
) {
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

  let updated: Awaited<ReturnType<typeof prisma.student.update>>;
  try {
    updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        studentId: data.studentId,
        name: data.name,
        email: data.email,
        isActive: data.isActive,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError(
        409,
        ERROR_MESSAGES.studentIdAlreadyExists,
        ERROR_CODES.duplicateStudent
      );
    }
    throw error;
  }

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
