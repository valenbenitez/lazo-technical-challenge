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

export class UpdateObligationDto { }

export class ChangeObligationStatusDto { }

export class ObligationResponseDto { }