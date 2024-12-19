import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hr } from './hr.entity';
import { Repository } from 'typeorm';
import { CreateHrDto } from './dtos/create-hr.dto';
import { UpdateHrDto } from './dtos/update-hr.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthResponse } from 'utils/interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class HrService {
  private keycloakUrl: string;
  private clientId: string;
  private clientSecret: string;
  constructor(
    @InjectRepository(Hr)
    private hrRepository: Repository<Hr>,
    private configService: ConfigService,
  ) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
    this.clientId = this.configService.get<string>('CLIENT_ID');
    this.clientSecret = this.configService.get<string>('CLIENT_SECRET');
  }
  async create(createHrDto: CreateHrDto): Promise<Hr> {
    const hashedPassword = await this.hashPassword(createHrDto.password);
    const hr = await this.hrRepository.create({
      ...createHrDto,
      password: hashedPassword,
    });
    return this.hrRepository.save(hr);
  }
  async findAll(): Promise<Hr[]> {
    return this.hrRepository.find();
  }
  async findById(id: string): Promise<Hr> {
    const hr = await this.hrRepository.findOne({ where: { id } });
    if (!hr) {
      throw new NotFoundException(`HR user with ID ${id} not found`);
    }
    return hr;
  }
  async update(id: string, updateHrDto: UpdateHrDto): Promise<Hr> {
    const hr = await this.findById(id);
    if (updateHrDto.password) {
      const hashedPassword = await this.hashPassword(updateHrDto.password);
      return this.hrRepository.save({
        ...hr,
        ...updateHrDto,
        password: hashedPassword,
      });
    }
    return this.hrRepository.save({ ...hr, ...updateHrDto });
  }
  async remove(id: string): Promise<void> {
    const result = await this.hrRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`HR user with ID ${id} not found`);
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username,
      password,
    });

    const response = await fetch(this.keycloakUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new HttpException(
        errorData,
        response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.json() as Promise<AuthResponse>;
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
