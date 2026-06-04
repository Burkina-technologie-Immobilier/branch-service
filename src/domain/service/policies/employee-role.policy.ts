import { BusinessError } from 'src/domain/errors/business.error';
import { CodesError } from 'src/domain/errors/codes.error';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';

const ROLE_RANK: Record<EmployeeRoleEnum, number> = {
  [EmployeeRoleEnum.DIRECTION]: 100,
  [EmployeeRoleEnum.MANAGER]: 80,
  [EmployeeRoleEnum.COMPTABLE]: 60,
  [EmployeeRoleEnum.SUPPORT]: 50,
  [EmployeeRoleEnum.MAGASINIER]: 40,
  [EmployeeRoleEnum.VENDEUR]: 30,
};

export class EmployeeRolePolicy {
  /** Empêche d'assigner un rôle strictement supérieur au sien (contexte filiale). */
  assertCanAssignRole(actorRole: EmployeeRoleEnum | undefined, targetRole: EmployeeRoleEnum): void {
    if (!actorRole) {
      return;
    }
    const actorRank = ROLE_RANK[actorRole] ?? 0;
    const targetRank = ROLE_RANK[targetRole] ?? 0;
    if (targetRank > actorRank) {
      throw new BusinessError(CodesError.EMPLOYEE_ROLE_ESCALATION_DENIED, {
        actorRole,
        targetRole,
      });
    }
  }
}
