import { Routes } from '@angular/router';
import { WithLeftNavigationComponent } from './templates/with-left-navigation/with-left-navigation.component';

export const routes: Routes = [
  {
    path: '',
    component: WithLeftNavigationComponent,
    children: [],
  },
];
