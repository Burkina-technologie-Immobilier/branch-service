import { vi } from 'vitest';
import type { BranchRepositoryPort } from 'src/domain/port/out/branch.repository.port';
import type { EmployeeRepositoryPort } from 'src/domain/port/out/employee.repository.port';
import type { PublicIdGeneratorPort } from 'src/domain/port/in/generate-public-id/generator-public-id.port';
import { VALID_PUBLIC_ID_2 } from './test-constants';

export function mockBranchRepository(): BranchRepositoryPort {
  return {
    save: vi.fn(),
    findById: vi.fn(),
    findByPublicId: vi.fn(),
    findByCode: vi.fn(),
    findWithPagination: vi.fn(),
    delete: vi.fn(),
  };
}

export function mockEmployeeRepository(): EmployeeRepositoryPort {
  return {
    save: vi.fn(),
    findById: vi.fn(),
    findByPublicId: vi.fn(),
    findByEmail: vi.fn(),
    findWithPagination: vi.fn(),
    delete: vi.fn(),
  };
}

export function mockPublicIdGenerator(
  publicId = VALID_PUBLIC_ID_2,
): PublicIdGeneratorPort {
  return {
    generateNanoid: vi.fn().mockReturnValue(publicId),
  };
}
