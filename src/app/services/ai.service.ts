import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { SportRecommendation } from '../models/SportRecommendation.model';
import { UserProfile } from '../models/UserProfile.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = environment.apiUrl;

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
