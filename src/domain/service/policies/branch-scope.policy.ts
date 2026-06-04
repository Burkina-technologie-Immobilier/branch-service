import { BusinessError } from 'src/domain/errors/business.error';
import { CodesError } from 'src/domain/errors/codes.error';
import { SecurityContext } from 'src/domain/value-objects/security-context.vo';

export class BranchScopePolicy {
  assertBranchAccess(ctx: SecurityContext, branchId?: string | null): void {
    if (!ctx.enforcePolicies || !branchId) {
      return;
    }
    if (ctx.isSiege()) {
      return;
    }
    if (ctx.branchId && ctx.branchId === branchId) {
      return;
    }
    throw new BusinessError(CodesError.BRANCH_ACCESS_DENIED, { branchId });
  }

  /** Force le filtre filiale ; siège conserve la requête. */
  resolveBranchFilter(ctx: SecurityContext, requestedBranchId?: string): string | undefined {
    if (!ctx.enforcePolicies) {
      return requestedBranchId;
    }
    if (ctx.isSiege()) {
      return requestedBranchId;
    }
    return ctx.branchId;
  }
}
