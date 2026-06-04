import { BusinessError } from 'src/domain/errors/business.error';
import { CodesError } from 'src/domain/errors/codes.error';
import type { MeublezonePermission } from 'src/domain/enums/meublezone-permission.enum';
import { SecurityContext } from 'src/domain/value-objects/security-context.vo';

export class PermissionPolicy {
  assert(ctx: SecurityContext, permission: MeublezonePermission): void {
    if (!ctx.enforcePolicies) {
      return;
    }
    if (ctx.hasPermission(permission)) {
      return;
    }
    throw new BusinessError(CodesError.PERMISSION_DENIED, { permission });
  }

  assertSiegeOnly(ctx: SecurityContext): void {
    if (!ctx.enforcePolicies) {
      return;
    }
    if (ctx.isSiege()) {
      return;
    }
    throw new BusinessError(CodesError.SCOPE_SIEGE_REQUIRED);
  }
}
