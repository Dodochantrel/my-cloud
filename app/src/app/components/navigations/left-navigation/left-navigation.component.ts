import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-left-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './left-navigation.component.html',
  styleUrl: './left-navigation.component.css',
  animations: [
    trigger('subMenuAnimation', [
      state('void', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('500ms ease-in-out')),
    ]),
    trigger('navigationAnimation', [
      state('closed', style({ width: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ width: '300px', opacity: 1 })),
      transition('closed <=> open', animate('500ms ease-in-out')),
    ]),
  ],
})
export class LeftNavigationComponent {
  @Input() isOpenNaviation: boolean = true;

  public navigationItems: NavigationItem[] = [
    {
      name: 'Mon cinéma',
      icon: 'tv',
      path: null,
      isOpen: false,
      subNavigationItems: [
        { name: 'Films', icon: 'movie', path: '/videos/movies' },
        { name: 'Séries', icon: 'cast', path: '/videos/series' },
      ],
    },
    {
      name: 'Ma cuisine',
      icon: 'kitchen',
      path: null,
      isOpen: false,
      subNavigationItems: [
        { name: 'Entrées', icon: 'egg_alt', path: '/recipes/starters' },
        { name: 'Plats', icon: 'room_service', path: '/recipes/dishes' },
        { name: 'Desserts', icon: 'cookie', path: '/recipes/desserts' },
        { name: 'Boissons', icon: 'sports_bar', path: '/recipes/drinks' },
        { name: 'Ajouter', icon: 'add_circle_outline', path: '/recipes/add' },
      ],
    },
    { name: 'Groupes', icon: 'groups', path: '/groups' },
    { name: 'Event', icon: 'event', path: '/events' },
  ];

  public toggleSubNavigation(navigationItem: NavigationItem): void {
    navigationItem.isOpen = !navigationItem.isOpen;
  }
}

interface NavigationItem {
  name: string;
  icon: string;
  path: string | null;
  isOpen?: boolean;
  subNavigationItems?: SubNavigationItem[];
}

interface SubNavigationItem {
  name: string;
  icon: string;
  path: string;
}
