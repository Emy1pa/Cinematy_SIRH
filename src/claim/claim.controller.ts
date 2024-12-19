import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { ClaimRequestService } from './claim.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateClaimRequestDto } from './dtos/claim-request.dto';

@Controller('claim-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class ClaimRequestController {
  constructor(private readonly claimRequestService: ClaimRequestService) {}
  @Roles('Employee')
  @Post()
  async createClaimRequest(
    @Req() req,
    @Body() createClaimDto: CreateClaimRequestDto,
  ) {
    return this.claimRequestService.createAndSendClaimRequest(
      req.user.id,
      createClaimDto,
    );
  }
}
