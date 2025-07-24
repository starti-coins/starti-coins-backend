import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  IsEnum,
  IsOptional,
  Max,
  IsBoolean,
} from 'class-validator';

enum Cargo {
  TECH_LEAD,
  GESTOR_RH,
  COLABORADOR,
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  rg?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Cargo)
  cargo?: Cargo;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  periodo?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
