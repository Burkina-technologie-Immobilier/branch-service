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
      useFactory: (repo, branchRepo, validator, idGenerator) =>
        new CreateEmployeeUseCase(repo, branchRepo, validator, idGenerator),
      inject: [
        'EmployeeRepositoryPort',
        'BranchRepositoryPort',
        CreateEmployeeValidator,
        'PublicIdGeneratorPort',
      ],
    },
    {
      provide: UpdateEmployeeUseCase,
      useFactory: (repo, branchRepo, validator) =>
        new UpdateEmployeeUseCase(repo, branchRepo, validator),
      inject: ['EmployeeRepositoryPort', 'BranchRepositoryPort', UpdateEmployeeValidator],
    },
    {
      provide: GetEmployeeUseCase,
      useFactory: (repo, validator) => new GetEmployeeUseCase(repo, validator),
      inject: ['EmployeeRepositoryPort', GetEmployeeValidator],
    },
    {
      provide: ListEmployeeUseCase,
      useFactory: (repo, branchRepo) => new ListEmployeeUseCase(repo, branchRepo),
      inject: ['EmployeeRepositoryPort', 'BranchRepositoryPort'],
    },
    {
      provide: DeleteEmployeeUseCase,
      useFactory: (repo, validator) => new DeleteEmployeeUseCase(repo, validator),
      inject: ['EmployeeRepositoryPort', DeleteEmployeeValidator],
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
