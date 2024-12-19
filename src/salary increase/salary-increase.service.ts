import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/employee.entity';
import { AugmentationStatus } from 'utils/enums';
import * as nodemailer from 'nodemailer';
import { AugmentationRequest } from './salary-increase.entity';
import { CreateSalaryIncreaseDto } from './dtos/salary-increase.dto';
@Injectable()
export class AugmentationRequestService {
  constructor(
    @InjectRepository(AugmentationRequest)
    private augmentationRequestRepository: Repository<AugmentationRequest>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}
  async createAndSendAugmentationRequest(
    employeeId: string,
    createAugmentationRequestDto: CreateSalaryIncreaseDto,
  ) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
    const augmentationRequest = this.augmentationRequestRepository.create({
      ...createAugmentationRequestDto,
      employee,
      status: AugmentationStatus.PENDING,
    });
    await this.augmentationRequestRepository.save(augmentationRequest);
    await this.sendAugmentationRequestEmail(employee, augmentationRequest);
    return augmentationRequest;
  }
  private async sendAugmentationRequestEmail(
    employee: Employee,
    augmentationRequest: AugmentationRequest,
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
      Augmentation Request Details:
      Employee: ${employee.fullName}
      Email: ${employee.email}

      Augmentation Details:
      Amount: ${augmentationRequest.increaseAmount}
      Requested Date: ${augmentationRequest.increaseDate.toLocaleDateString()}
      Justification: ${augmentationRequest.justification || 'No justification provided'}

      Status: ${augmentationRequest.status}

      Please review and process this salary increase request.
    `;

    await transporter.sendMail({
      from: 'test@example.com',
      to: hrEmail,
      subject: `Salary Increase Request from ${employee.fullName}`,
      text: emailContent,
    });
  }
}
