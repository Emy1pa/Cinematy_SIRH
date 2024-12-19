import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './job-offer.entity';
import { Repository } from 'typeorm';
import { CreateJobOfferDto } from './dtos/create-offer.dto';
import { UpdateJobOfferDto } from './dtos/update-offer.dto';
import { JobType } from 'utils/enums';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(Offer)
    private jobOfferRepository: Repository<Offer>,
  ) {}
  async create(createJobOffer: CreateJobOfferDto): Promise<Offer> {
    const jobOffer = this.jobOfferRepository.create(createJobOffer);
    await this.jobOfferRepository.save(jobOffer);
    return jobOffer;
  }
  async findALL(): Promise<Offer[]> {
    return await this.jobOfferRepository.find();
  }
  async findOne(id: number): Promise<Offer> {
    const jobOffer = this.jobOfferRepository.findOne({ where: { id } });
    if (!jobOffer) {
      throw new NotFoundException(`Job offer with ID ${id} not found`);
    }
    return jobOffer;
  }
  async update(
    id: number,
    updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<Offer> {
    const jobOffer = await this.findOne(id);
    const updatedJobOffer = this.jobOfferRepository.merge(
      jobOffer,
      updateJobOfferDto,
    );
    return await this.jobOfferRepository.save(updatedJobOffer);
  }
  async remove(id: number): Promise<void> {
    const jobOffer = await this.findOne(id);
    await this.jobOfferRepository.remove(jobOffer);
  }
  async findByJobType(jobType: JobType): Promise<Offer[]> {
    return await this.jobOfferRepository.find({ where: { jobType } });
  }
}
