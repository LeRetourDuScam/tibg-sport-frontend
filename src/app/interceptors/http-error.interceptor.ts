import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, timer, mergeMap, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    // Retry logic with exponential backoff for 5xx errors
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry on 5xx server errors or network errors
        if (error.status >= 500 || error.status === 0) {
          const delayMs = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Retry attempt ${retryCount} after ${delayMs}ms`);
          return timer(delayMs);
        }
        // Don't retry on 4xx client errors
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';
      let showSnackbar = true;

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
        console.error('Network error:', error.error.message);
      } else {
        // Backend returned an error response
        const errorCode = error.error?.error?.code;
        const backendMessage = error.error?.error?.message || error.error?.message;

        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
            break;
          case 400:
            errorMessage = backendMessage || 'Données invalides';
            break;
          case 401:
            errorMessage = backendMessage || 'Non autorisé. Veuillez vous connecter.';
            break;
          case 403:
            errorMessage = 'Accès interdit';
            break;
          case 404:
            errorMessage = 'Ressource non trouvée';
            showSnackbar = false; // Don't show snackbar for 404s
            break;
          case 429:
            const retryAfter = error.error?.error?.retryAfter || 60;
            errorMessage = `Trop de requêtes. Réessayez dans ${retryAfter} secondes.`;
            break;
          case 500:
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          case 503:
            errorMessage = 'Service temporairement indisponible. Veuillez réessayer.';
            break;
          default:
            errorMessage = backendMessage || `Erreur ${error.status}`;
        }

        console.error(`HTTP Error ${error.status}:`, {
          code: errorCode,
          message: backendMessage,
          supportId: error.error?.error?.supportId,
          url: req.url
        });
      }

      if (showSnackbar) {
        snackbarService.show(errorMessage, 'error');
      }

      return throwError(() => error);
    })
  );
};
