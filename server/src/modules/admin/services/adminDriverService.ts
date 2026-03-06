import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma.js';
import {
  buildPaginationMeta,
  toPrismaPagination,
  type PaginationParams,
} from '../../../utils/pagination.js';

interface AdminListQuery extends Partial<PaginationParams> {
  search?: string;
}

export async function getDrivers(query: AdminListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.DriverWhereInput = query.search
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
      },
    }),
  ]);

  return {
    drivers: drivers.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
    })),
    pagination: buildPaginationMeta(pagination, total),
  };
}
