import { vi } from 'vitest';
import { ListEmployeeUseCase } from 'src/application/use_case/employee/list-employee.usecase';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { buildEmployeeEntity } from '../../../helpers/employee.factory';
import {
  mockBranchRepository,
  mockEmployeeRepository,
} from '../../../helpers/repository.mocks';
import { createTestAccessGuard } from '../../../helpers/access-guard.mock';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('ListEmployeeUseCase', () => {
  const employeeRepo = mockEmployeeRepository();
  const branchRepo = mockBranchRepository();
  const useCase = new ListEmployeeUseCase(employeeRepo, branchRepo, createTestAccessGuard());

  it('retourne une liste paginée', async () => {
    vi.mocked(employeeRepo.findWithPagination).mockResolvedValue({
      data: [buildEmployeeEntity()],
      total: 1,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });

  it('filtre par branchPublicId', async () => {
    const branch = buildBranchEntity();
    vi.mocked(branchRepo.findByPublicId).mockResolvedValue(branch);
    vi.mocked(employeeRepo.findWithPagination).mockResolvedValue({ data: [], total: 0 });

    await useCase.execute({ page: 1, limit: 10, branchPublicId: VALID_PUBLIC_ID });

    expect(employeeRepo.findWithPagination).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
      branch.id,
    );
  });
});
