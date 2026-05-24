import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateEmployeeDto } from 'src/application/dto/employee/create-employee.dto';
import { ListEmployeeDto } from 'src/application/dto/employee/list-employee.dto';
import { UpdateEmployeeDto } from 'src/application/dto/employee/update-employee.dto';
import { PaginatedResponseMapper } from 'src/application/mapper/paginate/paginated-response.mapper.dto';
import { EmployeeHttpMapper } from 'src/application/mapper/employee/employee-http.mapper';
import { CreateEmployeeUseCase } from 'src/application/use_case/employee/create-employee.usecase';
import { DeleteEmployeeUseCase } from 'src/application/use_case/employee/delete-employee.usecase';
import { GetEmployeeUseCase } from 'src/application/use_case/employee/get-employee.usecase';
import { ListEmployeeUseCase } from 'src/application/use_case/employee/list-employee.usecase';
import { UpdateEmployeeUseCase } from 'src/application/use_case/employee/update-employee.usecase';
import { EmployeeResponseAdapter } from './employee-response.adapter';

@Controller('employees')
export class EmployeeControllerAdapter {
  constructor(
    private readonly createEmployee: CreateEmployeeUseCase,
    private readonly getEmployee: GetEmployeeUseCase,
    private readonly deleteEmployee: DeleteEmployeeUseCase,
    private readonly updateEmployee: UpdateEmployeeUseCase,
    private readonly listEmployee: ListEmployeeUseCase,
    private readonly employeeResponse: EmployeeResponseAdapter,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    const result = await this.createEmployee.execute(EmployeeHttpMapper.toCreateCommand(dto));
    return this.employeeResponse.toResponse(result);
  }

  @Get(':publicId')
  async get(@Param('publicId') publicId: string) {
    const result = await this.getEmployee.execute({ publicId });
    return this.employeeResponse.toResponse(result!);
  }

  @Get()
  async list(@Query() dto: ListEmployeeDto) {
    const result = await this.listEmployee.execute(EmployeeHttpMapper.toListQuery(dto));
    return PaginatedResponseMapper.toPaginatedDtoAsync(result, (entity) =>
      this.employeeResponse.toResponse(entity),
    );
  }

  @Patch(':publicId')
  async update(@Param('publicId') publicId: string, @Body() dto: UpdateEmployeeDto) {
    const result = await this.updateEmployee.execute(
      { publicId },
      EmployeeHttpMapper.toUpdateCommand(dto),
    );
    return this.employeeResponse.toResponse(result);
  }

  @Delete(':publicId')
  async delete(@Param('publicId') publicId: string) {
    await this.deleteEmployee.execute({ publicId });
    return { message: 'Employee deleted successfully' };
  }
}
