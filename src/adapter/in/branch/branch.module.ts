import { Module } from '@nestjs/common';
import { PublicIdGeneratorAdapter } from '../generate-public-id/generate.public-id.adapter';
import { BranchRepositoryAdapter } from 'src/adapter/out/persistence/branch.repository.adapter';
import { EmployeeRepositoryAdapter } from 'src/adapter/out/persistence/employee.repository.adapter';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';
import { BranchControllerAdapter } from './branch.controller.adapter';
import { CreateBranchUseCase } from 'src/application/use_case/branch/create-branch.usecase';
import { UpdateBranchUseCase } from 'src/application/use_case/branch/update-branch.usecase';
import { GetBranchUseCase } from 'src/application/use_case/branch/get-branch.usecase';
import { ListBranchUseCase } from 'src/application/use_case/branch/list-branch.usecase';
import { DeleteBranchUseCase } from 'src/application/use_case/branch/delete-branch.usecase';
import { CreateBranchValidator } from 'src/domain/service/validators/branch/create-branch.validator';
import { UpdateBranchValidator } from 'src/domain/service/validators/branch/update-branch.validator';
import { GetBranchValidator } from 'src/domain/service/validators/branch/get-branch.validator';
import { DeleteBranchValidator } from 'src/domain/service/validators/branch/delete-branch.validator';
import { AccessGuard } from 'src/domain/service/policies/access.guard';
import {
  SECURITY_CONTEXT_PORT,
  SecurityContextPort,
} from 'src/domain/port/out/security-context.port';

@Module({
  imports: [PrismaModule],
  controllers: [BranchControllerAdapter],
  providers: [
    { provide: 'BranchRepositoryPort', useClass: BranchRepositoryAdapter },
    { provide: 'EmployeeRepositoryPort', useClass: EmployeeRepositoryAdapter },
    { provide: 'PublicIdGeneratorPort', useClass: PublicIdGeneratorAdapter },
    CreateBranchValidator,
    UpdateBranchValidator,
    GetBranchValidator,
    DeleteBranchValidator,
    {
      provide: CreateBranchUseCase,
      useFactory: (repo, employeeRepo, validator, idGenerator, access) =>
        new CreateBranchUseCase(repo, employeeRepo, validator, idGenerator, access),
      inject: [
        'BranchRepositoryPort',
        'EmployeeRepositoryPort',
        CreateBranchValidator,
        'PublicIdGeneratorPort',
        AccessGuard,
      ],
    },
    {
      provide: UpdateBranchUseCase,
      useFactory: (repo, employeeRepo, validator, access) =>
        new UpdateBranchUseCase(repo, employeeRepo, validator, access),
      inject: ['BranchRepositoryPort', 'EmployeeRepositoryPort', UpdateBranchValidator, AccessGuard],
    },
    {
      provide: GetBranchUseCase,
      useFactory: (repo, validator, access) => new GetBranchUseCase(repo, validator, access),
      inject: ['BranchRepositoryPort', GetBranchValidator, AccessGuard],
    },
    {
      provide: ListBranchUseCase,
      useFactory: (repo, access, security) => new ListBranchUseCase(repo, access, security),
      inject: ['BranchRepositoryPort', AccessGuard, SECURITY_CONTEXT_PORT],
    },
    {
      provide: DeleteBranchUseCase,
      useFactory: (repo, validator, access) => new DeleteBranchUseCase(repo, validator, access),
      inject: ['BranchRepositoryPort', DeleteBranchValidator, AccessGuard],
    },
  ],
  exports: [
    CreateBranchUseCase,
    UpdateBranchUseCase,
    GetBranchUseCase,
    ListBranchUseCase,
    DeleteBranchUseCase,
    'BranchRepositoryPort',
  ],
})
export class BranchModule {}
