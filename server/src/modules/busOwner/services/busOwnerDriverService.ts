import bcrypt from 'bcryptjs';
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

export async function getOwnerDrivers(ownerId: string, query: OwnerListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.DriverWhereInput = {
    ownerId,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { phone: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
  const { skip, take } = toPrismaPagination(pagination);
  const [total, drivers] = await Promise.all([
    prisma.driver.count({ where }),
    prisma.driver.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    drivers: drivers.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      createdAt: d.createdAt,
    })),
    pagination: buildPaginationMeta(pagination, total),
  };
}

export async function createOwnerDriver(
  ownerId: string,
  data: { name: string; email: string; phone?: string; password: string }
) {
  const existing = await prisma.driver.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError(400, ERROR_MESSAGES.driverEmailAlreadyExists, ERROR_CODES.duplicateDriver);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  return prisma.driver.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      ownerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });
}
