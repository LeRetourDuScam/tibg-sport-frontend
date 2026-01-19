import { Injectable } from '@angular/core';
import {
  HealthQuestion,
  HealthAnswer,
  HealthQuestionnaireResult,
  HealthCategory,
  HealthLevel,
  CategoryScore,
  RiskFactor,
  HEALTH_QUESTIONS,
  getQuestionsByCategory
} from '../models/HealthQuestionnaire.model';

@Injectable({
  providedIn: 'root'
})
export class HealthScoreService {
  private readonly STORAGE_KEY = 'health_questionnaire_result';

  constructor() {}

  /**
   * Récupère toutes les questions du questionnaire
   */
  getQuestions(): HealthQuestion[] {
    return HEALTH_QUESTIONS;
  }

  /**
   * Récupère les questions groupées par catégorie
   */
  getQuestionsByCategory(): Map<HealthCategory, HealthQuestion[]> {
    return getQuestionsByCategory();
  }

  /**
   * Calcule le score total et les résultats détaillés
   */
  calculateResults(answers: HealthAnswer[]): HealthQuestionnaireResult {
    const categoryScores = this.calculateCategoryScores(answers);
    const totalScore = this.calculateTotalScore(answers);
    const maxPossibleScore = this.calculateMaxPossibleScore();
    const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);
    const healthLevel = this.determineHealthLevel(scorePercentage);
    const riskFactors = this.identifyRiskFactors(answers);
    const recommendations = this.generateRecommendations(healthLevel, categoryScores, riskFactors);

    const result: HealthQuestionnaireResult = {
      answers,
      totalScore,
      maxPossibleScore,
      scorePercentage,
      healthLevel,
      categoryScores,
      riskFactors,
      recommendations,
      completedAt: new Date()
    };

    this.saveResult(result);

