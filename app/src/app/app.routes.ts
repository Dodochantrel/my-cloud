import { Routes } from '@angular/router';
import { WithLeftNavigationComponent } from './templates/with-left-navigation/with-left-navigation.component';
import { StarterComponent } from './pages/recipes/starter/starter.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NoNavigationComponent } from './templates/no-navigation/no-navigation.component';

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
