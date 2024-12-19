import { Controller, Get, UseGuards } from '@nestjs/common';
import { DisplayRequestsHR } from './display-requests.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('display')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class DisplayRequestController {
  constructor(private readonly displayService: DisplayRequestsHR) {}
  @Roles('HR')
  @Get('claims')
  async getAllClaims() {
    return this.displayService.getAllClaims();
  }
  @Roles('HR')
  @Get('increases')
  async getAllIncreases() {
    return this.displayService.getAllIncreases();
  }
  @Roles('HR')
  @Get('conges')
  async getAllConges() {
    return this.displayService.getAllConges();
  }
}
