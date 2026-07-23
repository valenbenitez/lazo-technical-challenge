import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateObligationDto, UpdateObligationDto } from "./dto";
import { ObligationsService } from "./obligations.service";

@Controller("obligations")
export class ObligationsController {
    constructor(private readonly obligationService: ObligationsService) { }

    @Post()
    create(@Body() createObligationDto: CreateObligationDto) {
        return this.obligationService.createObligation(createObligationDto);
    }

    @Get()
    findAll(@Query("companyTaxId") companyTaxId: string = "") {
        return this.obligationService.findAll(companyTaxId);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.obligationService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateObligationDto: UpdateObligationDto) {
        return this.obligationService.update(id, updateObligationDto);
    }

    @Patch(":id/disable")
    disable(@Param("id") id: string) {
        return this.obligationService.disable(id);
    }
}