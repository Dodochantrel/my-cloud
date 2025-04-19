import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokensService } from './utils/tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationsController } from './authentications/authentications.controller';
import { AuthenticationsService } from './authentications/authentications.service';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';
import { Group } from './groups/group.entity';
import { HashsService } from './utils/hashs.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Group]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_ACCESS_LIFETIME'),
        },
      }),
    }),
  ],
  controllers: [AuthenticationsController],
  providers: [
    TokensService,
    AuthenticationsService,
    UsersService,
    HashsService,
  ],
})
export class AppModule {}
