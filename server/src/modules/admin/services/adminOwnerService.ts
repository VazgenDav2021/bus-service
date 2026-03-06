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

interface AdminListQuery extends Partial<PaginationParams> {
  search?: string;
}

export async function getBusOwners(query: AdminListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.BusOwnerWhereInput = query.search
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
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    owners,
    pagination: buildPaginationMeta(pagination, total),
  };
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
