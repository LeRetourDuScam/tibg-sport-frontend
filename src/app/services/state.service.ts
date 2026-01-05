import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SportRecommendation } from '../models/SportRecommendation.model';
import { UserProfile } from '../models/UserProfile.model';

interface AppState {
  currentRecommendation: SportRecommendation | null;
  currentUserProfile: UserProfile | null;
  formProgress: any | null;
  lastUpdated: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly STORAGE_KEY = 'fytai_app_state';

  private stateSubject = new BehaviorSubject<AppState>(this.loadState());
  public state$ = this.stateSubject.asObservable();

  constructor() {
    // Auto-save state to sessionStorage on changes
    this.state$.subscribe(state => {
      this.saveState(state);
    });
  }

  // Load state from sessionStorage
  private loadState(): AppState {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null
        };
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }

    return {
      currentRecommendation: null,
      currentUserProfile: null,
      formProgress: null,
      lastUpdated: null
    };
  }

  // Save state to sessionStorage
  private saveState(state: AppState): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Get current state snapshot
  getCurrentState(): AppState {
    return this.stateSubject.value;
  }

  // Set recommendation and profile
  setRecommendation(recommendation: SportRecommendation, profile: UserProfile): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      currentRecommendation: recommendation,
      currentUserProfile: profile,
      lastUpdated: new Date()
    });
  }

  // Get current recommendation
  getRecommendation(): SportRecommendation | null {
    return this.stateSubject.value.currentRecommendation;
  }

  // Get current profile
  getProfile(): UserProfile | null {
    return this.stateSubject.value.currentUserProfile;
  }

  // Update form progress
  setFormProgress(progress: any): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      formProgress: progress,
      lastUpdated: new Date()
    });
  }

  // Get form progress
  getFormProgress(): any | null {
    return this.stateSubject.value.formProgress;
  }

  // Clear all state
  clearState(): void {
    this.stateSubject.next({
      currentRecommendation: null,
      currentUserProfile: null,
      formProgress: null,
      lastUpdated: null
    });
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  // Clear only form progress
  clearFormProgress(): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      formProgress: null
    });
  }

  // Check if there's saved data
  hasRecommendation(): boolean {
    return this.stateSubject.value.currentRecommendation !== null;
  }
}
