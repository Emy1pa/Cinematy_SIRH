import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      audience: ['Cinematy', 'account'],
      issuer: 'http://localhost:8080/realms/Myrealme',
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'http://localhost:8080/realms/Myrealme/protocol/openid-connect/certs',
      }),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access.roles,
    };
  }
}
