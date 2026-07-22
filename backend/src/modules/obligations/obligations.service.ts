import { Injectable } from "@nestjs/common";
import { CreateObligationDto } from "./dto";
import { PrismaService } from "../infrastructure/prisma/prisma.service";

@Injectable()
export class ObligationsService {
    constructor(private readonly prismaService: PrismaService) { }

    async createObligation(createObligationDto: CreateObligationDto) {
        return { message: "Hello world" }
    }

    async findAll() {
        return { message: "Obligations found" }
    }
}