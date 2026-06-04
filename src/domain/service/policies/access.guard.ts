import type { MeublezonePermission } from 'src/domain/enums/meublezone-permission.enum';
import { SecurityContextPort } from 'src/domain/port/out/security-context.port';
import { BranchScopePolicy } from './branch-scope.policy';
import { PermissionPolicy } from './permission.policy';

export interface AccessCheckOptions {
  permission: MeublezonePermission;
  branchId?: string | null;
  siegeOnly?: boolean;
}

export class AccessGuard {
  constructor(
    private readonly securityContext: SecurityContextPort,
    private readonly permissionPolicy: PermissionPolicy,
    private readonly branchScopePolicy: BranchScopePolicy,
  ) {}

  check(options: AccessCheckOptions): void {
    const ctx = this.securityContext.get();
    if (options.siegeOnly) {
      this.permissionPolicy.assertSiegeOnly(ctx);
    }
    this.permissionPolicy.assert(ctx, options.permission);
    this.branchScopePolicy.assertBranchAccess(ctx, options.branchId);
  }

  resolveBranchFilter(requestedBranchId?: string): string | undefined {
    return this.branchScopePolicy.resolveBranchFilter(
      this.securityContext.get(),
      requestedBranchId,
    );
  }
}
