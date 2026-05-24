import { BusinessError } from 'src/domain/errors/business.error';
import { DeleteEmployeeValidator } from 'src/domain/service/validators/employee/delete-employee.validator';
import { VALID_PUBLIC_ID } from '../../../helpers/test-constants';

describe('DeleteEmployeeValidator', () => {
  it('accepte un publicId valide', () => {
    const validator = new DeleteEmployeeValidator();
    expect(() => validator.validate({ publicId: VALID_PUBLIC_ID })).not.toThrow();
  });

  it('rejette un publicId invalide', () => {
    const validator = new DeleteEmployeeValidator();
    expect(() => validator.validate({ publicId: 'bad' })).toThrow(BusinessError);
  });
});
