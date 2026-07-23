import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status, Type } from 'src/domain/obligation/obligation';

export class CreateObligationDto {
    @IsEnum(Type)
    @IsNotEmpty()
    type!: Type;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsDateString()
    @IsNotEmpty()
    dueDate!: string;

    @IsString()
    @IsNotEmpty()
    owner!: string;

    @IsBoolean()
    requiresDocument!: boolean;

    @IsString()
    @IsOptional()
    documentUrl?: string;

    @IsString()
    @IsNotEmpty()
    companyTaxId!: string;
}

export class UpdateObligationDto {
    @IsEnum(Type)
    @IsOptional()
    type?: Type;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    owner?: string;

    @IsBoolean()
    @IsOptional()
    requiresDocument?: boolean;

    @IsString()
    @IsOptional()
    documentUrl?: string;

    @IsString()
    @IsOptional()
    companyTaxId?: string;
}

export class ChangeObligationStatusDto { 
    @IsEnum(Status)
    @IsNotEmpty()
    status!: Status;
}

export class ObligationResponseDto { }