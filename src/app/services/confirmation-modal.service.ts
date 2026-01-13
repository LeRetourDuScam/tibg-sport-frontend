import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: 'danger' | 'primary' | 'warning';
}

export interface ConfirmationModalResult {
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  private modalSubject = new Subject<ConfirmationModalConfig>();
  private responseSubject = new Subject<ConfirmationModalResult>();

  public modal$ = this.modalSubject.asObservable();
  public response$ = this.responseSubject.asObservable();

  confirm(config: ConfirmationModalConfig): Observable<ConfirmationModalResult> {
    this.modalSubject.next(config);
    return new Observable(observer => {
      const subscription = this.responseSubject.subscribe(result => {
        observer.next(result);
        observer.complete();
        subscription.unsubscribe();
      });
    });
  }

  respond(confirmed: boolean): void {
    this.responseSubject.next({ confirmed });
  }
}
