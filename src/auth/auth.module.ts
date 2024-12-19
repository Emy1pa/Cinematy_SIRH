import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KeycloakStrategy } from './keycloak.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'keycloak' }),
  ],
  providers: [KeycloakStrategy],
  exports: [PassportModule, ConfigModule],
})
export class AuthModule {}
