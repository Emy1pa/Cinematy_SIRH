import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CongeRequestService } from './conge-request.service';
import { CreateCongeRequestDto } from './dtos/conge-request.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('conge-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
@ApiTags('Conge Requests')
export class CongeRequestController {
  constructor(private readonly congeRequestService: CongeRequestService) {}

  @Roles('Employee')
  @Post()
  @ApiOperation({ summary: 'Create a leave request' })
  @ApiBody({ type: CreateCongeRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Leave request created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async CreateCongeRequestDto(
    @Req() req,
    @Body() createCongeRequestDto: CreateCongeRequestDto,
  ) {
    console.log('Utilisateur authentifié :', req.user); // Debug pour vérifier req.user

    return this.congeRequestService.createAndSendCongeRequest(
      req.user.id,
      createCongeRequestDto,
    );
  }
}
