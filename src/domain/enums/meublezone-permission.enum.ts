/** Permissions alignées sur user_role_service (Service globaux). */
export const MeublezonePermission = {
  BRANCH_READ: 'branch:read',
  BRANCH_WRITE: 'branch:write',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_WRITE: 'employee:write',
} as const;

export type MeublezonePermission =
  (typeof MeublezonePermission)[keyof typeof MeublezonePermission];
