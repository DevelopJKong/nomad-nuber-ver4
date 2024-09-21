import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Verification } from '../users/entities/verification.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Category } from '../restaurants/entities/category.entity';
import { DataSource } from 'typeorm';
import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';
import type { Database } from '../common/utils/database';
import { KyselyTypeORMDialect } from 'kysely-typeorm';

const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    synchronize: true,
    logging: true,
    entities: [User, Verification, Restaurant, Category],
  }),
};

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfig)],
  providers: [
    {
      provide: 'Kysely',
      useFactory: async (dataSource: DataSource) => {
        // 데이터 소스가 초기화되지 않은 경우 초기화
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }

        const kysely = new Kysely<Database>({
          dialect: new KyselyTypeORMDialect({
            kyselySubDialect: {
              createAdapter: () => new PostgresAdapter(),
              createIntrospector: (db) => new PostgresIntrospector(db),
              createQueryCompiler: () => new PostgresQueryCompiler(),
            },
            typeORMDataSource: dataSource,
          }),
        });

        return kysely;
      },
      inject: [DataSource],
    },
  ],
  exports: ['Kysely', TypeOrmModule],
})
export class DatabaseModule {}
