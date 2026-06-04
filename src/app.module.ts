import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BranchModule } from './adapter/in/branch/branch.module';
import { EmployeeModule } from './adapter/in/employee/employee.module';
import { SecurityModule } from './infrastructure/security/security.module';
import { SecurityContextMiddleware } from './infrastructure/security/security-context.middleware';

@Module({
  imports: [SecurityModule, BranchModule, EmployeeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SecurityContextMiddleware).forRoutes('*');
  }
}
