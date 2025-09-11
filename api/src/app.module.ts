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
import { EventsDataCategory } from './events-categories/events-data-category.entity';
import { UsersController } from './users/users.controller';
import { RecurringEventProcessor } from './events/recurring/recurring-event-processor.service';
import { WeeklyRecurringEventStrategy } from './events/recurring/weekly-recurring-event.strategy';
import { MonthlyRecurringEventStrategy } from './events/recurring/monthly-recurring-event.strategy';
import { YearlyRecurringEventStrategy } from './events/recurring/yearly-recurring-event.strategy';
import { PicturesController } from './pictures/pictures.controller';
import { PicturesService } from './pictures/pictures.service';
import { PicturesCategoriesService } from './pictures-categories/pictures-categories.service';
import { PicturesCategoriesController } from './pictures-categories/pictures-categories.controller';
import { Picture } from './pictures/picture.entity';
import { PicturesCategory } from './pictures-categories/pictures-category.entity';
import { TastingsController } from './tastings/tastings.controller';
import { TastingsService } from './tastings/tastings.service';
import { Tasting } from './tastings/tasting.entity';
import { TastingCategory } from './tasting-categories/tasting-category.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { EventsCategoriesController } from './events-categories/events-categories.controller';
import { EventsCategoriesService } from './events-categories/events-categories.service';
import { TastingCategoriesController } from './tasting-categories/tasting-categories.controller';
import { TastingCategoriesService } from './tasting-categories/tasting-categories.service';

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
      EventsDataCategory,
      PicturesCategory,
      Picture,
      Tasting,
      TastingCategory,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.get<string>('JWT_ACCESS_LIFETIME')),
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
    UsersController,
    PicturesController,
    PicturesCategoriesController,
    TastingsController,
    EventsCategoriesController,
    TastingCategoriesController,
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
    RecurringEventProcessor,
    WeeklyRecurringEventStrategy,
    MonthlyRecurringEventStrategy,
    YearlyRecurringEventStrategy,
    PicturesService,
    PicturesCategoriesService,
    TastingsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    EventsCategoriesService,
    TastingCategoriesService,
  ],
})
export class AppModule {}
