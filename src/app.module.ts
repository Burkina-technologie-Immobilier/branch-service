import { Module } from '@nestjs/common';
import { BranchModule } from './adapter/in/branch/branch.module';
import { EmployeeModule } from './adapter/in/employee/employee.module';

@Module({
  imports: [BranchModule, EmployeeModule],
})
export class AppModule {}
