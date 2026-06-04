import { Module } from '@nestjs/common';
import { PublicIdGeneratorAdapter } from '../generate-public-id/generate.public-id.adapter';
import { BranchModule } from '../branch/branch.module';
import { EmployeeRepositoryAdapter } from 'src/adapter/out/persistence/employee.repository.adapter';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';
import { EmployeeControllerAdapter } from './employee.controller.adapter';
import { EmployeeResponseAdapter } from './employee-response.adapter';
import { CreateEmployeeUseCase } from 'src/application/use_case/employee/create-employee.usecase';
import { UpdateEmployeeUseCase } from 'src/application/use_case/employee/update-employee.usecase';
import { GetEmployeeUseCase } from 'src/application/use_case/employee/get-employee.usecase';
import { ListEmployeeUseCase } from 'src/application/use_case/employee/list-employee.usecase';
import { DeleteEmployeeUseCase } from 'src/application/use_case/employee/delete-employee.usecase';
import { CreateEmployeeValidator } from 'src/domain/service/validators/employee/create-employee.validator';
import { UpdateEmployeeValidator } from 'src/domain/service/validators/employee/update-employee.validator';
import { GetEmployeeValidator } from 'src/domain/service/validators/employee/get-employee.validator';
import { DeleteEmployeeValidator } from 'src/domain/service/validators/employee/delete-employee.validator';
import { AccessGuard } from 'src/domain/service/policies/access.guard';
import { EmployeeRolePolicy } from 'src/domain/service/policies/employee-role.policy';

@Module({
  imports: [PrismaModule, BranchModule],
  controllers: [EmployeeControllerAdapter],
  providers: [
    { provide: 'EmployeeRepositoryPort', useClass: EmployeeRepositoryAdapter },
    { provide: 'PublicIdGeneratorPort', useClass: PublicIdGeneratorAdapter },
    EmployeeResponseAdapter,
    CreateEmployeeValidator,
    UpdateEmployeeValidator,
    GetEmployeeValidator,
    DeleteEmployeeValidator,
    {
      provide: CreateEmployeeUseCase,
      useFactory: (repo, branchRepo, validator, idGenerator, access, rolePolicy) =>
        new CreateEmployeeUseCase(repo, branchRepo, validator, idGenerator, access, rolePolicy),
      inject: [
        'EmployeeRepositoryPort',
        'BranchRepositoryPort',
        CreateEmployeeValidator,
        'PublicIdGeneratorPort',
        AccessGuard,
        EmployeeRolePolicy,
      ],
    },
    {
      provide: UpdateEmployeeUseCase,
      useFactory: (repo, branchRepo, validator, access, rolePolicy) =>
        new UpdateEmployeeUseCase(repo, branchRepo, validator, access, rolePolicy),
      inject: [
        'EmployeeRepositoryPort',
        'BranchRepositoryPort',
        UpdateEmployeeValidator,
        AccessGuard,
        EmployeeRolePolicy,
      ],
    },
    {
      provide: GetEmployeeUseCase,
      useFactory: (repo, validator, access) => new GetEmployeeUseCase(repo, validator, access),
      inject: ['EmployeeRepositoryPort', GetEmployeeValidator, AccessGuard],
    },
    {
      provide: ListEmployeeUseCase,
      useFactory: (repo, branchRepo, access) => new ListEmployeeUseCase(repo, branchRepo, access),
      inject: ['EmployeeRepositoryPort', 'BranchRepositoryPort', AccessGuard],
    },
    {
      provide: DeleteEmployeeUseCase,
      useFactory: (repo, validator, access) => new DeleteEmployeeUseCase(repo, validator, access),
      inject: ['EmployeeRepositoryPort', DeleteEmployeeValidator, AccessGuard],
    },
  ],
  exports: [
    CreateEmployeeUseCase,
    UpdateEmployeeUseCase,
    GetEmployeeUseCase,
    ListEmployeeUseCase,
    DeleteEmployeeUseCase,
  ],
})
export class EmployeeModule {}
