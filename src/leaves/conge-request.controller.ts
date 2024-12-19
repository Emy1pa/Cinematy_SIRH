import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CongeRequestService } from './conge-request.service';
import { CreateCongeRequestDto } from './dtos/conge-request.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('conge-request')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class CongeRequestController {
  constructor(private readonly congeRequestService: CongeRequestService) {}

  @Roles('Employee')
  @Post()
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
