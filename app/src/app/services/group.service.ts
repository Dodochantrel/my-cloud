import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../class/paginated';
import { map, Observable } from 'rxjs';
import { Group } from '../class/group';
import {
  GroupDto,
  mapFromDtosToGroups,
  mapFromGroupDtoToGroup,
} from '../dto/group.dto';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(
    search: string,
    page: number,
    limit: number
  ): Observable<Paginated<Group>> {
    return this.httpClient
      .get<PaginatedDto<GroupDto>>(
        `${environment.apiUrl}groups?search=${search}&page=${page}&limit=${limit}`
      )
      .pipe(
        map((response: PaginatedDto<GroupDto>) => {
          return new Paginated<Group>(
            mapFromDtosToGroups(response.data),
            response.meta
          );
        })
      );
  }

  getAllMinimal(): Observable<Group[]> {
    return this.httpClient
      .get<GroupDto[]>(`${environment.apiUrl}groups/minimal`)
      .pipe(map((response: GroupDto[]) => mapFromDtosToGroups(response)));
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}groups/${id}`);
  }

  edit(id: number, name: string): Observable<Group> {
    return this.httpClient
      .patch<GroupDto>(`${environment.apiUrl}groups/${id}`, { name })
      .pipe(map((response: GroupDto) => mapFromDtosToGroups([response])[0]));
  }

  addUser(id: number, userId: number): Observable<Group> {
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups/${id}/add-user`, { userId })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)));
  }

  removeUser(id: number, userId: number): Observable<Group> {
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups/${id}/remove-user`, {
        userId,
      })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)));
  }

  create(name: string, usersId: number[]): Observable<Group> {
    return this.httpClient
      .post<GroupDto>(`${environment.apiUrl}groups`, { name, usersId })
      .pipe(map((response: GroupDto) => mapFromGroupDtoToGroup(response)));
  }
}
