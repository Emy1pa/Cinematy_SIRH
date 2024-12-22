import { Controller, Get, UseGuards } from '@nestjs/common';
import { DisplayRequestsHR } from './display-requests.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('Display Requests')
@Controller('display')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class DisplayRequestController {
  constructor(private readonly displayService: DisplayRequestsHR) {}
  @Roles('HR')
  @Get('claims')
  @ApiOperation({ summary: 'Get all claims requests for HR' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched claims requests.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden: HR role required.' })
  async getAllClaims() {
    return this.displayService.getAllClaims();
  }
  @Roles('HR')
  @Get('increases')
  @ApiOperation({ summary: 'Get all salary increase requests for HR' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched salary increase requests.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden: HR role required.' })
  async getAllIncreases() {
    return this.displayService.getAllIncreases();
  }
  @Roles('HR')
  @Get('conges')
  @ApiOperation({ summary: 'Get all leave requests for HR' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched leave requests.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden: HR role required.' })
  async getAllConges() {
    return this.displayService.getAllConges();
  }
}
