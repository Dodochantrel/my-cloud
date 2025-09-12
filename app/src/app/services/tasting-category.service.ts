import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { NotificationService } from './notification.service';
import { mapFromDtosToTastingCategories, TastingCategoryDto } from '../dto/tasting-category.dto';
import { TastingCategory } from '../class/tasting-category';

@Injectable({
  providedIn: 'root'
})
export class TastingCategoryService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {
    effect(() => {
      const resource = this.getMyResource.value();
      if (resource) {
        this._categories.set(
          mapFromDtosToTastingCategories(resource.data)
        );
      }
    });
  }

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

  private readonly _categories = signal<TastingCategory[]>([]);
  categories = computed(() => this._categories());
  itemCount = computed(() =>
    this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0
  );
  isLoading = computed(() => this.getMyResource.isLoading());

  public isCreatingOrUpdating = signal(false);
  isCreatingParentId = signal<string | null>(null);
  public tastingCategoryEditing = signal<TastingCategory | null>(null);
}
