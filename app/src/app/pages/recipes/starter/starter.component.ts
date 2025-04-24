import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-starter',
  imports: [],
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.css',
})
export class StarterComponent implements OnInit {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService
  ) {}

  public isLoadingData: boolean = false;

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getRecipes();
    }
  }

  getRecipes() {
    this.isLoadingData = true;
    this.recipeService.getRecipes('starter', '', 1, 30).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load recipes', error.message);
        console.error(error);
      },
      complete: () => {
        this.isLoadingData = false;
      }
    });
  }
}
