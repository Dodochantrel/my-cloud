import { Routes } from '@angular/router';
import { WithLeftNavigationComponent } from './templates/with-left-navigation/with-left-navigation.component';
import { RecipeComponent } from './pages/recipes/recipe/recipe.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NoNavigationComponent } from './templates/no-navigation/no-navigation.component';
import { MovieComponent } from './pages/videos/movie/movie.component';
import { SerieComponent } from './pages/videos/serie/serie.component';
import { VideoDetailsComponent } from './pages/videos/video-details/video-details.component';
import { GroupComponent } from './pages/groups/group/group.component';
import { CreateOrUpdateRecipeComponent } from './pages/recipes/add-recipe/create-or-update-recipe.component';
import { EventComponent } from './pages/events/event/event.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TastingComponent } from './pages/tastings/tasting/tasting.component';
import { AddOrUpdateTastingComponent } from './pages/tastings/add-or-update-tasting/add-or-update-tasting.component';

export const routes: Routes = [
  {
    path: '',
    component: WithLeftNavigationComponent,
    children: [
      {
        path: 'recipes/starters',
        title: 'Recipes - Starters',
        component: RecipeComponent,
        data: {
          title: 'Entrées',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Entrées' }],
        },
      },
      {
        path: 'recipes/mains',
        title: 'Recipes - Mains',
        component: RecipeComponent,
        data: {
          title: 'Plats Principaux',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Plats Principaux' }],
        },
      },
      {
        path: 'recipes/desserts',
        title: 'Recipes - Desserts',
        component: RecipeComponent,
        data: {
          title: 'Desserts',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Desserts' }],
        },
      },
      {
        path: 'recipes/drinks',
        title: 'Recipes - Drinks',
        component: RecipeComponent,
        data: {
          title: 'Boissons',
          breadcrumb: [{ label: 'Recettes' }, { label: 'Boissons' }],
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
      },
      {
        path: 'gallery',
        title: 'Gallery',
        component: GalleryComponent,
        data: {
          title: 'Galerie',
          breadcrumb: [{ label: 'Galerie' }],
        },
      },
      {
        path: 'tastings',
        title: 'Tastings',
        component: TastingComponent,
        data: {
          title: 'Dégustations',
          breadcrumb: [{ label: 'Dégustations' }],
        },
      },
      {
        path: 'tastings/:id',
        title: 'Tasting Details',
        component: AddOrUpdateTastingComponent,
        data: {
          title: 'Détails de la Dégustation',
          breadcrumb: [{ label: 'Dégustations' }, { label: 'Détails' }],
        },
      },
      {
        path: 'tastings/add',
        title: 'Add Tasting',
        component: AddOrUpdateTastingComponent,
        data: {
          title: 'Ajouter une Dégustation',
          breadcrumb: [{ label: 'Dégustations' }, { label: 'Ajouter' }],
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
