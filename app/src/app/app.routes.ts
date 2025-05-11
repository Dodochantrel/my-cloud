import { Routes } from '@angular/router';
import { WithLeftNavigationComponent } from './templates/with-left-navigation/with-left-navigation.component';
import { StarterComponent } from './pages/recipes/starter/starter.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NoNavigationComponent } from './templates/no-navigation/no-navigation.component';
import { MovieComponent } from './pages/videos/movie/movie.component';
import { SerieComponent } from './pages/videos/serie/serie.component';
import { VideoDetailsComponent } from './pages/videos/video-details/video-details.component';
import { GroupComponent } from './pages/groups/group/group.component';
import { CreateOrUpdateRecipeComponent } from './pages/recipes/add-recipe/create-or-update-recipe.component';
import { EventComponent } from './pages/events/event/event.component';

export const routes: Routes = [
  {
    path: '',
    component: WithLeftNavigationComponent,
    children: [
      {
        path: 'recipes/starters',
        title: 'Recipes - Starters',
        component: StarterComponent,
        data: {
          title: 'Entrées',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Entrées' }],
        },
      },
      {
        path: 'recipes/add',
        title: 'Recipes - Add',
        component: CreateOrUpdateRecipeComponent,
        data: {
          title: 'Ajouter une recette',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Ajouter' }],
        },
      },
      {
        path: 'recipes/update/:id',
        title: 'Recipes - Add',
        component: CreateOrUpdateRecipeComponent,
        data: {
          title: 'Modifier une recette',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Modifier' }],
        },
      },
      {
        path: 'videos/movies',
        title: 'Videos - Movies',
        component: MovieComponent,
        data: {
          title: 'Films',
          breadcrumb: [{ label: 'Vidéos' }, { label: 'Films' }],
        },
      },
      {
        path: 'videos/series',
        title: 'Videos - Series',
        component: SerieComponent,
        data: {
          title: 'Series',
          breadcrumb: [{ label: 'Vidéos' }, { label: 'Séries' }],
        },
      },
      {
        path: 'videos/details/:type/:id',
        title: 'Videos - Details',
        component: VideoDetailsComponent,
        data: {
          title: 'Détails',
          breadcrumb: [{ label: 'Vidéos' }, { label: 'Détails' }],
        },
      },
      {
        path: 'groups',
        title: 'Groups',
        component: GroupComponent,
        data: {
          title: 'Groupes',
          breadcrumb: [{ label: 'Groupes' }],
        },
      },
      {
        path: 'events',
        title: 'Events',
        component: EventComponent,
        data: {
          title: 'Événements',
          breadcrumb: [{ label: 'Événements' }],
        },
      }
    ],
  },
  {
    path: '',
    component: NoNavigationComponent,
    children: [
      {
        path: 'auth/login',
        title: 'Login',
        component: LoginComponent,
      },
    ],
  }
];
