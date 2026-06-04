import { AccessScopeEnum } from '../enums/access-scope.enum';

export interface SecurityContextProps {
  userId?: string;
  branchId?: string;
  branchPublicId?: string;
  scope: AccessScopeEnum;
  permissions: ReadonlySet<string>;
  roles: ReadonlySet<string>;
  enforcePolicies: boolean;
}

export class SecurityContext {
  static anonymous(): SecurityContext {
    return new SecurityContext({
      scope: AccessScopeEnum.SIEGE,
      permissions: new Set(),
      roles: new Set(),
      enforcePolicies: false,
    });
  }

  constructor(private readonly props: SecurityContextProps) {}

  get userId(): string | undefined {
    return this.props.userId;
  }

  get branchId(): string | undefined {
    return this.props.branchId;
  }

  get branchPublicId(): string | undefined {
    return this.props.branchPublicId;
  }

  get scope(): AccessScopeEnum {
    return this.props.scope;
  }

  get enforcePolicies(): boolean {
    return this.props.enforcePolicies;
  }

  isSiege(): boolean {
    if (!this.props.enforcePolicies) {
      return true;
    }
    if (this.props.scope === AccessScopeEnum.SIEGE) {
      return true;
    }
    if (this.props.roles.has('SIEGHE_ADMIN')) {
      return true;
    }
    if (this.props.permissions.has('*')) {
      return true;
    }
    return false;
  }

  hasPermission(permission: string): boolean {
    if (!this.props.enforcePolicies) {
      return true;
    }
    if (this.isSiege() && this.props.scope === AccessScopeEnum.SIEGE) {
      return true;
    }
    if (this.props.permissions.has('*')) {
      return true;
    }
    return this.props.permissions.has(permission);
  }
}
