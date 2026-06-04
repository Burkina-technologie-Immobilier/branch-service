import { SecurityContext } from 'src/domain/value-objects/security-context.vo';

export const SECURITY_CONTEXT_PORT = 'SecurityContextPort';

export interface SecurityContextPort {
  get(): SecurityContext;
}
