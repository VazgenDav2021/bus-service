import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import { AppError } from '../../../middlewares/errorHandler.js';
import { ERROR_CODES } from '../../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../../constants/errorMessages.js';
import {
  buildPaginationMeta,
  toPrismaPagination,
  type PaginationParams,
} from '../../../utils/pagination.js';

interface OwnerListQuery extends Partial<PaginationParams> {
  search?: string;
}

export async function getOwnerDriverScans(
  ownerId: string,
  driverId: string,
  query: OwnerListQuery
) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };

  const driver = await prisma.driver.findFirst({
    where: { id: driverId, ownerId },
    select: { id: true, name: true, email: true, phone: true },
  });

  if (!driver) {
    throw new AppError(404, ERROR_MESSAGES.driverNotFound, ERROR_CODES.notFound);
  }

  const where: Prisma.BoardingWhereInput = {
    driverId,
    ...(query.search
      ? {
          OR: [
            { student: { name: { contains: query.search, mode: 'insensitive' } } },
            { student: { studentId: { contains: query.search, mode: 'insensitive' } } },
            { student: { email: { contains: query.search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  const { skip, take } = toPrismaPagination(pagination);
  const [total, scans] = await Promise.all([
    prisma.boarding.count({ where }),
    prisma.boarding.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        boardedAt: true,
        student: {
          select: {
            id: true,
            studentId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { boardedAt: 'desc' },
    }),
  ]);

  return {
    driver,
    scans: scans.map((scan) => ({
      id: scan.id,
      scannedAt: scan.boardedAt.toISOString(),
      student: scan.student,
    })),
    pagination: buildPaginationMeta(pagination, total),
  };
}
