import { Global, Module } from '@nestjs/common';
import { SECURITY_CONTEXT_PORT } from 'src/domain/port/out/security-context.port';
import { AccessGuard } from 'src/domain/service/policies/access.guard';
import { BranchScopePolicy } from 'src/domain/service/policies/branch-scope.policy';
import { EmployeeRolePolicy } from 'src/domain/service/policies/employee-role.policy';
import { PermissionPolicy } from 'src/domain/service/policies/permission.policy';
import { RequestSecurityContextAdapter } from './request-security-context.adapter';

@Global()
@Module({
  providers: [
    RequestSecurityContextAdapter,
    { provide: SECURITY_CONTEXT_PORT, useExisting: RequestSecurityContextAdapter },
    PermissionPolicy,
    BranchScopePolicy,
    EmployeeRolePolicy,
    {
      provide: AccessGuard,
      useFactory: (
        security: RequestSecurityContextAdapter,
        permission: PermissionPolicy,
        branchScope: BranchScopePolicy,
      ) => new AccessGuard(security, permission, branchScope),
      inject: [RequestSecurityContextAdapter, PermissionPolicy, BranchScopePolicy],
    },
  ],
  exports: [
    SECURITY_CONTEXT_PORT,
    AccessGuard,
    PermissionPolicy,
    BranchScopePolicy,
    EmployeeRolePolicy,
  ],
})
export class SecurityModule {}
