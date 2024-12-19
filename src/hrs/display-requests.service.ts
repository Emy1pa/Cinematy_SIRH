import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaimRequest } from 'src/claim/claim.entity';
import { CongeRequest } from 'src/leaves/conge-request.entity';
import { AugmentationRequest } from 'src/salary increase/salary-increase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DisplayRequestsHR {
  constructor(
    @InjectRepository(ClaimRequest)
    private readonly claimRepository: Repository<ClaimRequest>,
    @InjectRepository(AugmentationRequest)
    private readonly augmentationRepository: Repository<AugmentationRequest>,
    @InjectRepository(CongeRequest)
    private readonly congeRepository: Repository<CongeRequest>,
  ) {}
  async getAllClaims(): Promise<ClaimRequest[]> {
    return this.claimRepository.find({
      relations: ['employee'],
    });
  }
  async getAllIncreases(): Promise<AugmentationRequest[]> {
    return this.augmentationRepository.find({
      relations: ['employee'],
    });
  }
  async getAllConges(): Promise<CongeRequest[]> {
    return this.congeRepository.find({
      relations: ['employee'],
    });
  }
}
