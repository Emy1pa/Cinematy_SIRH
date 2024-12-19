import { PartialType } from '@nestjs/mapped-types';
import { CreateJobOfferDto } from './create-offer.dto';

export class UpdateJobOfferDto extends PartialType(CreateJobOfferDto) {}
