import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeeImportController } from './employee-import.controller';
import { EmployeeImportService } from './employee-import.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), MailerModule],
  providers: [EmployeeImportService],
  controllers: [EmployeeImportController],
})
export class EmployeeSeederModule {}
