import { Module } from '@nestjs/common';
import { HrService } from './hrs.service';
import { HrController } from './hrs.controller';
import { Hr } from './hr.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisplayRequestController } from './display-request.controller';
import { DisplayRequestsHR } from './display-requests.service';
import { ClaimRequest } from 'src/claim/claim.entity';
import { AugmentationRequest } from 'src/salary increase/salary-increase.entity';
import { CongeRequest } from 'src/leaves/conge-request.entity';
import { Offer } from './job-offer.entity';
import { MulterModule } from '@nestjs/platform-express';
import { JobOfferService } from './offer.service';
import { JobOfferController } from './offer.controller';

@Module({
  providers: [HrService, DisplayRequestsHR, JobOfferService],
  controllers: [HrController, DisplayRequestController, JobOfferController],
  imports: [
    TypeOrmModule.forFeature([
      Hr,
      ClaimRequest,
      AugmentationRequest,
      CongeRequest,
      Offer,
    ]),
    MulterModule.register({
      dest: './uploads/job-offers',
    }),
  ],
})
export class HrModule {}
