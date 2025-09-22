import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { NotificationService } from '../../../services/notification.service';
import { Recipe } from '../../../class/recipe';
import { filter } from 'rxjs';
import { Router, RouterEvent, Event } from '@angular/router';

@Component({
  selector: 'app-recipe',
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent implements OnInit {
  constructor(
    protected readonly recipeService: RecipeService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.setTypeWithUrl();
    });
    this.setTypeWithUrl();
  }

  //'starter' | 'main' | 'dessert' | 'drink' | 'other'
  setTypeWithUrl() {
    if (this.router.url.includes('starter')) {
      this.recipeService.type.set('starter');
    } else if (this.router.url.includes('main')) {
      this.recipeService.type.set('main');
    } else if (this.router.url.includes('dessert')) {
      this.recipeService.type.set('dessert');
    } else if (this.router.url.includes('drink')) {
      this.recipeService.type.set('drink');
    } else {
      this.recipeService.type.set('other');
    }
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
        const index = this.recipeService.recipes().findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          this.recipeService.recipes()[index].fileBlobUrl = url;
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
