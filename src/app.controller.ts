import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './auth/roles.guard';

@Controller('test')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles('admin')
  getHello(): string {
    return this.appService.getHello();
  }
}
