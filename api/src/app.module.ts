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
import { RecipesService } from './recipes/recipes.service';
import { RecipesController } from './recipes/recipes.controller';
import { Recipe } from './recipes/recipe.entity';
import { FileData } from './files/file-data.entity';
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { FilesManager } from './files/files.manager';
import { VideosService } from './videos/videos.service';
import { HttpModule } from '@nestjs/axios';
import { TmdbRepositoryRepository } from './videos/tmdb/tmdb-repository.repository';
import { VideosController } from './videos/videos.controller';
import { Video } from './videos/video.entity';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { EventData } from './events/event-data.entity';
import { EventDataType } from './events/event-data-type.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Group,
      Recipe,
      FileData,
      Video,
      EventData,
      EventDataType,
    ]),
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
  controllers: [
    AuthenticationsController,
    RecipesController,
    GroupsController,
    VideosController,
    EventsController,
  ],
  providers: [
    TokensService,
    AuthenticationsService,
    UsersService,
    HashsService,
    RecipesService,
    GroupsService,
    FilesManager,
    VideosService,
    TmdbRepositoryRepository,
    EventsService,
  ],
})
export class AppModule {}
