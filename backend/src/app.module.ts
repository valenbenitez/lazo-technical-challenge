import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObligationModule } from './modules/obligations/obligations.module';
import { PrismaModule } from './modules/infrastructure/prisma/prisma.module';

@Module({
  imports: [ObligationModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
