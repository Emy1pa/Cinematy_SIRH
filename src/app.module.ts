import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrModule } from './hrs/hrs.module';
import { Hr } from './hrs/hr.entity';
import { Employee } from './employees/employee.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmployeeSeederModule } from './employees/employee.module';
import { CongeRequestModule } from './leaves/conge-request.module';
import { CongeRequest } from './leaves/conge-request.entity';
import { SalaryIncreaseModule } from './salary increase/salary-increase.module';
import { AugmentationRequest } from './salary increase/salary-increase.entity';
import { ClaimRequestModule } from './claim/claim.module';
import { ClaimRequest } from './claim/claim.entity';
import { Offer } from './hrs/job-offer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME'),
        database: configService.get('DB_DATABASE'),
        entities: [
          Hr,
          Employee,
          CongeRequest,
          AugmentationRequest,
          ClaimRequest,
          Offer,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    HrModule,
    EmployeeSeederModule,
    CongeRequestModule,
    SalaryIncreaseModule,
    ClaimRequestModule,
    TypeOrmModule.forFeature([Employee]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      template: {
        dir: process.cwd() + '/src/templates/emails',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
