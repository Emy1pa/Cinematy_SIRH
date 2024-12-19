import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimRequest } from './claim.entity';
import { Employee } from 'src/employees/employee.entity';
import { ClaimRequestController } from './claim.controller';
import { ClaimRequestService } from './claim.service';

@Module({
  controllers: [ClaimRequestController],
  providers: [ClaimRequestService],
  imports: [TypeOrmModule.forFeature([ClaimRequest, Employee])],
})
export class ClaimRequestModule {}
