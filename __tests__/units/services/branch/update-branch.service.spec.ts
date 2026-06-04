import { BusinessError } from 'src/domain/errors/business.error';
import { UpdateBranchValidator } from 'src/domain/service/validators/branch/update-branch.validator';

describe('UpdateBranchValidator', () => {
  const validator = new UpdateBranchValidator();

  it('accepte une mise à jour partielle valide', () => {
    expect(() => validator.validate({ name: 'Nouveau nom' })).not.toThrow();
  });

  it('rejette un nom vide', () => {
    expect(() => validator.validate({ name: '  ' })).toThrow(BusinessError);
  });
});
