import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateObligationDto, UpdateObligationDto } from "./dto";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { assertValidDueDate, createObligation, isOverdue, Status } from "src/domain/obligation/obligation";
import { maskCompanyTaxId } from "src/shared/masking";

@Injectable()
export class ObligationsService {
    constructor(private readonly prismaService: PrismaService) { }

    async createObligation(createObligationDto: CreateObligationDto) {
        const dueDate = new Date(createObligationDto.dueDate);

        if (!assertValidDueDate(dueDate)) {
            throw new BadRequestException({
                code: "INVALID_DUE_DATE",
                message: "Due date is in the past",
            })
        }

        const draft = createObligation({ ...createObligationDto, dueDate });
        const saved = await this.prismaService.obligation.create({ data: draft });

        return { status: "success", data: { ...saved, companyTaxId: maskCompanyTaxId(saved.companyTaxId) } };
    }

    async findAll(companyTaxId: string) {
        if (!companyTaxId) {
            throw new BadRequestException({
                code: "INVALID_COMPANY_TAX_ID",
                message: "Company tax id is required"
            })
        }

        const obligations = await this.prismaService.obligation.findMany({ where: { companyTaxId, enabled: true }, orderBy: { dueDate: "asc" } });

        return {
            status: "success", data: obligations.map(obligation => ({
                ...obligation,
                companyTaxId: maskCompanyTaxId(obligation.companyTaxId),
                overdue: isOverdue({ dueDate: obligation.dueDate, status: obligation.status as Status })
            }))
        };
    }

    async findOne(id: string) {
        if (!id) {
            throw new BadRequestException({
                code: "INVALID_OBLIGATION_ID",
                message: "Obligation id is required"
            })
        }

        const obligation = await this.prismaService.obligation.findUnique({ where: { id, enabled: true } });

        if (!obligation) {
            throw new NotFoundException({
                code: "OBLIGATION_NOT_FOUND",
                message: "Obligation not found"
            })
        }

        return {
            status: "success",
            data:
            {
                ...obligation,
                companyTaxId: maskCompanyTaxId(obligation.companyTaxId),
                overdue: isOverdue({ dueDate: obligation.dueDate, status: obligation.status as Status })
            }
        };
    }

    async update(id: string, updateObligationDto: UpdateObligationDto) {
        if (!id) {
            throw new BadRequestException({
                code: "INVALID_OBLIGATION_ID",
                message: "Obligation id is required"
            })
        }

        const obligation = await this.prismaService.obligation.update({ where: { id }, data: updateObligationDto });

        return { status: "success", data: { ...obligation, taxCompanyId: maskCompanyTaxId(obligation.companyTaxId) } }
    }

    async disable(id: string) {
        if (!id) {
            throw new BadRequestException({
                code: "INVALID_OBLIGATION_ID",
                message: "Obligation id is required"
            });
        }

        const deleted = await this.prismaService.obligation.update({ where: { id }, data: { enabled: false, deletedAt: new Date() } })
        if (!deleted) {
            throw new NotFoundException({
                code: "OBLIGATION_NOT_FOUND",
                message: "Obligation not found"
            });
        }

        return { status: "success", data: { ...deleted, companyTaxId: maskCompanyTaxId(deleted.companyTaxId) } }
    }
}