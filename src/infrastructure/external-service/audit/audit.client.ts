import { Injectable, Logger } from '@nestjs/common';

type AuditStatus = 'success' | 'failed';
type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'request';

interface AuditLogPayload {
  action: AuditAction;
  entityName: string;
  entityId: string;
  oldValue?: unknown;
  newValue?: unknown;
  status: AuditStatus;
  ipAddress: string;
  userAgent: string;
}

@Injectable()
export class AuditClient {
  private readonly logger = new Logger(AuditClient.name);
  private readonly endpoint: string;

  constructor() {
    const baseUrl = (process.env.AUDIT_SERVICE_URL || 'http://audit-service:8300').replace(/\/$/, '');
    this.endpoint = `${baseUrl}/audit-logs`;
  }

  async sendLog(payload: AuditLogPayload): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      this.logger.warn(`Failed to send audit log: ${String(error)}`);
    }
  }
}
