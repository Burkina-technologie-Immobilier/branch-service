import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { IsPhone } from "src/lib/decorators.commons";

export class CreateBranchDto {
  @IsOptional() @IsString() @MaxLength(10) code?: string;
  @IsString() @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(120) city?: string;
  @IsOptional() @IsString() @MaxLength(240) address?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsPhone() phone?: string;
  @IsOptional() @IsString() managerPublicId?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() openedAt?: string;
}
