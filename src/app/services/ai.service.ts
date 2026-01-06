import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { SportRecommendation } from '../models/SportRecommendation.model';
import { UserProfile } from '../models/UserProfile.model';
import { TrainingPlan } from '../models/TrainingPlan.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  analyzeProfile(profile: UserProfile): Observable<SportRecommendation> {
    return this.http.post<SportRecommendation>(`${this.apiUrl}/analyze`, profile);
  }

  getTrainingPlan(profile: UserProfile, sport: string): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(`${this.apiUrl}/training-plan`, { profile, sport });
  }

  getCorrespondingImage(sport: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/sport-image/${encodeURIComponent(sport)}`);

  }
}
