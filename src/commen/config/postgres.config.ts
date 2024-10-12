import { ConfigService } from '@nestjs/config';
import { KnexModuleOptions } from 'nestjs-knex';

export function knexConfig(
  configService: ConfigService,
): KnexModuleOptions | Promise<KnexModuleOptions> {
  return {
    config: {
      client: 'postgresql',
      connection: {
        host: configService.get<string>('PGHOST'),
        user: configService.get<string>('PGUSER'),
        port: configService.get<number>('PGPORT'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        timezone: 'Asia/Tashkent',
      },
    },
  };
}
