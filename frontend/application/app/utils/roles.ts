export type AdministrativeRole = 'ADMIN' | 'SUPERADMIN';

export function isAdministrativeRole(role: string | undefined): role is AdministrativeRole {
  return role === 'ADMIN' || role === 'SUPERADMIN';
}
