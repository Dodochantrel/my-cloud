import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment';
import { AgendaEventCategoryDto, mapFromAgendaEventCategoryToAgendaEventCategoryDtos } from '../dto/agenda-event-category.dto';

@Injectable({
  providedIn: 'root'
})
export class AgendaEventCategoryService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  public search = signal<string>('');
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<AgendaEventCategoryDto>>(
    () => `${environment.apiUrl}events-categories?search=${this.search()}&page=${this.page()}&limit=${this.limit()}`
  );  

  categories = computed(() => this.getMyResource.value() ? mapFromAgendaEventCategoryToAgendaEventCategoryDtos(this.getMyResource.value()!.data) : []);
  itemCount = computed(() => this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0);
  isLoading = computed(() => this.getMyResource.isLoading());
}
