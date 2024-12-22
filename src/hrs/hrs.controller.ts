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
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HrService } from './hrs.service';
import { CreateHrDto } from './dtos/create-hr.dto';
import { UpdateHrDto } from './dtos/update-hr.dto';
import { Hr } from './hr.entity';
import { AuthResponse } from 'utils/interface';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
@ApiTags('HR')
@Controller('hr')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class HrController {
  constructor(private readonly hrsService: HrService) {}
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new HR user' })
  @ApiResponse({ status: 201, description: 'HR user created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin role required.' })
  async createHr(@Body() createHrDto: CreateHrDto): Promise<Hr> {
    return this.hrsService.create(createHrDto);
  }
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all HR users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all HR users.',
  })
  async getAllHrs() {
    return this.hrsService.findAll();
  }
  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get an HR user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched HR user.' })
  @ApiResponse({ status: 404, description: 'HR user not found.' })
  @ApiParam({ name: 'id', description: 'HR user ID' })
  async getHrById(@Param('id') id: string) {
    return this.hrsService.findById(id);
  }
  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an HR user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated HR user.' })
  async updateHr(@Param('id') id: string, @Body() updateHrDto: UpdateHrDto) {
    return this.hrsService.update(id, updateHrDto);
  }
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete an HR user by ID' })
  @ApiResponse({ status: 204, description: 'HR user deleted successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHr(@Param('id') id: string) {
    return this.hrsService.remove(id);
  }
  @Post('login')
  @ApiOperation({ summary: 'Login as an HR user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials.',
  })
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<AuthResponse> {
    return this.hrsService.login(username, password);
  }
}
