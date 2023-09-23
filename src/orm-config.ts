import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DB } from './config';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB.host,
  port: DB.port,
  username: DB.user,
  password: DB.password,
  database: DB.database,
  logging: false,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/migrations',
  },
} as TypeOrmModuleOptions;
