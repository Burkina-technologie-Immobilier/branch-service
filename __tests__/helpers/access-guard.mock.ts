import { SECURITY_CONTEXT_PORT, SecurityContextPort } from 'src/domain/port/out/security-context.port';
import { AccessGuard } from 'src/domain/service/policies/access.guard';
import { BranchScopePolicy } from 'src/domain/service/policies/branch-scope.policy';
import { PermissionPolicy } from 'src/domain/service/policies/permission.policy';
import { SecurityContext } from 'src/domain/value-objects/security-context.vo';

const permissiveSecurity: SecurityContextPort = {
  get: () => SecurityContext.anonymous(),
};

export function createTestAccessGuard(): AccessGuard {
  return new AccessGuard(permissiveSecurity, new PermissionPolicy(), new BranchScopePolicy());
}

import { EmployeeRolePolicy } from 'src/domain/service/policies/employee-role.policy';

export function createTestEmployeeRolePolicy(): EmployeeRolePolicy {
  return new EmployeeRolePolicy();
}

export { permissiveSecurity, SECURITY_CONTEXT_PORT };
