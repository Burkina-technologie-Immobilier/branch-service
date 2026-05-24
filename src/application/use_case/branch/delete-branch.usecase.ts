import { ApplicationError } from "src/application/errors/application.error";
import { CodesError } from "src/application/errors/codes.error";
import { DeleteBranchCommand, DeleteBranchInterfacePort } from "src/domain/port/in/branch/delete-branch.interface.port";
import { BranchRepositoryPort } from "src/domain/port/out/branch.repository.port";
import { DeleteBranchValidator } from "src/domain/service/validators/branch/delete-branch.validator";

export class DeleteBranchUseCase implements DeleteBranchInterfacePort {
  constructor(
    private readonly repository: BranchRepositoryPort,
    private readonly validator: DeleteBranchValidator,
  ) {}

  async execute(command: DeleteBranchCommand): Promise<void> {
    this.validator.validate(command);
    const entity = await this.repository.findByPublicId(command.publicId);
    if (!entity) {
      throw new ApplicationError(CodesError.BRANCH_NOT_FOUND);
    }
    await this.repository.delete(command.publicId);
  }
}
