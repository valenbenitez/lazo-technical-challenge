import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateObligationDto } from "./dto";
import { ObligationsService } from "./obligations.service";

@Controller("obligations")
export class ObligationsController {
    constructor(private readonly obligationService: ObligationsService) { }

    @Post()
    create(@Body() createObligationDto: CreateObligationDto) {
        return this.obligationService.createObligation(createObligationDto);
    }

    @Get()
    findAll() {
        return this.obligationService.findAll();
    }
}