import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { AccessScopeEnum } from 'src/domain/enums/access-scope.enum';
import { SecurityContext } from 'src/domain/value-objects/security-context.vo';
import { SECURITY_CONTEXT_KEY, SecurityHeaders } from './security-headers';

function parseList(header: string | undefined): Set<string> {
  if (!header?.trim()) {
    return new Set();
  }
  return new Set(
    header
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function hasSecurityHeaders(req: Request): boolean {
  return Boolean(
    req.header(SecurityHeaders.USER_ID) ||
      req.header(SecurityHeaders.PERMISSIONS) ||
      req.header(SecurityHeaders.ROLES) ||
      req.header(SecurityHeaders.SCOPE),
  );
}

@Injectable()
export class SecurityContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const scopeHeader = req.header(SecurityHeaders.SCOPE)?.toLowerCase();
    const scope =
      scopeHeader === AccessScopeEnum.FILIALE
        ? AccessScopeEnum.FILIALE
        : AccessScopeEnum.SIEGE;

    const enforceExplicit = process.env.SECURITY_ENFORCE === 'true';
    const enforceDefault =
      process.env.SECURITY_ENFORCE !== 'false' &&
      (process.env.NODE_ENV === 'production' || hasSecurityHeaders(req));
    const enforcePolicies = enforceExplicit || enforceDefault;

    const ctx = new SecurityContext({
      userId: req.header(SecurityHeaders.USER_ID) ?? undefined,
      branchId: req.header(SecurityHeaders.BRANCH_ID) ?? undefined,
      branchPublicId: req.header(SecurityHeaders.BRANCH_PUBLIC_ID) ?? undefined,
      scope,
      permissions: parseList(req.header(SecurityHeaders.PERMISSIONS)),
      roles: parseList(req.header(SecurityHeaders.ROLES)),
      enforcePolicies,
    });

    (req as Request & Record<string, unknown>)[SECURITY_CONTEXT_KEY] = ctx;
    next();
  }
}
