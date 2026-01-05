import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: (error, retryCount) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
              const delay = this.RETRY_DELAY * Math.pow(2, retryCount - 1);
              console.log(`Retrying request (attempt ${retryCount}/${this.MAX_RETRIES}) after ${delay}ms`);
              return timer(delay);
            }
          }
          throw error;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred. Please try again.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 0:
              errorMessage = 'Unable to connect to the server. Please check your internet connection.';
              break;
            case 400:
              errorMessage = error.error?.error || 'Invalid request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Authentication failed. Please login again.';
              this.authService.logout();
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 429:
              errorMessage = 'Too many requests. Please wait a moment before trying again.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service temporarily unavailable. Please try again later.';
              break;
            default:
              errorMessage = error.error?.error || `Server error: ${error.status}`;
          }
        }

        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
