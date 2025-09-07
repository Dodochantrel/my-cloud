import { HttpClient, httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromDtosToUsers, mapFromUserDtoToUser, UserDto } from '../dto/user.dto';
import { map, Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { User } from '../class/user';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { NotificationService } from './notification.service';
import { findIndexById } from '../tools/update-table';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly cookieService: CookieService,
    private readonly notificationService: NotificationService
  ) {}

  getMinimalData(): Observable<User[]> {
    return this.httpClient
      .get<UserDto[]>(`${environment.apiUrl}users/minimal`)
      .pipe(
        map((response: UserDto[]) => {
          return mapFromDtosToUsers(response);
        })
      );
  }

  getMe() {
    return this.httpClient
      .get<UserDto>(`${environment.apiUrl}users/me`)
      .pipe(
        map((response: UserDto) => {
          return mapFromDtosToUsers([response])[0];
        })
      )
      .subscribe({
        next: (user) => {
          this.cookieService.setUser(user);
        },
      });
  }

  isAdmin(): boolean {
    const user = this.cookieService.getUser();
    if(user && user.roles && user.roles.includes('admin')) {
      return true;
    }
    return false;
  }

  public search = signal<string>('');
  public page = signal(1);
  public limit = signal(20);

  private getMyResource = httpResource<PaginatedDto<UserDto>>(
    () => `${environment.apiUrl}users?search=${this.search()}&page=${this.page()}&limit=${this.limit()}`
  );  

  users = computed(() => this.getMyResource.value() ? mapFromDtosToUsers(this.getMyResource.value()!.data) : []);
  itemCount = computed(() => this.getMyResource.value() ? this.getMyResource.value()!.meta.itemCount : 0);
  isLoading = computed(() => this.getMyResource.isLoading());

  switchAuthorize(user: User) {
    return this.httpClient
      .patch<UserDto>(`${environment.apiUrl}users/authorize`, {
        id: user.id,
        isAuthorized: !user.isAuthorized,
      })
      .pipe(map(mapFromUserDtoToUser)).subscribe({
        next: (updatedUser) => {
          if(updatedUser.isAuthorized == true) {
            this.notificationService.showSuccess(
              'Utilisateur validé avec succès',
              `L'utilisateur ${updatedUser.firstName} est désormais autorisé a accèder à l'application.`
            );
          } else {
            this.notificationService.showInfo(
              'Utilisateur invalidé avec succès',
              `L'utilisateur ${updatedUser.firstName} n'est désormais plus autorisé a accèder à l'application.`
            );
          }
          const index = findIndexById(this.users(), user.id);
          this.users()[index] = updatedUser;
        },
        error: (err) => {
          this.notificationService.showError('Une erreur est survenue', 'Impossible de valider cet utilisateur.');
        }
      });
  }
}
