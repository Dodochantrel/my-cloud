import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-header',
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() changeNavigation: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isOpenNaviation: boolean = true;
  public breadcrumbItems: any[] = [];
  public home: any;

  constructor(private router: Router, private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // écouté les changements de route
    this.updatePageName();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageName();
    });
  }

  updatePageName() {
    let route = this.activatedRoute.firstChild;
    
    while (route?.firstChild) {
      route = route.firstChild;
    }
  
    this.breadcrumbItems = route?.snapshot.data['breadcrumb'];
    this.home = { icon: 'pi pi-home', routerLink: '/home' };
  }
  

  toggleNavigation() {
    this.isOpenNaviation = !this.isOpenNaviation;
    this.changeNavigation.emit(this.isOpenNaviation);
  }
}
