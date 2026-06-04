import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { IsPhone } from "src/lib/decorators.commons";

export class UpdateBranchDto {
  @IsOptional() @IsString() @MaxLength(10) code?: string;
  @IsOptional() @IsString() @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(120) city?: string;
  @IsOptional() @IsString() @MaxLength(240) address?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsPhone() phone?: string;
  @IsOptional() @IsString() managerPublicId?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() openedAt?: string | null;
}
