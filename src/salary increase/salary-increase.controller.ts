import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { AugmentationRequestService } from './salary-increase.service';
import { CreateSalaryIncreaseDto } from './dtos/salary-increase.dto';

@Controller('augmentation-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class AugmentationRequesController {
  constructor(
    private readonly augmentationRequestService: AugmentationRequestService,
  ) {}

  @Roles('Employee')
  @Post()
  async CreateAugmentationRequest(
    @Req() req,
    @Body() createAugmentationRequestDto: CreateSalaryIncreaseDto,
  ) {
    console.log('Utilisateur authentifié :', req.user); // Debug pour vérifier req.user

    return this.augmentationRequestService.createAndSendAugmentationRequest(
      req.user.id,
      createAugmentationRequestDto,
    );
  }
}
