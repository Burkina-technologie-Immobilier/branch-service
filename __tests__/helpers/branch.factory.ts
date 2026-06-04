import { BranchEntity } from 'src/domain/entities/branch.entity';
import {
  VALID_PUBLIC_ID,
  VALID_UUID,
} from './test-constants';

export function buildBranchEntity(
  overrides: Partial<ConstructorParameters<typeof BranchEntity>[0]> = {},
): BranchEntity {
  return new BranchEntity({
    id: VALID_UUID,
    publicId: VALID_PUBLIC_ID,
    code: 'ABJ',
    name: 'Filiale Abidjan',
    city: 'Abidjan',
    address: 'Plateau',
    email: 'abj@meublezone.fr',
    phone: '+22501020304',
    managerId: null,
    isActive: true,
    openedAt: new Date('2020-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}
