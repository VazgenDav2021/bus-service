import type { Role } from '../types/domain';

export const APP_ROUTES = {
  login: '/login',
  admin: '/admin',
  driver: '/driver',
  driverScan: '/driver/scan',
  busOwner: '/bus-owner',
  busOwnerAnalytics: '/bus-owner/analytics',
  busOwnerDrivers: '/bus-owner/drivers',
  busOwnerAssignments: '/bus-owner/assignments',
  busOwnerDriversCreate: '/bus-owner/drivers-create',
  busOwnerAssignmentsCreate: '/bus-owner/assignments-create',
  busOwnerBuses: '/bus-owner/buses',
  home: '/',
} as const;

export const ROLE_HOME_ROUTES: Record<Role, string> = {
  ADMIN: APP_ROUTES.admin,
  DRIVER: APP_ROUTES.driver,
  BUS_OWNER: APP_ROUTES.busOwner,
};
