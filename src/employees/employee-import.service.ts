import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as csvParse from 'csv-parse';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'utils/enums';
import { join } from 'path';

@Injectable()
export class EmployeeImportService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private mailerService: MailerService,
  ) {}

  private generateRandomPassword(length: number = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
  async importEmployeesFromCsv(csvContent: string): Promise<Employee[]> {
    const records = csvParse.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
    const importedEmployees: Employee[] = [];
    for await (const record of records) {
      const existingUser = await this.employeeRepository.findOne({
        where: { email: record.email },
      });

      if (existingUser) {
        console.warn(
          `User with email ${record.email} already exists. Skipping.`,
        );
        continue;
      }

      const rawPassword = this.generateRandomPassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const employee = this.employeeRepository.create({
        fullName: record.fullName,
        email: record.email,
        username: record.username,
        password: hashedPassword,
        userRole: UserRole.EMPLOYEE,
      });
      const savedEmployee = await this.employeeRepository.save(employee);
      importedEmployees.push(savedEmployee);
      await this.sendWelcomeEmail(record.email, rawPassword);
    }
    return importedEmployees;
  }
  private async sendWelcomeEmail(
    email: string,
    password: string,
  ): Promise<void> {
    try {
      console.log('Attempting to send email to:', email);
      console.log(
        'Template path:',
        join(__dirname, 'templates/emails/welcome.hbs'),
      );
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Our Platform - Your Account Credentials',
        template: 'welcome',
        context: {
          email,
          password,
          loginUrl: 'http://localhost:6000/login',
        },
      });
      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
}
