// src/application/errors/application.error.ts

import { CodesError } from "./codes.error";


export class ApplicationError extends Error {
  constructor(
    public readonly code: CodesError,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(code);
  }
}
