import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './config.prime';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { fr } from "primelocale/fr.json";
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { HttpUnauthorizedInterceptor } from './interceptors/http-unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([BearerTokenInterceptor, HttpUnauthorizedInterceptor]), withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    providePrimeNG({
      translation: fr,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none'
        }
      },
    }),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ],
};
