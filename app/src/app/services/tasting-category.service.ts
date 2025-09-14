import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, linkedSignal, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { NotificationService } from './notification.service';
import { mapFromDtosToTastingCategories, mapFromDtoToTastingCategory, TastingCategoryDto } from '../dto/tasting-category.dto';
import { TastingCategory } from '../class/tasting-category';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TastingCategoryService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  public search = signal<string>('');
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<TastingCategoryDto>>(
    () =>
      `${
        environment.apiUrl
      }tasting-categories?search=${this.search()}&page=${this.page()}&limit=${this.limit()}`
  );

  refresh() {
    this.getMyResource.reload();
  }

  categories = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromDtosToTastingCategories(resource.data)
      : [];
  });
  itemCount = computed(() =>
    this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0
  );
  isLoading = computed(() => this.getMyResource.isLoading());

  public isCreatingOrUpdating = signal(false);
  isCreatingParentId = signal<string | null>(null);
  public tastingCategoryEditing = signal<TastingCategory | null>(null);

  delete(tastingCategory: TastingCategory) {
    this.httpClient.delete(`${environment.apiUrl}tasting-categories/${tastingCategory.id}`).subscribe({
      next: () => {
        this.notificationService.showSuccess("Catégorie supprimée avec succès", `La catégorie "${tastingCategory.name}" a bien été supprimée.`);
        this.refresh();
      },
      error: (err) => {
        this.notificationService.showError("Une erreur est survenue lors de la suppression de la catégorie.", err.message);
      }
    });
  }

  private getMyIcons = httpResource<string[]>(() => `${environment.apiUrl}tasting-categories/icons`);
  icons = linkedSignal(() => {
    return this.getMyIcons.value();
  });

  create(name: string, color: string | null, icon: string | null, parentId: string | null) {
    const body: any = {
      name: name,
      parentId: parentId,
      color: color,
      icon: icon,
    };
    return this.httpClient.post<TastingCategory>(`${environment.apiUrl}tasting-categories`, body)
    .pipe(map(dto => mapFromDtoToTastingCategory(dto)))
    .subscribe({
      next: (createdCategory) => {
        this.notificationService.showSuccess("Catégorie créée avec succès", `La catégorie "${createdCategory.name}" a bien été créée.`);
        if (this.isCreatingParentId()) {
          this.categories.update((categories) =>
            this.addCategoryToTree(categories, this.isCreatingParentId()!, createdCategory)
          );
          this.isCreatingParentId.set(null);
        } else {
          this.categories.update((categories) => [createdCategory, ...categories]);
        }
        this.isCreatingOrUpdating.set(false);
        this.tastingCategoryEditing.set(null);
      },
      error: (err) => {
        this.notificationService.showError("Une erreur est survenue lors de la création de la catégorie.", err.message);
      }
    });
  }

  private addCategoryToTree(categories: TastingCategory[], parentId: string, created: TastingCategory): TastingCategory[] {
    return categories.map(cat => {
      if (cat.id === parentId) {
        return {
          ...cat,
          childrens: [created, ...cat.childrens],
          hasChildren: true
        };
      }
      if (cat.childrens && cat.childrens.length > 0) {
        return {
          ...cat,
          childrens: this.addCategoryToTree(cat.childrens, parentId, created)
        };
      }
      return cat;
    });
  }

  edit(id: string, name: string, color: string | null, icon: string | null) {
    const body: any = {
      name: name,
      color: color,
      icon: icon,
    };
    return this.httpClient.put<TastingCategory>(`${environment.apiUrl}tasting-categories/${id}`, body)
    .pipe(map(dto => mapFromDtoToTastingCategory(dto)))
    .subscribe({
      next: (updatedCategory) => {
        this.notificationService.showSuccess("Catégorie modifiée avec succès", `La catégorie "${updatedCategory.name}" a bien été modifiée.`);
        this.isCreatingOrUpdating.set(false);
        this.tastingCategoryEditing.set(null);
        this.categories.update((categories) =>
          categories.map(cat =>
            cat.id === updatedCategory.id
              ? {
                  ...cat,
                  name: updatedCategory.name,
                  color: updatedCategory.color,
                  icon: updatedCategory.icon
                }
              : cat
          )
        );
      },
      error: (err) => {
        this.notificationService.showError("Une erreur est survenue lors de la modification de la catégorie.", err.message);
      }
    });
  }
}
