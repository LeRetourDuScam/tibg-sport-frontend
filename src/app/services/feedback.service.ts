import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { firstValueFrom } from 'rxjs';

export type FeedbackRating = 'perfect' | 'good' | 'meh' | 'bad';

export interface Feedback {
  rating: FeedbackRating;
  comment: string;
  sport: string;
  score: number;
  userId?: string;
  context?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly apiUrl = `${environment.apiUrl}/feedback`;

  constructor(private http: HttpClient) {}

  async submitFeedback(feedback: Feedback): Promise<void> {
    await firstValueFrom(
      this.http.post(this.apiUrl, feedback)
    );
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return await firstValueFrom(
      this.http.get<Feedback[]>(this.apiUrl)
    );
  }
}
