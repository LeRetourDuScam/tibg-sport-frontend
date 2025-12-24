import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarConfig {
  message: string;
  type: SnackbarType;
  duration?: number;
  action?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSubject = new Subject<SnackbarConfig>();
  public snackbar$ = this.snackbarSubject.asObservable();

  show(message: string, type: SnackbarType = 'info', duration: number = 4000, action?: string) {
    this.snackbarSubject.next({ message, type, duration, action });
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }
}
