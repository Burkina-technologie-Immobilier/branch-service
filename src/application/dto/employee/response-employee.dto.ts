import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
import { IsNanoId } from "src/lib/decorators.commons";

export class ResponseEmployeeDto {
  @IsNanoId() @IsNotEmpty() publicId!: string;
  @IsNotEmpty() @IsString() fullName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string | null;
  @IsEnum(EmployeeRoleEnum) role!: EmployeeRoleEnum;
  @IsOptional() @IsString() branchPublicId?: string | null;
  @IsBoolean() isActive!: boolean;
  @IsOptional() hiredAt?: Date | null;
}
