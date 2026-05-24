import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
import { IsPhone } from "src/lib/decorators.commons";

export class CreateEmployeeDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsString() @MaxLength(160) fullName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsPhone() phone?: string;
  @IsEnum(EmployeeRoleEnum) role!: EmployeeRoleEnum;
  @IsOptional() @IsString() branchPublicId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() hiredAt?: string;
}
