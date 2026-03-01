import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../../middlewares/errorHandler.js';
import { Prisma } from '@prisma/client';
import { ERROR_CODES } from '../../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { normalizeEndOfDayUtc, normalizeStartOfDayUtc } from '../../utils/date.js';
import {
  buildPaginationMeta,
  toPrismaPagination,
  type PaginationParams,
} from '../../utils/pagination.js';

interface OwnerListQuery extends Partial<PaginationParams> {
  search?: string;
}

export async function getBusOwnerStats(ownerId: string, _from?: Date, _to?: Date) {
  const [buses, drivers] = await Promise.all([
    prisma.bus.count({ where: { ownerId } }),
    prisma.driver.count({ where: { ownerId } }),
  ]);

  return {
    buses,
    drivers,
  };
}

export async function getOwnerBuses(ownerId: string, query: OwnerListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.BusWhereInput = {
    ownerId,
    ...(query.search
      ? {
          OR: [{ plateNumber: { contains: query.search, mode: 'insensitive' } }],
        }
      : {}),
  };
  const { skip, take } = toPrismaPagination(pagination);
  const [total, buses] = await Promise.all([
    prisma.bus.count({ where }),
    prisma.bus.findMany({
      where,
      skip,
      take,
      select: { id: true, plateNumber: true, capacity: true },
      orderBy: { plateNumber: 'asc' },
    }),
  ]);

  return {
    buses,
    pagination: buildPaginationMeta(pagination, total),
  };
}

export async function createOwnerBus(
  ownerId: string,
  data: { plateNumber: string; capacity: number }
) {
  const existing = await prisma.bus.findUnique({
    where: { plateNumber: data.plateNumber },
    select: { id: true },
  });
  if (existing) {
    throw new AppError(400, ERROR_MESSAGES.busPlateAlreadyExists, ERROR_CODES.duplicateBus);
  }

  return prisma.bus.create({
    data: {
      plateNumber: data.plateNumber,
      capacity: data.capacity,
      ownerId,
    },
    select: {
      id: true,
      plateNumber: true,
      capacity: true,
      createdAt: true,
    },
  });
}

export async function getOwnerDrivers(ownerId: string, query: OwnerListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const now = new Date();
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
        assignments: {
          where: {
            startDate: { lte: now },
            endDate: { gte: now },
          },
          select: {
            bus: { select: { id: true, plateNumber: true } },
            startDate: true,
            endDate: true,
          },
          orderBy: { startDate: 'desc' },
          take: 1,
        },
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
      bus: d.assignments[0]?.bus ?? null,
      activeAssignment: d.assignments[0]
        ? {
            startDate: d.assignments[0].startDate.toISOString(),
            endDate: d.assignments[0].endDate.toISOString(),
          }
        : null,
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

export async function getOwnerAssignments(ownerId: string, query: OwnerListQuery) {
  const pagination: PaginationParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  const where: Prisma.DriverBusAssignmentWhereInput = {
    bus: { ownerId },
    ...(query.search
      ? {
          OR: [
            { driver: { name: { contains: query.search, mode: 'insensitive' } } },
            { driver: { email: { contains: query.search, mode: 'insensitive' } } },
            { bus: { plateNumber: { contains: query.search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };
  const { skip, take } = toPrismaPagination(pagination);
  const [total, assignments] = await Promise.all([
    prisma.driverBusAssignment.count({ where }),
    prisma.driverBusAssignment.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        driver: { select: { id: true, name: true, email: true } },
        bus: { select: { id: true, plateNumber: true } },
      },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  return {
    assignments,
    pagination: buildPaginationMeta(pagination, total),
  };
}

export async function createOwnerAssignment(
  ownerId: string,
  data: { driverId: string; busId: string; startDate: Date; endDate: Date }
) {
  const startDate = normalizeStartOfDayUtc(data.startDate);
  const endDate = normalizeEndOfDayUtc(data.endDate);
  if (endDate < startDate) {
    throw new AppError(
      400,
      ERROR_MESSAGES.endDateMustBeAfterStartDate,
      ERROR_CODES.invalidDateRange
    );
  }

  const [driver, bus] = await Promise.all([
    prisma.driver.findFirst({
      where: { id: data.driverId, ownerId },
      select: { id: true },
    }),
    prisma.bus.findFirst({
      where: { id: data.busId, ownerId },
      select: { id: true, plateNumber: true },
    }),
  ]);

  if (!driver) {
    throw new AppError(403, ERROR_MESSAGES.driverNotOwnedByYou, ERROR_CODES.driverForbidden);
  }
  if (!bus) {
    throw new AppError(403, ERROR_MESSAGES.busNotOwnedByYou, ERROR_CODES.busForbidden);
  }

  const overlap = await prisma.driverBusAssignment.findFirst({
    where: {
      driverId: data.driverId,
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
    select: { id: true },
  });

  if (overlap) {
    throw new AppError(
      400,
      ERROR_MESSAGES.assignmentOverlap,
      ERROR_CODES.assignmentOverlap
    );
  }

  return prisma.driverBusAssignment.create({
    data: {
      driverId: data.driverId,
      busId: data.busId,
      startDate,
      endDate,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      driver: { select: { id: true, name: true, email: true } },
      bus: { select: { id: true, plateNumber: true } },
    },
  });
}
