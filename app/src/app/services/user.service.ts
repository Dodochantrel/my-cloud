import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mapFromDtosToUsers, UserDto } from '../dto/user.dto';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly httpClient: HttpClient) { }

  getMinimalData() {
    return this.httpClient.get<UserDto[]>(`${environment.apiUrl}users/minimal`).pipe(
      map((response: UserDto[]) => {
        return mapFromDtosToUsers(response);
      })
    )
  }
}
