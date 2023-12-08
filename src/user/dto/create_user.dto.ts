import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDate } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  avatar?: string;
  
  @IsOptional()
  @IsDate()
  dob?: Date;
}
