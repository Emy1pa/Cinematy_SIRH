import { Module } from '@nestjs/common';
import { CongeRequestController } from './conge-request.controller';
import { CongeRequestService } from './conge-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employees/employee.entity';
import { CongeRequest } from './conge-request.entity';

@Module({
  controllers: [CongeRequestController],
  providers: [CongeRequestService],
  imports: [TypeOrmModule.forFeature([CongeRequest, Employee])],
  // imports: [TypeOrmModule.forFeature([CongeRequest, Employee])],
})
export class CongeRequestModule {}
