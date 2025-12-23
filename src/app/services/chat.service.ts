import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ChatRequest, ChatResponse, ChatMessage } from '../models/ChatMessage.model';
import { UserProfile } from '../models/UserProfile.model';
import { SportRecommendation } from '../models/SportRecommendation.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(
    userProfile: UserProfile,
    recommendation: SportRecommendation,
    conversationHistory: ChatMessage[],
    userMessage: string
  ): Observable<ChatResponse> {
    const request: ChatRequest = {
      userProfile,
      recommendation,
      conversationHistory,
      userMessage
    };

    return this.http.post<ChatResponse>(this.apiUrl, request).pipe(
      retry(2),
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
