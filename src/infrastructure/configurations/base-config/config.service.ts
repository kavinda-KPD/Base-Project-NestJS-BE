import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class DataBaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class JwtConfig {
  secret: string;
  expiresIn: string;
}

@Injectable()
export class ConfigurationService {
  private readonly _dbConfig: DataBaseConfig;
  private readonly _jwtConfig: JwtConfig;

  constructor(private readonly _configService: ConfigService) {
    // Initialize the database configuration object
    // db envs are required
    this._dbConfig = {
      host: this._configService.get<string>('DB_HOST')!,
      port: this._configService.get<number>('DB_PORT')!,
      username: this._configService.get<string>('DB_USER')!,
      password: this._configService.get<string>('DB_PASSWORD')!,
      database: this._configService.get<string>('DB_NAME')!,
    };

    // Initialize the jwt configuration object
    // jwt envs are required
    this._jwtConfig = {
      secret: this._configService.get<string>('JWT_SECRET')!,
      expiresIn: this._configService.get<string>('ACCESS_TOKEN_EXPIRATION')!,
    };
  }

  // Getter for database configuration
  get dbConfig(): DataBaseConfig {
    return this._dbConfig;
  }

  // Getter for jwt configuration
  get jwtConfig(): JwtConfig {
    return this._jwtConfig;
  }
}
