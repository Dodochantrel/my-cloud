import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post(`${environment.apiUrl}authentications/login`, { email, password }, { withCredentials: true });
  }
}
