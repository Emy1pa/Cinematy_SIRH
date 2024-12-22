import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { ClaimRequestService } from './claim.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateClaimRequestDto } from './dtos/claim-request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Claim Requests') // This will add a tag in Swagger UI for this controller
@Controller('claim-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class ClaimRequestController {
  constructor(private readonly claimRequestService: ClaimRequestService) {}
  @Roles('Employee')
  @Post()
  @ApiOperation({ summary: 'Create a new claim request' }) // Describing the operation
  @ApiBody({ type: CreateClaimRequestDto }) // Specifying the body type for the POST request
  @ApiResponse({
    status: 201,
    description: 'Claim request created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, user does not have the necessary role.',
  })
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
