import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { ConfigurationService } from 'src/infrastructure/configurations/base-config/config.service';

const CURRENT_USER_KEY = 'user';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly _configService: ConfigurationService,

    private readonly _jwtService: JwtService,

    private readonly _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Extract token from "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    //verify and extract the content.
    try {
      const payload = await this._jwtService.verifyAsync(token, {
        secret: this._configService.jwtConfig.secret,
      });
      request['user'] = payload;

      //set the current user to be extracted from a custom decorator
      SetMetadata(CURRENT_USER_KEY, payload);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.logger.debug(`token expired ${token}`);
      }
      throw new UnauthorizedException();
    }

    return true;
  }
}
