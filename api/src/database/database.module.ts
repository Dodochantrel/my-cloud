import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        applicationName: configService.get<string>('APPLICATION_NAME'),
        synchronize: true,
        migrationsRun: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        logging: ['migration', 'error', 'warn', 'schema'],
        // affciher les requetes sql dans la console
        logger: 'advanced-console',        
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class DatabaseModule {}
