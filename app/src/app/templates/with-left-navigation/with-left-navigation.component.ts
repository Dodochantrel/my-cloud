import { Component } from '@angular/core';
import { LeftNavigationComponent } from '../../components/navigations/left-navigation/left-navigation.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-with-left-navigation',
  imports: [LeftNavigationComponent, RouterOutlet, HeaderComponent],
  templateUrl: './with-left-navigation.component.html',
  styleUrl: './with-left-navigation.component.css',
})
export class WithLeftNavigationComponent {
  public isOpenNaviation: boolean = true;
}
