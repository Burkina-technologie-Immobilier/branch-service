import { vi } from 'vitest';
import { BranchControllerAdapter } from 'src/adapter/in/branch/branch.controller.adapter';
import type { CreateBranchUseCase } from 'src/application/use_case/branch/create-branch.usecase';
import type { GetBranchUseCase } from 'src/application/use_case/branch/get-branch.usecase';
import type { ListBranchUseCase } from 'src/application/use_case/branch/list-branch.usecase';
import type { UpdateBranchUseCase } from 'src/application/use_case/branch/update-branch.usecase';
import type { DeleteBranchUseCase } from 'src/application/use_case/branch/delete-branch.usecase';
import { buildBranchEntity } from '../../helpers/branch.factory';
import { VALID_PUBLIC_ID } from '../../helpers/test-constants';

describe('BranchControllerAdapter', () => {
  let controller: BranchControllerAdapter;
  const createBranch = { execute: vi.fn() };
  const getBranch = { execute: vi.fn() };
  const listBranch = { execute: vi.fn() };
  const updateBranch = { execute: vi.fn() };
  const deleteBranch = { execute: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new BranchControllerAdapter(
      createBranch as unknown as CreateBranchUseCase,
      getBranch as unknown as GetBranchUseCase,
      deleteBranch as unknown as DeleteBranchUseCase,
      updateBranch as unknown as UpdateBranchUseCase,
      listBranch as unknown as ListBranchUseCase,
    );
  });

  it('POST / crée une filiale', async () => {
    const entity = buildBranchEntity();
    createBranch.execute.mockResolvedValue(entity);

    const result = await controller.create({ name: 'Filiale', code: 'ABJ' } as never);

    expect(createBranch.execute).toHaveBeenCalled();
    expect(result.publicId).toBe(entity.publicId);
    expect(result.name).toBe(entity.name);
  });

  it('GET /:publicId retourne une filiale', async () => {
    const entity = buildBranchEntity();
    getBranch.execute.mockResolvedValue(entity);

    const result = await controller.get(VALID_PUBLIC_ID);

    expect(getBranch.execute).toHaveBeenCalledWith({ publicId: VALID_PUBLIC_ID });
    expect(result.name).toBe(entity.name);
  });

  it('DELETE /:publicId supprime une filiale', async () => {
    deleteBranch.execute.mockResolvedValue(undefined);

    const result = await controller.delete(VALID_PUBLIC_ID);

    expect(deleteBranch.execute).toHaveBeenCalledWith({ publicId: VALID_PUBLIC_ID });
    expect(result).toEqual({ message: 'Branch deleted successfully' });
  });
});
