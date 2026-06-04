import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateBranchDto } from 'src/application/dto/branch/create-branch.dto';
import { ListBranchDto } from 'src/application/dto/branch/list-branch.dto';
import { UpdateBranchDto } from 'src/application/dto/branch/update-branch.dto';
import { PaginatedResponseMapper } from 'src/application/mapper/paginate/paginated-response.mapper.dto';
import { BranchHttpMapper } from 'src/application/mapper/branch/branch-http.mapper';
import { CreateBranchUseCase } from 'src/application/use_case/branch/create-branch.usecase';
import { DeleteBranchUseCase } from 'src/application/use_case/branch/delete-branch.usecase';
import { GetBranchUseCase } from 'src/application/use_case/branch/get-branch.usecase';
import { ListBranchUseCase } from 'src/application/use_case/branch/list-branch.usecase';
import { UpdateBranchUseCase } from 'src/application/use_case/branch/update-branch.usecase';

@Controller('branches')
export class BranchControllerAdapter {
  constructor(
    private readonly createBranch: CreateBranchUseCase,
    private readonly getBranch: GetBranchUseCase,
    private readonly deleteBranch: DeleteBranchUseCase,
    private readonly updateBranch: UpdateBranchUseCase,
    private readonly listBranch: ListBranchUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateBranchDto) {
    const result = await this.createBranch.execute(BranchHttpMapper.toCreateCommand(dto));
    return BranchHttpMapper.toResponse(result);
  }

  @Get(':publicId')
  async get(@Param('publicId') publicId: string) {
    const result = await this.getBranch.execute({ publicId });
    return BranchHttpMapper.toResponse(result!);
  }

  @Get()
  async list(@Query() dto: ListBranchDto) {
    const result = await this.listBranch.execute(BranchHttpMapper.toListQuery(dto));
    return PaginatedResponseMapper.toPaginatedDto(result, BranchHttpMapper.toResponse);
  }

  @Patch(':publicId')
  async update(@Param('publicId') publicId: string, @Body() dto: UpdateBranchDto) {
    const result = await this.updateBranch.execute(
      { publicId },
      BranchHttpMapper.toUpdateCommand(dto),
    );
    return BranchHttpMapper.toResponse(result);
  }

  @Delete(':publicId')
  async delete(@Param('publicId') publicId: string) {
    await this.deleteBranch.execute({ publicId });
    return { message: 'Branch deleted successfully' };
  }
}
