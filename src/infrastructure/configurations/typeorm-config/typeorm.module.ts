import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../base-config/config.module';
import { ConfigurationService } from '../base-config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configService: ConfigurationService) => ({
        type: 'mysql',
        host: configService.dbConfig.host,
        port: configService.dbConfig.port,
        username: configService.dbConfig.username,
        password: configService.dbConfig.password,
        database: configService.dbConfig.database,
        entities: ['dist/**/*.entity.js'],
        timezone: 'Z',
        synchronize: true,
        // logging: ['schema', 'error'],
      }),
    }),
  ],
})
export class TypeOrmConfigModule {}