    return result;
  }

  /**
   * Calcule le score total pondéré
   */
  private calculateTotalScore(answers: HealthAnswer[]): number {
    let totalScore = 0;

    answers.forEach(answer => {
      const question = HEALTH_QUESTIONS.find(q => q.id === answer.questionId);
      if (question) {
        totalScore += answer.points * question.weight;
      }
    });

    return totalScore;
  }

  /**
   * Calcule le score maximum possible
   */
  private calculateMaxPossibleScore(): number {
    return HEALTH_QUESTIONS.reduce((total, question) => {
      const maxPoints = question.options
        ? Math.max(...question.options.map(o => o.points))
        : 10;
      return total + (maxPoints * question.weight);
    }, 0);
  }

  /**
   * Calcule les scores par catégorie
   */
  private calculateCategoryScores(answers: HealthAnswer[]): CategoryScore[] {
    const categories: HealthCategory[] = [
      'cardiovascular', 'musculoskeletal', 'respiratory',
      'metabolic', 'lifestyle', 'physical-activity', 'mental-health'
    ];

    return categories.map(category => {
      const categoryQuestions = HEALTH_QUESTIONS.filter(q => q.category === category);
      const categoryAnswers = answers.filter(a =>
        categoryQuestions.some(q => q.id === a.questionId)
      );

      let score = 0;
      let maxScore = 0;

      categoryQuestions.forEach(question => {
        const answer = categoryAnswers.find(a => a.questionId === question.id);
        const maxPoints = question.options
          ? Math.max(...question.options.map(o => o.points))
          : 10;

        maxScore += maxPoints * question.weight;
        if (answer) {
          score += answer.points * question.weight;
        }
      });

      return {
        category,
        score,
        maxScore,
        percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
      };
    }).filter(cs => cs.maxScore > 0); // Exclure les catégories sans questions
  }

  /**
   * Détermine le niveau de santé basé sur le pourcentage
   */
  private determineHealthLevel(percentage: number): HealthLevel {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'moderate';
    if (percentage >= 40) return 'needs-improvement';
    return 'at-risk';
  }

  /**
   * Identifie les facteurs de risque
   */
  private identifyRiskFactors(answers: HealthAnswer[]): RiskFactor[] {
    const riskFactors: RiskFactor[] = [];

    answers.forEach(answer => {
      const question = HEALTH_QUESTIONS.find(q => q.id === answer.questionId);
      if (!question) return;

      const selectedOption = question.options?.find(o => o.value === answer.value);

      if (selectedOption?.riskLevel === 'high') {
        riskFactors.push({
          id: `risk-${question.id}`,
          description: this.getRiskDescription(question.id, answer.value),
          severity: 'high',
          relatedQuestionId: question.id
        });
      } else if (selectedOption?.riskLevel === 'moderate' && selectedOption.points < 5) {
        riskFactors.push({
          id: `risk-${question.id}`,
          description: this.getRiskDescription(question.id, answer.value),
          severity: 'moderate',
          relatedQuestionId: question.id
        });
      }
    });

    return riskFactors;
  }

  /**
   * Génère une description du facteur de risque
   */
  private getRiskDescription(questionId: string, value: any): string {
    const descriptions: Record<string, string> = {
      'cardio-1': 'HEALTH.RISK_DESCRIPTIONS.cardio-1',
      'cardio-2': 'HEALTH.RISK_DESCRIPTIONS.cardio-2',
      'cardio-3': 'HEALTH.RISK_DESCRIPTIONS.cardio-3',
      'cardio-4': 'HEALTH.RISK_DESCRIPTIONS.cardio-4',
      'cardio-5': 'HEALTH.RISK_DESCRIPTIONS.cardio-5',
      'musculo-1': 'HEALTH.RISK_DESCRIPTIONS.musculo-1',
      'musculo-2': 'HEALTH.RISK_DESCRIPTIONS.musculo-2',
      'musculo-3': 'HEALTH.RISK_DESCRIPTIONS.musculo-3',
      'metabolic-1': 'HEALTH.RISK_DESCRIPTIONS.metabolic-1',
      'metabolic-2': 'HEALTH.RISK_DESCRIPTIONS.metabolic-2',
      'lifestyle-1': 'HEALTH.RISK_DESCRIPTIONS.lifestyle-1',
      'lifestyle-2': 'HEALTH.RISK_DESCRIPTIONS.lifestyle-2',
      'lifestyle-3': 'HEALTH.RISK_DESCRIPTIONS.lifestyle-3',
      'activity-1': 'HEALTH.RISK_DESCRIPTIONS.activity-1',
      'activity-2': 'HEALTH.RISK_DESCRIPTIONS.activity-2',
      'activity-3': 'HEALTH.RISK_DESCRIPTIONS.activity-3',
      'activity-4': 'HEALTH.RISK_DESCRIPTIONS.activity-4',
      'mental-1': 'HEALTH.RISK_DESCRIPTIONS.mental-1',
      'mental-2': 'HEALTH.RISK_DESCRIPTIONS.mental-2',
      'mental-3': 'HEALTH.RISK_DESCRIPTIONS.mental-3'
    };

    return descriptions[questionId] || 'HEALTH.RISK_DESCRIPTIONS.default';
  }

  /**
   * Génère des recommandations personnalisées
   */
  private generateRecommendations(
    healthLevel: HealthLevel,
    categoryScores: CategoryScore[],
    riskFactors: RiskFactor[]
  ): string[] {
    const recommendations: string[] = [];

    switch (healthLevel) {
      case 'at-risk':
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.at-risk.1');
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.at-risk.2');
        break;
      case 'needs-improvement':
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.needs-improvement.1');
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.needs-improvement.2');
        break;
      case 'moderate':
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.moderate.1');
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.moderate.2');
        break;
      case 'good':
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.good.1');
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.good.2');
        break;
      case 'excellent':
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.excellent.1');
        recommendations.push('HEALTH.RECOMMENDATIONS.LEVEL.excellent.2');
        break;
    }

    const weakCategories = categoryScores
      .filter(cs => cs.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage);

    weakCategories.slice(0, 3).forEach(cat => {
      recommendations.push(this.getCategoryRecommendation(cat.category));
    });

    const highRisks = riskFactors.filter(r => r.severity === 'high');
    if (highRisks.length > 0) {
      recommendations.push('HEALTH.RECOMMENDATIONS.HIGH_RISK_WARNING');
    }

    return recommendations;
  }

  /**
   * Génère une recommandation spécifique pour une catégorie
   */
  private getCategoryRecommendation(category: HealthCategory): string {
    const keys: Record<HealthCategory, string> = {
      'cardiovascular': 'HEALTH.RECOMMENDATIONS.CATEGORY.cardiovascular',
      'musculoskeletal': 'HEALTH.RECOMMENDATIONS.CATEGORY.musculoskeletal',
      'respiratory': 'HEALTH.RECOMMENDATIONS.CATEGORY.respiratory',
      'metabolic': 'HEALTH.RECOMMENDATIONS.CATEGORY.metabolic',
      'lifestyle': 'HEALTH.RECOMMENDATIONS.CATEGORY.lifestyle',
      'physical-activity': 'HEALTH.RECOMMENDATIONS.CATEGORY.physical-activity',
      'mental-health': 'HEALTH.RECOMMENDATIONS.CATEGORY.mental-health'
    };

    return keys[category];
  }

  /**
   * Sauvegarde le résultat dans le localStorage
   */
  saveResult(result: HealthQuestionnaireResult): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(result));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du résultat:', error);
    }
  }

  /**
   * Récupère le dernier résultat sauvegardé
   */
  getSavedResult(): HealthQuestionnaireResult | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const result = JSON.parse(saved) as HealthQuestionnaireResult;
        result.completedAt = new Date(result.completedAt);
        return result;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du résultat:', error);
    }
    return null;
  }

  /**
   * Supprime le résultat sauvegardé
   */
  clearSavedResult(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Vérifie si un résultat récent existe (moins de 30 jours)
   */
  hasRecentResult(): boolean {
    const result = this.getSavedResult();
    if (!result) return false;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return result.completedAt > thirtyDaysAgo;
  }

  /**
   * Calcule les points pour une réponse
   */
  getPointsForAnswer(questionId: string, value: any): number {
    const question = HEALTH_QUESTIONS.find(q => q.id === questionId);
    if (!question) return 0;

    const option = question.options?.find(o => o.value === value);
    return option?.points ?? 0;
  }
}
