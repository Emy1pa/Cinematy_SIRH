import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { AugmentationRequestService } from './salary-increase.service';
import { CreateSalaryIncreaseDto } from './dtos/salary-increase.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('augmentation-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
@ApiTags('Salary Increase Requests')
export class AugmentationRequesController {
  constructor(
    private readonly augmentationRequestService: AugmentationRequestService,
  ) {}

  @Roles('Employee')
  @Post()
  @ApiOperation({ summary: 'Create a salary increase request' })
  @ApiBody({ type: CreateSalaryIncreaseDto })
  @ApiResponse({
    status: 201,
    description: 'Salary increase request created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
