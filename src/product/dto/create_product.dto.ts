import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";

export class CreateProductDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  images?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  // @IsOptional()
  // @IsNumber()
  // inventoryId?: number;

  @IsOptional()
  @IsNumber()
  discountId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}