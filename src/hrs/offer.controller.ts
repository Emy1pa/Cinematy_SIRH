import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Offer } from './job-offer.entity';
import { JobOfferService } from './offer.service';
import { CreateJobOfferDto } from './dtos/create-offer.dto';
import { UpdateJobOfferDto } from './dtos/update-offer.dto';
import { JobType } from 'utils/enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('job-offers')
@UseGuards(AuthGuard('keycloak'), RolesGuard)
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Roles('HR')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/job-offers',
        filename: (req, file, callback) => {
          if (!file.mimetype.includes('image')) {
            return callback(new Error('Only image files are allowed!'), null);
          }
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `job-offer-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() createJobOfferDto: CreateJobOfferDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Offer> {
    if (file) {
      createJobOfferDto.imageUrl = `/uploads/job-offers/${file.filename}`;
    }
    return await this.jobOfferService.create(createJobOfferDto);
  }

  @Get()
  async findAll(): Promise<Offer[]> {
    return await this.jobOfferService.findALL();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Offer> {
    return await this.jobOfferService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/job-offers',
        filename: (req, file, callback) => {
          if (!file.mimetype.includes('image')) {
            return callback(new Error('Only image files are allowed!'), null);
          }
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `job-offer-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Offer> {
    if (file) {
      updateJobOfferDto.imageUrl = `/uploads/job-offers/${file.filename}`;
    }
    return await this.jobOfferService.update(+id, updateJobOfferDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.jobOfferService.remove(+id);
  }

  @Get('type/:jobType')
  async findByJobType(@Param('jobType') jobType: JobType): Promise<Offer[]> {
    return await this.jobOfferService.findByJobType(jobType);
  }
}
