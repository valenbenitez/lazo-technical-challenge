import { Module } from '@nestjs/common';
import { ObligationsService } from './obligations.service';
import { ObligationsController } from './obligations.controller';

@Module({
  imports: [],
  controllers: [ObligationsController],
  exports: [ObligationsService],
  providers: [ObligationsService],
})
export class ObligationModule {}
