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
      useFactory: (repo, employeeRepo, validator, idGenerator) =>
        new CreateBranchUseCase(repo, employeeRepo, validator, idGenerator),
      inject: [
        'BranchRepositoryPort',
        'EmployeeRepositoryPort',
        CreateBranchValidator,
        'PublicIdGeneratorPort',
      ],
    },
    {
      provide: UpdateBranchUseCase,
      useFactory: (repo, employeeRepo, validator) =>
        new UpdateBranchUseCase(repo, employeeRepo, validator),
      inject: ['BranchRepositoryPort', 'EmployeeRepositoryPort', UpdateBranchValidator],
    },
    {
      provide: GetBranchUseCase,
      useFactory: (repo, validator) => new GetBranchUseCase(repo, validator),
      inject: ['BranchRepositoryPort', GetBranchValidator],
    },
    {
      provide: ListBranchUseCase,
      useFactory: (repo) => new ListBranchUseCase(repo),
      inject: ['BranchRepositoryPort'],
    },
    {
      provide: DeleteBranchUseCase,
      useFactory: (repo, validator) => new DeleteBranchUseCase(repo, validator),
      inject: ['BranchRepositoryPort', DeleteBranchValidator],
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
