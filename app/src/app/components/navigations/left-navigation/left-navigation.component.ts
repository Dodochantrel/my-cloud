import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { adminNavigationItems, navigationItems } from './left-navigations-items';

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

  public navigationItems: NavigationItem[] = navigationItems;
  public adminNavigationItems: NavigationItem[] = adminNavigationItems;

  public toggleSubNavigation(navigationItem: NavigationItem): void {
    navigationItem.isOpen = !navigationItem.isOpen;
  }
}

export interface NavigationItem {
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
