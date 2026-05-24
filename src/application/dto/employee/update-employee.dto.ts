import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";
import { IsPhone } from "src/lib/decorators.commons";

export class UpdateEmployeeDto {
  @IsOptional() @IsUUID() userId?: string | null;
  @IsOptional() @IsString() @MaxLength(160) fullName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsPhone() phone?: string | null;
  @IsOptional() @IsEnum(EmployeeRoleEnum) role?: EmployeeRoleEnum;
  @IsOptional() @IsString() branchPublicId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() hiredAt?: string | null;
}
