import { CommonModule } from '@angular/common';
import { Component, effect, Input, model, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { adminNavigationItems, navigationItems } from './left-navigations-items';
import { UserService } from '../../../services/user.service';
import { filter, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-left-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
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
      state('open', style({ opacity: 1 })),
      transition('closed <=> open', animate('500ms ease-in-out')),
    ]),
  ],
})
export class LeftNavigationComponent implements OnInit, OnDestroy {
  public isOpenNaviation = model.required<boolean>();
  private routerSub?: Subscription;

  constructor(
    protected readonly userService: UserService,
    private readonly router: Router
  ) {
  }

  toggleNavigation() {
    this.isOpenNaviation.set(!this.isOpenNaviation());
  }

  public navigationItems: NavigationItem[] = navigationItems;
  public adminNavigationItems: NavigationItem[] = adminNavigationItems;

  public toggleSubNavigation(navigationItem: NavigationItem): void {
    navigationItem.isOpen = !navigationItem.isOpen;
  }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 768) {
          this.isOpenNaviation.set(false); // ferme le menu sur mobile
        }
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
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
