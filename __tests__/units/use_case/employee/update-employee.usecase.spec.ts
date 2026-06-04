import { vi } from 'vitest';
import { CodesError } from 'src/application/errors/codes.error';
import { UpdateEmployeeUseCase } from 'src/application/use_case/employee/update-employee.usecase';
import { UpdateEmployeeValidator } from 'src/domain/service/validators/employee/update-employee.validator';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import {
  mockBranchRepository,
  mockEmployeeRepository,
} from '../../../helpers/repository.mocks';
import {
  createTestAccessGuard,
  createTestEmployeeRolePolicy,
} from '../../../helpers/access-guard.mock';
import { VALID_EMAIL, VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('UpdateEmployeeUseCase', () => {
  const employeeRepo = mockEmployeeRepository();
  const branchRepo = mockBranchRepository();
  const useCase = new UpdateEmployeeUseCase(
    employeeRepo,
    branchRepo,
    new UpdateEmployeeValidator(),
    createTestAccessGuard(),
    createTestEmployeeRolePolicy(),
  );

  it('met à jour un employé existant', async () => {
    const entity = buildEmployeeEntity();
    vi.mocked(employeeRepo.findByPublicId).mockResolvedValue(entity);
    vi.mocked(employeeRepo.save).mockImplementation(async (e) => e);

    const result = await useCase.execute(
      { publicId: VALID_PUBLIC_ID },
      { role: EmployeeRoleEnum.MANAGER },
    );

    expect(result.role).toBe(EmployeeRoleEnum.MANAGER);
  });

  it('lève EMPLOYEE_NOT_FOUND si absent', async () => {
    vi.mocked(employeeRepo.findByPublicId).mockResolvedValue(null);

    await expect(
      useCase.execute({ publicId: VALID_PUBLIC_ID }, { fullName: 'X' }),
    ).rejects.toMatchObject({ code: CodesError.EMPLOYEE_NOT_FOUND });
  });

  it('rejette un email déjà pris', async () => {
    const entity = buildEmployeeEntity();
    const other = buildEmployeeEntity({ email: 'autre@meublezone.fr' });
    vi.mocked(employeeRepo.findByPublicId).mockResolvedValue(entity);
    vi.mocked(employeeRepo.findByEmail).mockResolvedValue(other);

    await expect(
      useCase.execute({ publicId: VALID_PUBLIC_ID }, { email: 'autre@meublezone.fr' }),
    ).rejects.toMatchObject({ code: CodesError.EMAIL_ALREADY_EXISTS });
  });
});
