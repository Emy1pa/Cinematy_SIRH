import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimRequest } from './claim.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/employee.entity';
import { CreateClaimRequestDto } from './dtos/claim-request.dto';
import { ClaimStatus } from 'utils/enums';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ClaimRequestService {
  constructor(
    @InjectRepository(ClaimRequest)
    private readonly claimRepository: Repository<ClaimRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}
  async createAndSendClaimRequest(
    EmployeeId: string,
    createClaimRequestDto: CreateClaimRequestDto,
  ) {
    const employee = await this.employeeRepository.findOne({
      where: {
        id: EmployeeId,
      },
    });
    if (!employee) throw new Error('Employee not found');
    const claimRequest = await this.claimRepository.create({
      ...createClaimRequestDto,
      employee,
      status: ClaimStatus.PENDING,
    });
    await this.claimRepository.save(claimRequest);
    await this.sendClaimRequestEmail(employee, claimRequest);
    return claimRequest;
  }
  private async sendClaimRequestEmail(
    employee: Employee,
    claimRequest: ClaimRequest,
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
      Claim Request Details:
      Employee: ${employee.fullName}
      Email: ${employee.email}

      Claim Details:
      Title: ${claimRequest.title}
      Description: ${claimRequest.description}
      Category: ${claimRequest.category}

      Status: ${claimRequest.status}

      Please review and process this claim request.
    `;
    await transporter.sendMail({
      from: 'test@example.com',
      to: hrEmail,
      subject: `Claim Request from ${employee.fullName}`,
      text: emailContent,
    });
  }
}
