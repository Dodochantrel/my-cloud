import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CookieService } from './cookie.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly httpClient: HttpClient, private readonly cookieService: CookieService, private readonly router: Router, private readonly notificationService: NotificationService) { }

  login(email: string, password: string, rememberMe: boolean) {
    return this.httpClient.post(`${environment.apiUrl}authentications/login`, { email, password, rememberMe }, { withCredentials: true });
  }

  register(email: string, firstName: string, lastName: string, password: string) {
    return this.httpClient.post(`${environment.apiUrl}authentications/register`, { email, firstName, lastName, password });
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

  logout() {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.cookieService.delete('user');
    this.notificationService.showInfo('Déconnexion réussie', 'Vous avez été déconnecté avec succès.');
    this.router.navigate(['/auth/login']);
  }
}
