import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { Paginated } from '../class/paginated';
import { map, Observable } from 'rxjs';
import { Group } from '../class/group';
import {
  GroupDto,
  mapFromDtosToGroups,
  mapFromGroupDtoToGroup,
} from '../dto/group.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly notificationService: NotificationService
  ) {
    effect(() => {
      const resource = this.getMyResource.value();
      if (resource) {
        this._groups.set(mapFromDtosToGroups(resource.data));
      }
    });
  }

  public search = signal<string>('');
  public page = signal(1);
  public limit = signal(20);

  private readonly _groups = signal<Group[]>([]);
  groups = computed(() => this._groups());
  itemCount = computed(() => this.getMyResource.value()?.meta.itemCount ?? 0);
  isLoading = computed(() => this.getMyResource.isLoading());

  private getMyResource = httpResource<PaginatedDto<GroupDto>>(
    () =>
      `${
        environment.apiUrl
      }groups?search=${this.search()}&page=${this.page()}&limit=${this.limit()}`
  );

  refresh() {
    this.getMyResource.reload();
  }

  getAllMinimal(): Observable<Group[]> {
    return this.httpClient
      .get<GroupDto[]>(`${environment.apiUrl}groups/minimal`)
      .pipe(map((response: GroupDto[]) => mapFromDtosToGroups(response)));
  }

  delete(id: number) {
    return this.httpClient.delete<void>(`${environment.apiUrl}groups/${id}`).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Groupe supprimé',
          `Le groupe a été supprimé avec succès`
        );
        this._groups.update((groups) => groups.filter((group) => group.id !== id));
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la suppression du groupe',
          error.message
        );
      },
    });
  }

  edit(id: number, name: string): Observable<Group> {
    return this.httpClient
      .patch<GroupDto>(`${environment.apiUrl}groups/${id}`, { name })
      .pipe(map((response: GroupDto) => mapFromDtosToGroups([response])[0]));
  }

  addUser(id: number, userId: number) {
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups/${id}/add-user`, { userId })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)))
      .subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Utilisateur ajouté au groupe',
            `L'utilisateur a été ajouté au groupe ${response.name}`
          );
          this.managingUsersGroup.update((group) =>
            group
              ? {
                  ...group,
                  users: response.users
                }
              : group
          );
          this._groups.update((groups) =>
            groups.map((group) => (group.id === response.id ? response : group))
          );
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de l'ajout de l'utilisateur au groupe",
            error.message
          );
        },
      });
  }

  removeUser(id: number, userId: number) {
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups/${id}/remove-user`, {
        userId,
      })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)))
      .subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Utilisateur supprimé du groupe',
            `L'utilisateur a été supprimé du groupe ${
              this.managingUsersGroup()?.name
            }`
          );
          this.managingUsersGroup.update((group) =>
            group
              ? {
                  ...group,
                  users: group.users.filter((user) => user.id !== userId),
                }
              : group
          );
          this._groups.update((groups) =>
            groups.map((group) => (group.id === response.id ? response : group))
          );
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de la suppression de l'utilisateur du groupe",
            error.message
          );
        },
      });
  }

  public isCreating: boolean = false;
  public isLoadingCreate: boolean = false;

  create(name: string, usersId: number[]) {
    this.isLoadingCreate = true;
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups`, { name, usersId })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)))
      .subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Groupe créé avec succès',
            'Le groupe a été créé avec succès'
          );
          this._groups.update((groups) => [response, ...groups]);
        },
        error: (error) => {
          this.isLoadingCreate = false;
          this.notificationService.showError(
            'Erreur lors de la création du groupe',
            error.message
          );
        },
        complete: () => {
          this.isLoadingCreate = false;
        },
      });
  }

  public isManagingGroupUsers = signal<boolean>(false);
  public managingUsersGroup = signal<Group | null>(null);
}
