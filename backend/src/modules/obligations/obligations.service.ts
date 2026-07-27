import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ChangeObligationStatusDto, CreateObligationDto, UpdateObligationDto } from "./dto";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { assertValidDueDate, createObligation, getValidTransitions, isOverdue, Obligation, Status, updateObligationStatus } from "src/domain/obligation/obligation";
import { maskCompanyTaxId } from "src/shared/masking";
import { Prisma } from "generated/prisma/client";

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

        const history = await this.getHistory(id);

        return {
            status: "success",
            data:
            {
                ...obligation,
                companyTaxId: maskCompanyTaxId(obligation.companyTaxId),
                overdue: isOverdue({ dueDate: obligation.dueDate, status: obligation.status as Status }),
                validTransitions: getValidTransitions(obligation.status as Status, obligation as Obligation),
                history: history.status === "success" ? history.data : []
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

        const obligation = await this.prismaService.obligation.findUnique({ where: { id, enabled: true } });
        if (!obligation) {
            throw new NotFoundException({
                code: "OBLIGATION_NOT_FOUND",
                message: "Obligation not found"
            })
        }

        const { dueDate: dueDateInput, ...rest } = updateObligationDto;
        const data: Record<string, unknown> = {
            ...rest,
            version: { increment: 1 },
        };

        if (dueDateInput !== undefined) {
            const dueDate = new Date(dueDateInput);
            if (!assertValidDueDate(dueDate)) {
                throw new BadRequestException({
                    code: "INVALID_DUE_DATE",
                    message: "Due date is in the past",
                });
            }
            data.dueDate = dueDate;
        }

        try {
            const obligationUpdated = await this.prismaService.obligation.update({
                where: { id, version: obligation.version },
                data,
            });

            return { status: "success", data: { ...obligationUpdated, companyTaxId: maskCompanyTaxId(obligationUpdated.companyTaxId) } }
        } catch (error: unknown) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new ConflictException({
                    code: "CONFLICT_OBLIGATION_VERSION",
                    message: "Obligation version is outdated",
                });
            }

            const message = error instanceof Error ? error.message : "Unknown error";
            throw new InternalServerErrorException({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to update obligation. Error ${message}`,
            });
        }
    }

    async disable(id: string) {
        if (!id) {
            throw new BadRequestException({
                code: "INVALID_OBLIGATION_ID",
                message: "Obligation id is required"
            });
        }

        const obligation = await this.prismaService.obligation.findUnique({ where: { id, enabled: true } });
        if (!obligation) {
            throw new NotFoundException({
                code: "OBLIGATION_NOT_FOUND",
                message: "Obligation not found"
            })
        }

        try {
            const deleted = await this.prismaService.obligation.update({ where: { id, version: obligation.version }, data: { enabled: false, deletedAt: new Date(), version: { increment: 1 } } })

            return { status: "success", data: { ...deleted, companyTaxId: maskCompanyTaxId(deleted.companyTaxId) } }
        } catch (error: unknown) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new ConflictException({
                    code: "CONFLICT_OBLIGATION_VERSION",
                    message: "Obligation version is outdated",
                });
            }

            const message = error instanceof Error ? error.message : "Unknown error";
            throw new InternalServerErrorException({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to update obligation. Error ${message}`,
            });
        }
    }

    async updateStatus(id: string, updateStatusDto: ChangeObligationStatusDto) {
        const obligation = await this.prismaService.obligation.findUnique({ where: { id, enabled: true } });

        if (!obligation) {
            throw new NotFoundException({
                code: "OBLIGATION_NOT_FOUND",
                message: "Obligation not found"
            });
        }
        const result = updateObligationStatus(obligation as Obligation, updateStatusDto.status);

        if (result.success === false) {
            throw new BadRequestException({
                code: "INVALID_STATUS_TRANSITION",
                message: result.error
            })
        }

        try {
            const [obligationUpdated] = await this.prismaService.$transaction([
                this.prismaService.obligation.update({
                    where: { id, version: obligation.version },
                    data: { status: updateStatusDto.status, version: { increment: 1 } }
                }),
                this.prismaService.obligationStatusHistory.create({
                    data: {
                        obligationId: id,
                        fromStatus: obligation.status,
                        toStatus: updateStatusDto.status
                    }
                })
            ])

            return { status: "success", data: { ...obligationUpdated, companyTaxId: maskCompanyTaxId(obligationUpdated.companyTaxId) } }
        } catch (error: unknown) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025"
            ) {
                throw new ConflictException({
                    code: "CONFLICT_OBLIGATION_VERSION",
                    message: "Obligation version is outdated",
                });
            }

            const message = error instanceof Error ? error.message : "Unknown error";
            throw new InternalServerErrorException({
                code: "INTERNAL_SERVER_ERROR",
                message: `Failed to update obligation. Error ${message}`,
            });
        }
    }

    async getHistory(id: string) {
        if (!id) {
            throw new BadRequestException({
                code: "INVALID_OBLIGATION_ID",
                message: "Obligation id is required"
            })
        }

        const history = await this.prismaService.obligationStatusHistory.findMany({ where: { obligationId: id }, orderBy: { createdAt: "desc" }, take: 5 });
        if (!history) {
            throw new NotFoundException({
                code: "HISTORY_NOT_FOUND",
                message: "History not found"
            })
        }

        return { status: "success", data: history }
    }
}