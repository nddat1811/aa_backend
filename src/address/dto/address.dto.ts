import { IsString, IsOptional, IsDate, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested, IsBoolean } from 'class-validator';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
