// import { Injectable, signal, computed, effect } from '@angular/core';
// import { UserProfile } from '../models/UserProfile.model';

// interface AppState {
//   version: number;
//   userProfile: UserProfile | null;
//   recommendation: SportRecommendation | null;
//   lastUpdated: Date;
// }

// const CURRENT_STATE_VERSION = 1;
// const STATE_KEY = 'app_state_v' + CURRENT_STATE_VERSION;

// @Injectable({
//   providedIn: 'root'
// })
// export class StateManagementService {
//   private userProfileSignal = signal<UserProfile | null>(null);
//   private recommendationSignal = signal<SportRecommendation | null>(null);

//   readonly userProfile = this.userProfileSignal.asReadonly();
//   readonly recommendation = this.recommendationSignal.asReadonly();

//   readonly hasProfile = computed(() => this.userProfileSignal() !== null);
//   readonly hasRecommendation = computed(() => this.recommendationSignal() !== null);
//   readonly isComplete = computed(() =>
//     this.hasProfile() && this.hasRecommendation()
//   );

//   constructor() {
//     this.loadState();

//     effect(() => {
//       const state: AppState = {
//         version: CURRENT_STATE_VERSION,
//         userProfile: this.userProfileSignal(),
//         recommendation: this.recommendationSignal(),
//         lastUpdated: new Date()
//       };
//       this.saveState(state);
//     });
//   }

//   setUserProfile(profile: UserProfile | null): void {
//     this.userProfileSignal.set(profile);
//   }

//   updateUserProfile(updates: Partial<UserProfile>): void {
//     const current = this.userProfileSignal();
//     if (current) {
//       this.userProfileSignal.set({ ...current, ...updates });
//     }
//   }

//   setRecommendation(recommendation: SportRecommendation | null): void {
//     this.recommendationSignal.set(recommendation);
//   }


//   clearState(): void {
//     this.userProfileSignal.set(null);
//     this.recommendationSignal.set(null);
//     localStorage.removeItem(STATE_KEY);
//   }

//   private saveState(state: AppState): void {
//     try {
//       const compressed = this.compressState(state);
//       localStorage.setItem(STATE_KEY, compressed);
//     } catch (error) {
//       console.error('Failed to save state:', error);
//       this.clearOldStateVersions();
//     }
//   }

//   private loadState(): void {
//     try {
//       const compressed = localStorage.getItem(STATE_KEY);
//       if (!compressed) return;

//       const state = this.decompressState(compressed);

//       if (state.version !== CURRENT_STATE_VERSION) {
//         console.warn('State version mismatch, clearing old state');
//         this.clearState();
//         return;
//       }

//       if (state.userProfile) {
//         this.userProfileSignal.set(state.userProfile);
//       }
//       if (state.recommendation) {
//         this.recommendationSignal.set(state.recommendation);
//       }
//     } catch (error) {
//       console.error('Failed to load state:', error);
//       this.clearState();
//     }
//   }

//   private compressState(state: AppState): string {
//     return JSON.stringify(state);
//   }

//   private decompressState(compressed: string): AppState {
//     return JSON.parse(compressed);
//   }

//   private clearOldStateVersions(): void {
//     const keys = Object.keys(localStorage);
//     keys.forEach(key => {
//       if (key.startsWith('app_state_v') && key !== STATE_KEY) {
//         localStorage.removeItem(key);
//       }
//     });
//   }

//   private migrateState(oldState: any, oldVersion: number): AppState {
//     return oldState;
//   }
// }
