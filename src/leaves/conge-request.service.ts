import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CongeRequest } from './conge-request.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/employee.entity';
import { CreateCongeRequestDto } from './dtos/conge-request.dto';
import { CongeStatus } from 'utils/enums';
import * as nodemailer from 'nodemailer';
@Injectable()
export class CongeRequestService {
  constructor(
    @InjectRepository(CongeRequest)
    private congeRequestRepository: Repository<CongeRequest>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}
  async createAndSendCongeRequest(
    employeeId: string,
    createCongeRequestDto: CreateCongeRequestDto,
  ) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
    const congeRequest = this.congeRequestRepository.create({
      ...createCongeRequestDto,
      employee,
      status: CongeStatus.PENDING,
    });
    await this.congeRequestRepository.save(congeRequest);
    await this.sendCongeRequestEmail(employee, congeRequest);
    return congeRequest;
  }
  private async sendCongeRequestEmail(
    employee: Employee,
    congeRequest: CongeRequest,
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const hrEmail = 'souaouti.iman@gmail.com';
    const emailContent = `
      Congé Request Details:

      Employee: ${employee.fullName}
      Email: ${employee.email}

      Leave Details:
      Start Date: ${congeRequest.startDate.toLocaleDateString()}
      End Date: ${congeRequest.endDate.toLocaleDateString()}
      Reason: ${congeRequest.reason || 'No specific reason provided'}

      Status: ${congeRequest.status}

      Please review and process this leave request.
    `;
    await transporter.sendMail({
      from: 'test@example.com',
      to: hrEmail,
      subject: `Congé Request from ${employee.fullName}`,
      text: emailContent,
    });
  }
}
