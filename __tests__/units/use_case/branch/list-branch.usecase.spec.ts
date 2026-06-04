import { vi } from 'vitest';
import { ListBranchUseCase } from 'src/application/use_case/branch/list-branch.usecase';
import { buildBranchEntity } from '../../../helpers/branch.factory';
import { mockBranchRepository } from '../../../helpers/repository.mocks';
import { createTestAccessGuard, permissiveSecurity } from '../../../helpers/access-guard.mock';

describe('ListBranchUseCase', () => {
  const repository = mockBranchRepository();
  const useCase = new ListBranchUseCase(repository, createTestAccessGuard(), permissiveSecurity);

  it('retourne une réponse paginée', async () => {
    const entities = [buildBranchEntity(), buildBranchEntity({ code: 'YAM' })];
    vi.mocked(repository.findWithPagination).mockResolvedValue({
      data: entities,
      total: 2,
    });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
  });
});
