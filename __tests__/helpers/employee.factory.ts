import { EmployeeEntity } from 'src/domain/entities/employee.entity';
import { EmployeeRoleEnum } from 'src/domain/enums/employee-role.enum';
import {
  VALID_EMAIL,
  VALID_PUBLIC_ID,
  VALID_UUID,
} from './test-constants';

export function buildEmployeeEntity(
  overrides: Partial<ConstructorParameters<typeof EmployeeEntity>[0]> = {},
): EmployeeEntity {
  return new EmployeeEntity({
    id: VALID_UUID,
    publicId: VALID_PUBLIC_ID,
    userId: null,
    fullName: 'Kofi Mensah',
    email: VALID_EMAIL,
    phone: '+33612345678',
    role: EmployeeRoleEnum.VENDEUR,
    branchId: null,
    isActive: true,
    hiredAt: new Date('2022-06-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}
