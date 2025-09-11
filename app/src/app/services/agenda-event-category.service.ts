import { HttpClient, httpResource } from '@angular/common/http';
import {
  computed,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment';
import {
  AgendaEventCategoryDto,
  mapFromAgendaEventCategoriesDtosToAgendaEventCategories,
  mapFromAgendaEventCategoryDtoToAgendaEventCategory,
} from '../dto/agenda-event-category.dto';
import { AgendaEventCategory } from '../class/agenda-event-category';
import { NotificationService } from './notification.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgendaEventCategoryService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  public search = signal<string>('');
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<AgendaEventCategoryDto>>(
    () =>
      `${
        environment.apiUrl
      }events-categories?search=${this.search()}&page=${this.page()}&limit=${this.limit()}`
  );

  refresh() {
    this.getMyResource.reload();
  }

  private readonly _categories = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromAgendaEventCategoriesDtosToAgendaEventCategories(resource.data)
      : [];
  });

  categories = computed(() => this._categories());
  itemCount = computed(() =>
    this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0
  );
  isLoading = computed(() => this.getMyResource.isLoading());

  public isAddingOrEditing = signal(false);
  public categoryToEdit = signal<AgendaEventCategoryDto | null>(null);
  public isLoadingCreateOrEdit: boolean = false;

  public create(
    name: string,
    color: string,
    isAutomaticallyEveryWeek: boolean,
    isAutomaticallyEveryMonth: boolean,
    isAutomaticallyEveryYear: boolean
  ) {
    const body = {
      name,
      color,
      isAutomaticallyEveryWeek,
      isAutomaticallyEveryMonth,
      isAutomaticallyEveryYear,
    };
    this.isLoadingCreateOrEdit = true;
    return this.httpClient
      .post<AgendaEventCategoryDto>(
        `${environment.apiUrl}events-categories`,
        body
      )
      .pipe(map(mapFromAgendaEventCategoryDtoToAgendaEventCategory))
      .subscribe({
        next: (category: AgendaEventCategory) => {
          this.isLoadingCreateOrEdit = false;
          this.isAddingOrEditing.set(false);
          this.notificationService.showSuccess(
            'Succès',
            'Catégorie créée avec succès'
          );
          this._categories.update((categories) => [category, ...categories]);
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            'Erreur lors de la création de la catégorie'
          );
          this.isLoadingCreateOrEdit = false;
        },
      });
  }

  edit(
    id: string,
    name: string,
    color: string,
    isAutomaticallyEveryWeek: boolean,
    isAutomaticallyEveryMonth: boolean,
    isAutomaticallyEveryYear: boolean
  ) {
    const body = {
      name,
      color,
      isAutomaticallyEveryWeek,
      isAutomaticallyEveryMonth,
      isAutomaticallyEveryYear,
    };
    this.isLoadingCreateOrEdit = true;
    return this.httpClient
      .put<AgendaEventCategoryDto>(
        `${environment.apiUrl}events-categories/${id}`,
        body
      )
      .pipe(map(mapFromAgendaEventCategoryDtoToAgendaEventCategory))
      .subscribe({
        next: (category: AgendaEventCategory) => {
          this.isLoadingCreateOrEdit = false;
          this.isAddingOrEditing.set(false);
          this.notificationService.showSuccess(
            'Succès',
            'Catégorie modifiée avec succès'
          );
          this._categories.update((categories) =>
            categories.map((c) => (c.id === category.id ? category : c))
          );
          this.categoryToEdit.set(null);
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            'Erreur lors de la modification de la catégorie'
          );
          this.isLoadingCreateOrEdit = false;
        },
      });
  }

  delete(id: string) {
    return this.httpClient
      .delete(`${environment.apiUrl}events-categories/${id}`)
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Succès',
            'Catégorie supprimée avec succès'
          );
          this._categories.update((categories) =>
            categories.filter((category) => category.id !== id)
          );
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            'Erreur lors de la suppression de la catégorie'
          );
        },
      });
  }
}
