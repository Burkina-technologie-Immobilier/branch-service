import { vi } from 'vitest';
import { CodesError } from 'src/application/errors/codes.error';
import { DeleteEmployeeUseCase } from 'src/application/use_case/employee/delete-employee.usecase';
import { DeleteEmployeeValidator } from 'src/domain/service/validators/employee/delete-employee.validator';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import { mockEmployeeRepository } from '../../../helpers/repository.mocks';
import { createTestAccessGuard } from '../../../helpers/access-guard.mock';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('DeleteEmployeeUseCase', () => {
  const repository = mockEmployeeRepository();
  const useCase = new DeleteEmployeeUseCase(repository, new DeleteEmployeeValidator(), createTestAccessGuard());

  it('supprime un employé existant', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(buildEmployeeEntity());
    vi.mocked(repository.delete).mockResolvedValue();

    await useCase.execute({ publicId: VALID_PUBLIC_ID });
    expect(repository.delete).toHaveBeenCalledWith(VALID_PUBLIC_ID);
  });

  it('lève EMPLOYEE_NOT_FOUND si absent', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(null);
    await expect(useCase.execute({ publicId: VALID_PUBLIC_ID })).rejects.toMatchObject({
      code: CodesError.EMPLOYEE_NOT_FOUND,
    });
  });
});
