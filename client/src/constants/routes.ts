import type { Role } from '../types/domain';

export const APP_ROUTES = {
  login: '/login',
  admin: '/admin',
  driver: '/driver',
  driverScan: '/driver/scan',
  busOwner: '/bus-owner',
  home: '/',
} as const;

export const ROLE_HOME_ROUTES: Record<Role, string> = {
  ADMIN: APP_ROUTES.admin,
  DRIVER: APP_ROUTES.driver,
  BUS_OWNER: APP_ROUTES.busOwner,
};
