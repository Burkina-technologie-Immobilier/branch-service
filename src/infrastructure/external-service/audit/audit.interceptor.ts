import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Request, Response } from 'express';
import { AuditClient } from './audit.client';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditClient: AuditClient) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const send = (status: 'success' | 'failed') => {
      void this.auditClient.sendLog({
        action: toAction(req.method, req.path),
        entityName: 'branch_service_request',
        entityId: req.path,
        status,
        ipAddress: getClientIp(req),
        userAgent: req.get('user-agent') || '',
      });
    };

    return next.handle().pipe(
      tap(() => {
        const status = res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failed';
        send(status);
      }),
      catchError((err) => {
        send('failed');
        return throwError(() => err);
      }),
    );
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '';
}

function toAction(method: string, path: string):
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'request' {
  const lowerPath = path.toLowerCase();
  if (method === 'POST' && lowerPath.endsWith('/login')) {
    return 'login';
  }
  if (method === 'POST' && lowerPath.endsWith('/logout')) {
    return 'logout';
  }
  switch (method) {
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    case 'GET':
      return 'read';
    default:
      return 'request';
  }
}
