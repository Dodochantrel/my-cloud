import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

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
}
