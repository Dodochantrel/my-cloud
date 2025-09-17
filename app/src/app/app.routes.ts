import { Routes } from '@angular/router';
import { WithLeftNavigationComponent } from './templates/with-left-navigation/with-left-navigation.component';
import { RecipeComponent } from './pages/recipes/recipe/recipe.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NoNavigationComponent } from './templates/no-navigation/no-navigation.component';
import { VideoDetailsComponent } from './pages/videos/video-details/video-details.component';
import { GroupComponent } from './pages/groups/group/group.component';
import { CreateOrUpdateRecipeComponent } from './pages/recipes/add-recipe/create-or-update-recipe.component';
import { EventComponent } from './pages/events/event/event.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TastingComponent } from './pages/tastings/tasting/tasting.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { adminGuard } from './guards/admin.guard';
import { UserComponent } from './pages/admin/user/user.component';
import { EventCategoryComponent } from './pages/admin/categories/event-category/event-category.component';
import { TastingCategoryComponent } from './pages/admin/categories/tasting-category/tasting-category.component';
import { authGuard } from './guards/auth.guard';
import { VideoComponent } from './pages/videos/video/video.component';

export const routes: Routes = [
  {
    path: '',
    component: WithLeftNavigationComponent,
    canActivate: [authGuard],
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
        component: VideoComponent,
        data: {
          title: 'Films',
          breadcrumb: [{ label: 'Vidéos' }, { label: 'Films' }],
        },
      },
      {
        path: 'videos/series',
        title: 'Videos - Series',
        component: VideoComponent,
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
        path: 'admin',
        canActivateChild: [adminGuard],
        children: [
          {
            path: 'users',
            title: 'Admin - Users',
            component: UserComponent,
            data: {
              title: 'Utilisateurs',
              breadcrumb: [{ label: 'Admin' }, { label: 'Utilisateurs' }],
            },
          },
          {
            path: 'categories',
            canActivateChild: [adminGuard],
            children: [
              {
                path: 'events',
                title: 'Admin - Event Categories',
                component: EventCategoryComponent,
                data: {
                  title: 'Catégories d\'Événements',
                  breadcrumb: [{ label: 'Admin' }, { label: 'Catégories' }, { label: 'Évènemement' }],
                },
              },
              {
                path: 'tastings',
                title: 'Admin - Tasting Categories',
                component: TastingCategoryComponent,
                data: {
                  title: 'Catégories de dégustations',
                  breadcrumb: [{ label: 'Admin' }, { label: 'Catégories' }, { label: 'Dégustation' }],
                },
              },
            ],  
          }
        ],  
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
  },
  {
    path: '',
    component: NoNavigationComponent,
    children: [
      {
        path: 'auth/register',
        title: 'Register',
        component: RegisterComponent,
      },
    ],
  },
];
