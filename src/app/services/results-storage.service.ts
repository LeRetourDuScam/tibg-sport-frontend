import { Injectable } from '@angular/core';
import { HealthQuestionnaireResult } from '../models/HealthQuestionnaire.model';
import { ExerciseAi } from '../models/ChatMessage.model';

export interface SavedResult {
  id: string;
  timestamp: string;
}

export interface SavedHealthResult {
  id: string;
  type: 'health';
  healthResult: HealthQuestionnaireResult;
  exercises: ExerciseAi[];
  savedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ResultsStorageService {
  private readonly STORAGE_KEY = 'fytai_saved_results';
  private readonly HEALTH_STORAGE_KEY = 'fytai_saved_health_results';
  private readonly MAX_SAVED_RESULTS = 5;

  constructor() { }

  /**
   * Récupère tous les résultats sauvegardés
   */
  getSavedResults(): SavedResult[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
      return [];
    }
  }

  /**
   * Récupère le dernier résultat sauvegardé
   */
  getLatestResult(): SavedResult | null {
    const results = this.getSavedResults();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Récupère un résultat spécifique par ID
   */
  getResultById(id: string): SavedResult | null {
    const results = this.getSavedResults();
    return results.find(result => result.id === id) || null;
  }

  /**
   * Supprime un résultat spécifique
   */
  deleteResult(id: string): boolean {
    try {
      const results = this.getSavedResults();
      const filteredResults = results.filter(result => result.id !== id);

      if (filteredResults.length === results.length) {
        return false; // Aucun résultat supprimé
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredResults));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du résultat:', error);
      return false;
    }
  }

  /**
   * Supprime tous les résultats sauvegardés
   */
  clearAllResults(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les résultats:', error);
    }
  }

  /**
   * Vérifie si l'utilisateur a des résultats sauvegardés
   */
  hasSavedResults(): boolean {
    return this.getSavedResults().length > 0;
  }

  /**
   * Génère un ID unique pour un résultat
   */
  private generateId(): string {
    return `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Obtient le nombre de résultats sauvegardés
   */
  getSavedResultsCount(): number {
    return this.getSavedResults().length;
  }

  /**
   * Vérifie si le stockage local est disponible
   */
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sauvegarde un résultat de santé dans le localStorage
   */
  saveHealthResult(healthResult: SavedHealthResult): string {
    const savedResults = this.getSavedHealthResults();
    savedResults.unshift(healthResult);

    if (savedResults.length > this.MAX_SAVED_RESULTS) {
      savedResults.splice(this.MAX_SAVED_RESULTS);
    }

    try {
      localStorage.setItem(this.HEALTH_STORAGE_KEY, JSON.stringify(savedResults));
      return healthResult.id;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats santé:', error);
      throw new Error('Impossible de sauvegarder les résultats santé.');
    }
  }

  /**
   * Récupère tous les résultats de santé sauvegardés
   */
  getSavedHealthResults(): SavedHealthResult[] {
    try {
      const data = localStorage.getItem(this.HEALTH_STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats santé:', error);
      return [];
    }
  }

  /**
   * Récupère un résultat santé spécifique par ID
   */
  getHealthResultById(id: string): SavedHealthResult | null {
    const results = this.getSavedHealthResults();
    return results.find(result => result.id === id) || null;
  }

  /**
   * Supprime un résultat santé spécifique
   */
  deleteHealthResult(id: string): boolean {
    try {
      const results = this.getSavedHealthResults();
      const filteredResults = results.filter(result => result.id !== id);

      if (filteredResults.length === results.length) {
        return false;
      }

      localStorage.setItem(this.HEALTH_STORAGE_KEY, JSON.stringify(filteredResults));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du résultat santé:', error);
      return false;
    }
  }

  /**
   * Supprime tous les résultats santé sauvegardés
   */
  clearAllHealthResults(): void {
    try {
      localStorage.removeItem(this.HEALTH_STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les résultats santé:', error);
    }
  }
}
