import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient, private readonly cookieService: CookieService) { }

  login(email: string, password: string) {
    return this.httpClient.post(`${environment.apiUrl}authentications/login`, { email, password }, { withCredentials: true });
  }

  refreshAccessToken() {
    return this.httpClient.post(`${environment.apiUrl}authentications/refresh`, {}, {
      withCredentials: true
    });
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get('accessToken');
    if (token) {
      return true;
    }
    return false;
  }
}
