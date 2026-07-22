import { IsBoolean, IsDateString, IsEnum, IsString } from 'class-validator';

enum Type {
    ANNUAL_REPORT = "annual_report",
    FRANCHISE_TAX = "franchise_tax",
    BOI_REPORT = "boi_report",
    REGISTER_AGENT_RENEWAL = "register_agent_renewal",
}

enum Status {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    DONE = "done"
}

export class CreateObligationDto {
    @IsString()
    id: string;

    @IsEnum(Type)
    type: Type;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsEnum(Status)
    status: Status;

    @IsDateString()
    dueDate: string;

    @IsString()
    owner: string;

    @IsBoolean()
    requiresDocument: boolean;

    @IsString()
    documentUrl?: string;

    @IsString()
    companyTaxId: string;
}

export class UpdateObligationDto { }

export class ChangeObligationStatusDto { }

export class ObligationResponseDto { }