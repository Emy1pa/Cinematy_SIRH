import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employees/employee.entity';
import { AugmentationRequest } from './salary-increase.entity';
import { AugmentationRequesController } from './salary-increase.controller';
import { AugmentationRequestService } from './salary-increase.service';

@Module({
  controllers: [AugmentationRequesController],
  providers: [AugmentationRequestService],
  imports: [TypeOrmModule.forFeature([AugmentationRequest, Employee])],
  // imports: [TypeOrmModule.forFeature([CongeRequest, Employee])],
})
export class SalaryIncreaseModule {}
