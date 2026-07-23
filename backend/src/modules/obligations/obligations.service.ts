import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateObligationDto, UpdateObligationDto } from "./dto";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { assertValidDueDate, createObligation } from "src/domain/obligation/obligation";
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
        return { message: "Obligations found" }
    }

    async findOne(id: string) {
        return { message: "Obligation found" }
    }

    async update(id: string, updateObligationDto: UpdateObligationDto) {
        return { message: "Obligation updated" }
    }

    async remove(id: string) {
        return { message: "Obligation deleted" }
    }
}