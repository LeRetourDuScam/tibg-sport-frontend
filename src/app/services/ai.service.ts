import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  legLength: number;
  armLength: number;
  waistSize: number;
  activityLevel: string;
  exerciseFrequency: string;
  jointProblems: boolean;
  kneeProblems: boolean;
  backProblems: boolean;
  heartProblems: boolean;
  otherHealthIssues: string;
  mainGoal: string;
  practisedSports: string;
  locationPreference: string;
  teamPreference: string;
  availableTime: string;
  language: string;
}

export interface Exercise {
  name: string;
  description: string;
  duration?: string;
  repetitions?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface SportRecommendation {
  sport: string;
  score: number;
  reason: string;
  explanation: string;
  benefits: string[];
  precautions: string[];
  exercises: Exercise[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Sends the user profile to the local AI model for analysis
   * @param profile The user profile to analyze
   * @returns Observable containing the sport recommendation
   */
  analyzeProfile(profile: UserProfile): Observable<SportRecommendation> {
    return this.http.post<SportRecommendation>(`${this.apiUrl}/analyze`, profile);
  }

  getCorrespondingImage(sport: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/sport-image/${encodeURIComponent(sport)}`);
  
  }
}
