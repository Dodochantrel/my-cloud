import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { Tasting } from '../class/tasting';
import { map, Observable } from 'rxjs';
import {
  mapFromDtosToTastings,
  mapFromDtoToTasting,
  TastingDto,
} from '../dto/tasting.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment.development';
import { FileWidth } from '../tools/file-width.type';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class TastingService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  //! --- Filtrage / Pagination ---
  public search = signal<string>('');
  public categoriesId = signal<number[] | null>(null);
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<TastingDto>>(
    () =>
      `${environment.apiUrl}tastings?search=${this.search()}&page=${this.page()}&limit=${this.limit()}&categoryId=${
        this.categoriesId() || ''
      }`
  );

  tastings = linkedSignal(() => {
    const resource = this.getMyResource.value();
    return resource
      ? mapFromDtosToTastings(resource.data)
      : [];
  });
  itemCount = computed(() => this.getMyResource.value()?.meta.itemCount ?? 0);
  isLoading = computed(() => this.getMyResource.isLoading());

  refresh() {
    this.getMyResource.reload();
  }

  //! --- CRUD ---
  add(
    name: string,
    categoryId: number,
    rating: number,
    description: string,
    file: File
  ) {
    this.isLoadingEditOrAdd = true;
    return this.httpClient
      .post<TastingDto>(`${environment.apiUrl}tastings`, {
        name,
        categoryId,
        rating,
        description,
      })
      .pipe(map(mapFromDtoToTasting))
      .subscribe({
        next: (tasting) => {
          this.notificationService.showSuccess(
            'Succès',
            `La dégustation a été ajoutée avec succès`
          );
          this.uploadFile(tasting.id, file);
          this.tastings.update((current) => [...current, tasting]);
          this.isLoadingEditOrAdd = false;
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            `La dégustation n'a pas pu être ajoutée`
          );
          this.isLoadingEditOrAdd = false;
        },
      });
  }

  edit(
    id: number,
    name: string,
    categoryId: number,
    rating: number,
    description: string,
    file: File
  ) {
    this.isLoadingEditOrAdd = true;
    return this.httpClient
      .patch<TastingDto>(`${environment.apiUrl}tastings/${id}`, {
        name,
        categoryId,
        rating,
        description,
      })
      .pipe(map(mapFromDtoToTasting))
      .subscribe({
        next: (tasting) => {
          tasting.fileBlobUrl = this.previewUrl;
          this.uploadFile(tasting.id, file);

          this.tastings.update((current) =>
            current.map((t) => (t.id === tasting.id ? tasting : t))
          );

          this.notificationService.showSuccess(
            'Succès',
            `La dégustation a été modifiée avec succès`
          );
          this.isLoadingEditOrAdd = false;
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            `La dégustation n'a pas pu être modifiée`
          );
          this.isLoadingEditOrAdd = false;
        },
      });
  }

  delete(id: number) {
    return this.httpClient
      .delete<void>(`${environment.apiUrl}tastings/${id}`)
      .subscribe({
        next: () => {
          this.tastings.update((current) =>
            current.filter((t) => t.id !== id)
          );
          this.notificationService.showSuccess(
            'Succès',
            'Dégustation supprimée avec succès'
          );
        },
        error: () => {
          this.notificationService.showError(
            'Erreur',
            'Erreur lors de la suppression de la dégustation'
          );
        },
      });
  }

  //! --- Files ---
  uploadFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    return this.httpClient
      .post(`${environment.apiUrl}tastings/file`, formData, {
        responseType: 'blob',
      })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Image enregistrée',
            "L'image a été enregistrée avec succès."
          );
        },
        error: () => {
          this.notificationService.showError(
            "Erreur lors de l'enregistrement de l'image",
            "Une erreur est survenue lors de l'enregistrement de l'image."
          );
        },
      });
  }

  getFile(id: number, width: FileWidth): Observable<Blob> {
    return this.httpClient.get(
      `${environment.apiUrl}tastings/file/${id}?width=${width}`,
      {
        responseType: 'blob',
      }
    );
  }

  //! --- UI State ---
  public isDisplayedCreateOrEdit: boolean = false;
  public isLoadingEditOrAdd: boolean = false;
  public previewUrl: string | null = null;
  public tastingToEdit = signal<Tasting | null>(null);
}
