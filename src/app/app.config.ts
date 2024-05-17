import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // para funcionar com interceptor de classe
    provideAnimationsAsync(),
    JwtHelperService,
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ]
};

