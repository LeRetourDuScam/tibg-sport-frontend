import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    // Retry failed requests (except for POST/PUT/DELETE) up to 2 times with exponential backoff
    retry({
      count: 2,
      delay: (error, retryCount) => {
        // Only retry on network errors or 5xx errors, and only for GET requests
        if (req.method === 'GET' && (error.status === 0 || error.status >= 500)) {
          const delayMs = Math.pow(2, retryCount) * 1000; // 2s, 4s
          console.log(`Retrying request (attempt ${retryCount + 1}) in ${delayMs}ms...`);
          return timer(delayMs);
        }
        // Don't retry
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = translate.instant('ERRORS.NETWORK_ERROR');
        console.error('Client error:', error.error.message);
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = translate.instant('ERRORS.NETWORK_ERROR');
            break;
          case 400:
            errorMessage = error.error?.error || translate.instant('ERRORS.BAD_REQUEST');
            break;
          case 401:
            errorMessage = translate.instant('ERRORS.UNAUTHORIZED');
            break;
          case 403:
            errorMessage = translate.instant('ERRORS.FORBIDDEN');
            break;
          case 404:
            errorMessage = translate.instant('ERRORS.NOT_FOUND');
            break;
          case 429:
            errorMessage = translate.instant('ERRORS.RATE_LIMIT');
            break;
          case 500:
            errorMessage = translate.instant('ERRORS.SERVER_ERROR');
            break;
          case 503:
            errorMessage = translate.instant('ERRORS.SERVICE_UNAVAILABLE');
            break;
          default:
            errorMessage = translate.instant('ERRORS.UNKNOWN_ERROR');
        }

        console.error(`Server error: ${error.status}`, error.error);
      }

      // Show error message to user
      snackbar.error(errorMessage);

      return throwError(() => error);
    })
  );
};
