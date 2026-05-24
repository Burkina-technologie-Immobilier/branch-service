import { vi } from 'vitest';
import { EmployeeControllerAdapter } from 'src/adapter/in/employee/employee.controller.adapter';
import { EmployeeResponseAdapter } from 'src/adapter/in/employee/employee-response.adapter';
import type { CreateEmployeeUseCase } from 'src/application/use_case/employee/create-employee.usecase';
import type { GetEmployeeUseCase } from 'src/application/use_case/employee/get-employee.usecase';
import type { ListEmployeeUseCase } from 'src/application/use_case/employee/list-employee.usecase';
import type { UpdateEmployeeUseCase } from 'src/application/use_case/employee/update-employee.usecase';
import type { DeleteEmployeeUseCase } from 'src/application/use_case/employee/delete-employee.usecase';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import { buildEmployeeEntity } from '../../helpers/employee.factory';
import { VALID_EMAIL, VALID_PUBLIC_ID } from '../../helpers/test-constants';

describe('EmployeeControllerAdapter', () => {
  let controller: EmployeeControllerAdapter;
  const createEmployee = { execute: vi.fn() };
  const getEmployee = { execute: vi.fn() };
  const listEmployee = { execute: vi.fn() };
  const updateEmployee = { execute: vi.fn() };
  const deleteEmployee = { execute: vi.fn() };
  const employeeResponse = { toResponse: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new EmployeeControllerAdapter(
      createEmployee as unknown as CreateEmployeeUseCase,
      getEmployee as unknown as GetEmployeeUseCase,
      deleteEmployee as unknown as DeleteEmployeeUseCase,
      updateEmployee as unknown as UpdateEmployeeUseCase,
      listEmployee as unknown as ListEmployeeUseCase,
      employeeResponse as unknown as EmployeeResponseAdapter,
    );
  });

  it('POST / crée un employé', async () => {
    const entity = buildEmployeeEntity();
    const response = {
      publicId: entity.publicId,
      fullName: entity.fullName,
      email: entity.email,
      role: entity.role,
      isActive: true,
    };
    createEmployee.execute.mockResolvedValue(entity);
    employeeResponse.toResponse.mockResolvedValue(response);

    const result = await controller.create({
      fullName: 'Jean',
      email: VALID_EMAIL,
      role: EmployeeRoleEnum.VENDEUR,
    } as never);

    expect(createEmployee.execute).toHaveBeenCalled();
    expect(result).toEqual(response);
  });

  it('GET /:publicId retourne un employé', async () => {
    const entity = buildEmployeeEntity();
    getEmployee.execute.mockResolvedValue(entity);
    employeeResponse.toResponse.mockResolvedValue({
      publicId: entity.publicId,
      fullName: entity.fullName,
      email: entity.email,
      role: entity.role,
      isActive: true,
    });

    await controller.get(VALID_PUBLIC_ID);

    expect(getEmployee.execute).toHaveBeenCalledWith({ publicId: VALID_PUBLIC_ID });
    expect(employeeResponse.toResponse).toHaveBeenCalledWith(entity);
  });
});
