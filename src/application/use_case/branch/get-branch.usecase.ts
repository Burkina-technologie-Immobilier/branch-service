import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { BranchEntity } from "src/domain/entities/branch.entity";
import { GetBranchInterfacePort, GetBranchQuery } from "src/domain/port/in/branch/get-branch.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { GetBranchValidator } from "src/domain/service/validators/branch/get-branch.validator";

export class GetBranchUseCase implements GetBranchInterfacePort {
  constructor(
    private readonly repository: BranchRepositoryPort,
    private readonly validator: GetBranchValidator,
  ) {}

  async execute(query: GetBranchQuery): Promise<BranchEntity | null> {
    this.validator.validate(query);
    const entity = await this.repository.findByPublicId(query.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.BRANCH_NOT_FOUND);
    }
    return entity;
  }
}
