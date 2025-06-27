import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { BrowserService } from '../../../services/browser.service';
import { NotificationService } from '../../../services/notification.service';
import { Recipe } from '../../../class/recipe';
import { Paginated } from '../../../class/paginated';
import { PaginatedMeta } from '../../../class/paginated-meta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent implements OnInit {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly browserService: BrowserService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  public isLoadingData: boolean = false;

  public paginatedRecipes: Paginated<Recipe> = new Paginated<Recipe>([], new PaginatedMeta(false, false, 0, 0, 0, 0));

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getRecipes();    
    }
  }

  getType() {
    switch (this.router.url) {
      case '/recipes/starters':
        return 'starter';
      case '/recipes/mains':
        return 'main';
      case '/recipes/desserts':
        return 'dessert';
      case '/recipes/drinks':
        return 'drink';
      default:
        return 'unknown';
    }
  }

  getRecipes() {
    this.isLoadingData = true;
    this.recipeService.getRecipes(this.getType(), '', 1, 30).subscribe({
      next: (response: Paginated<Recipe>) => {
        this.addFileToRecipe(response.data);
        this.paginatedRecipes = response;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load recipes', error.message);
      },
      complete: () => {
        this.isLoadingData = false;
      }
    });
  }

  addFileToRecipe(recipes: Recipe[]) {
    recipes.forEach((recipe) => {
      this.getFile(recipe);
    });
  }

  // Récupérer les fichiers petit a petit
  getFile(recipe: Recipe) {
    this.recipeService.getFile(recipe.id).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const index = this.paginatedRecipes.data.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          this.paginatedRecipes.data[index].fileBlobUrl = url;
        }
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load file', error.message);
      }
    });
  }

  goToRecipe(id: number): void {
    this.router.navigate(['/recipes/update', id]);
  }
}
