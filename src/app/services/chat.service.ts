import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ChatResponse, HealthChatRequest } from '../models/ChatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}


  sendHealthMessage(request: HealthChatRequest): Observable<string> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/health`, request).pipe(
      retry(1),
      map(res => res.message),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while communicating with the chatbot.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    console.error('ChatService error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
