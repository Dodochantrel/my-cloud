import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromDtosToUsers, UserDto } from '../dto/user.dto';
import { map, Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { User } from '../class/user';
import { Paginated } from '../class/paginated';
import { PaginatedDto } from '../dto/paginated-response.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly cookieService: CookieService
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

  getAll(page: number, limit: number, search: string = ''): Observable<Paginated<User>> {
    return this.httpClient
      .get<PaginatedDto<UserDto>>(
        `${environment.apiUrl}users?search=${search}&page=${page}&limit=${limit}`
      )
      .pipe(
        map((response: PaginatedDto<UserDto>) => {
          return new Paginated<User>(
            mapFromDtosToUsers(response.data),
            response.meta
          );
        })
      );
  }
}
