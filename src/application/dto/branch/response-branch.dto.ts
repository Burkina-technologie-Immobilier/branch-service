import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsNanoId } from "src/lib/decorators.commons";

export class ResponseBranchDto {
  @IsNanoId() @IsNotEmpty() publicId!: string;
  @IsOptional() @IsString() code?: string | null;
  @IsNotEmpty() @IsString() name!: string;
  @IsOptional() @IsString() city?: string | null;
  @IsOptional() @IsString() address?: string | null;
  @IsOptional() @IsString() email?: string | null;
  @IsOptional() @IsString() phone?: string | null;
  @IsBoolean() isActive!: boolean;
  @IsOptional() openedAt?: Date | null;
}
