import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';
import { defaultUser, User } from '../class/user';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(private cookieService: NgxCookieService) {}

  public set(key: string, data: string) {
    this.cookieService.set(key, data);
  }

  public get(key: string): string {
    return this.cookieService.get(key);
  }

  public delete(key: string) {
    this.cookieService.delete(key);
  }

  public setUser(user: User) {
    this.set('user', JSON.stringify(user));
  }

  public getUser(): User | null {
    const userData = this.get('user');
    if (!userData) return null;
  
    const plain = JSON.parse(userData);
    return Object.assign(defaultUser, plain);
  }
}
