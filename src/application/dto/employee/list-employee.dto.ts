import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { EmployeeRoleEnum } from "src/domain/enums/employee-role.enum";

export class ListEmployeeDto {
  @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @Type(() => Number) @IsInt() @Min(1) @Max(100) limit: number = 10;
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsEnum(EmployeeRoleEnum) role?: EmployeeRoleEnum;
  @IsOptional() @IsString() branchPublicId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
