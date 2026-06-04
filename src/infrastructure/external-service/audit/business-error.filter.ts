import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { BusinessError } from "src/domain/errors/business.error";
import { CodesError } from "src/domain/errors/codes.error";

const FORBIDDEN_CODES = new Set<string>([
  CodesError.PERMISSION_DENIED,
  CodesError.BRANCH_ACCESS_DENIED,
  CodesError.SCOPE_SIEGE_REQUIRED,
  CodesError.EMPLOYEE_ROLE_ESCALATION_DENIED,
]);

@Catch(BusinessError)
export class BusinessErrorFilter implements ExceptionFilter {
  catch(exception: BusinessError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = FORBIDDEN_CODES.has(exception.code)
      ? HttpStatus.FORBIDDEN
      : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      error: status === HttpStatus.FORBIDDEN ? "Forbidden" : "Bad Request",
      message: exception.code,
      metadata: exception.metadata,
    });
  }
}
