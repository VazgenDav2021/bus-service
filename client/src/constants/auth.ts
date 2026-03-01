import type { Role } from '../types/domain';

export const APP_ROLES: Role[] = ['DRIVER', 'ADMIN', 'BUS_OWNER'];

export const ROLE_EMAILS: Record<Role, string[]> = {
  DRIVER: ['driver@bustransport.com'],
  ADMIN: ['admin@municipality.gov'],
  BUS_OWNER: ['owner@bustransport.com'],
};

export const DEFAULT_PASSWORD = 'Admin123!';

export function isRole(value: string | null): value is Role {
  return !!value && APP_ROLES.includes(value as Role);
}
