import { vi } from 'vitest';
import { CodesError } from 'src/application/errors/codes.error';
import { GetEmployeeUseCase } from 'src/application/use_case/employee/get-employee.usecase';
import { GetEmployeeValidator } from 'src/domain/service/validators/employee/get-employee.validator';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import { mockEmployeeRepository } from '../../../helpers/repository.mocks';
import { createTestAccessGuard } from '../../../helpers/access-guard.mock';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('GetEmployeeUseCase', () => {
  const repository = mockEmployeeRepository();
  const useCase = new GetEmployeeUseCase(repository, new GetEmployeeValidator(), createTestAccessGuard());

  it('retourne l\'employé trouvé', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(buildEmployeeEntity());
    const result = await useCase.execute({ publicId: VALID_PUBLIC_ID });
    expect(result?.fullName).toBe('Kofi Mensah');
  });

  it('lève EMPLOYEE_NOT_FOUND si absent', async () => {
    vi.mocked(repository.findByPublicId).mockResolvedValue(null);
    await expect(useCase.execute({ publicId: VALID_PUBLIC_ID })).rejects.toMatchObject({
      code: CodesError.EMPLOYEE_NOT_FOUND,
    });
  });
});
