import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { Tasting } from '../class/tasting';
import { Paginated } from '../class/paginated';
import { map, Observable } from 'rxjs';
import { mapFromDtosToTastings, mapFromDtoToTasting, TastingDto } from '../dto/tasting.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment.development';
import {
  mapFromDtosToTastingCategories,
  TastingCategoryDto,
} from '../dto/tasting-category.dto';
import { TastingCategory } from '../class/tasting-category';
import { FileWidth } from '../tools/file-width.type';

@Injectable({
  providedIn: 'root',
})
export class TastingService {
  constructor(private readonly httpClient: HttpClient) {}

  getCategories(): Observable<TastingCategory[]> {
    return this.httpClient
      .get<TastingCategoryDto[]>(`${environment.apiUrl}tastings/categories`)
      .pipe(map(mapFromDtosToTastingCategories));
  }  

  public search = signal<string>('');
  public categoriesId = signal<number[] | null>(null);
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<TastingDto>>(
    () => `${environment.apiUrl}tastings?search=${this.search()}&page=${this.page()}&limit=${this.limit()}&categoryId=${this.categoriesId() || ''}`
  );  

  tastings = computed(() => this.getMyResource.value() ? mapFromDtosToTastings(this.getMyResource.value()!.data) : []);
  itemCount = computed(() => this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0);
  isLoading = computed(() => this.getMyResource.isLoading());

  add(name: string, categoryId: number, rating: number, description: string): Observable<Tasting> {
    return this.httpClient
      .post<TastingDto>(`${environment.apiUrl}tastings`, {
        name,
        categoryId,
        rating,
        description,
      })
      .pipe(map(mapFromDtoToTasting));
  }

  uploadFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    return this.httpClient.post(
      `${environment.apiUrl}tastings/file`,
      formData,
      {
        responseType: 'blob',
      }
    );
  }

  getFile(id: number, width: FileWidth): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}tastings/file/${id}?width=${width}`, {
      responseType: 'blob',
    });
  }

  edit(
    id: number,
    name: string,
    categoryId: number,
    rating: number,
    description: string
  ): Observable<Tasting> {
    return this.httpClient
      .patch<TastingDto>(`${environment.apiUrl}tastings/${id}`, {
        name,
        categoryId,
        rating,
        description,
      })
      .pipe(map(mapFromDtoToTasting));
  }
}
