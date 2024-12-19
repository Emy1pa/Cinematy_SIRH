import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HrService } from './hrs.service';
import { CreateHrDto } from './dtos/create-hr.dto';
import { UpdateHrDto } from './dtos/update-hr.dto';
import { Hr } from './hr.entity';
import { AuthResponse } from 'utils/interface';

@Controller('hr')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class HrController {
  constructor(private readonly hrsService: HrService) {}
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createHr(@Body() createHrDto: CreateHrDto): Promise<Hr> {
    return this.hrsService.create(createHrDto);
  }
  @Get()
  @Roles('admin')
  async getAllHrs() {
    return this.hrsService.findAll();
  }
  @Get(':id')
  @Roles('admin')
  async getHrById(@Param('id') id: string) {
    return this.hrsService.findById(id);
  }
  @Put(':id')
  @Roles('admin')
  async updateHr(@Param('id') id: string, @Body() updateHrDto: UpdateHrDto) {
    return this.hrsService.update(id, updateHrDto);
  }
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHr(@Param('id') id: string) {
    return this.hrsService.remove(id);
  }
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<AuthResponse> {
    return this.hrsService.login(username, password);
  }
}
