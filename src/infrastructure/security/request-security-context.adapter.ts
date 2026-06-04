import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import {
  SECURITY_CONTEXT_PORT,
  SecurityContextPort,
} from 'src/domain/port/out/security-context.port';
import { SecurityContext } from 'src/domain/value-objects/security-context.vo';
import { SECURITY_CONTEXT_KEY } from './security-headers';

@Injectable({ scope: Scope.REQUEST })
export class RequestSecurityContextAdapter implements SecurityContextPort {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get(): SecurityContext {
    const ctx = (this.request as Request & Record<string, unknown>)[
      SECURITY_CONTEXT_KEY
    ] as SecurityContext | undefined;
    return ctx ?? SecurityContext.anonymous();
  }
}

export { SECURITY_CONTEXT_PORT };
