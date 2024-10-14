import { ConfigService } from '@nestjs/config';
import { KnexModuleOptions } from 'nestjs-knex';

export function knexConfig(
  configService: ConfigService,
): KnexModuleOptions | Promise<KnexModuleOptions> {
  return {
    config: {
      client: 'postgresql',
      connection: {
        host: configService.get<string>('DBHOST'),
        user: configService.get<string>('DBUSER'),
        port: configService.get<number>('DBPORT'),
        password: configService.get<string>('DBPASSWORD'),
        database: configService.get<string>('DBDATABASE'),
        timezone: 'Asia/Tashkent',
      },
    },
  };
}
