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
import {
  Exercise,
  ExerciseProgram,
  ExerciseSession,
  SessionExercise,
  getExercisesForHealthLevel,
  getRecommendedExercises,
  EXERCISE_DATABASE
} from '../models/Exercice.model';

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

    // Sauvegarder le résultat
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

    // Recommandations basées sur le niveau global
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

    // Recommandations basées sur les catégories faibles
    const weakCategories = categoryScores
      .filter(cs => cs.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage);

    weakCategories.slice(0, 3).forEach(cat => {
      recommendations.push(this.getCategoryRecommendation(cat.category));
    });

    // Recommandations basées sur les facteurs de risque
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
   * Obtient les exercices recommandés basés sur les résultats
   */
  getRecommendedExercises(result: HealthQuestionnaireResult): Exercise[] {
    const weakCategories = result.categoryScores
      .filter(cs => cs.percentage < 70)
      .map(cs => cs.category);

    return getRecommendedExercises(result.healthLevel, weakCategories);
  }

  /**
   * Génère un programme d'exercices personnalisé
   */
  generateExerciseProgram(result: HealthQuestionnaireResult): ExerciseProgram {
    const weakCategories = result.categoryScores
      .filter(cs => cs.percentage < 70)
      .map(cs => cs.category);

    const recommendedExercises = this.getRecommendedExercises(result);

    // Déterminer la fréquence en fonction du niveau
    let frequencyPerWeek: number;
    let sessionsPerDay: number;

    switch (result.healthLevel) {
      case 'at-risk':
        frequencyPerWeek = 3;
        sessionsPerDay = 3;
        break;
      case 'needs-improvement':
        frequencyPerWeek = 4;
        sessionsPerDay = 4;
        break;
      case 'moderate':
        frequencyPerWeek = 4;
        sessionsPerDay = 5;
        break;
      case 'good':
      case 'excellent':
        frequencyPerWeek = 5;
        sessionsPerDay = 6;
        break;
      default:
        frequencyPerWeek = 3;
        sessionsPerDay = 4;
    }

    // Créer les sessions
    const sessions: ExerciseSession[] = [];
    const days = [1, 3, 5, 2, 4, 6].slice(0, frequencyPerWeek);

    days.forEach((day, index) => {
      const sessionExercises: SessionExercise[] = [];
      const exercisesForSession = this.selectExercisesForSession(
        recommendedExercises,
        sessionsPerDay,
        index
      );

      exercisesForSession.forEach((exercise, order) => {
        sessionExercises.push({
          exercise,
          order: order + 1,
          sets: exercise.sets || 2,
          reps: exercise.repetitions ? parseInt(exercise.repetitions.split('-')[0]) : undefined,
          duration: exercise.duration ? this.parseDuration(exercise.duration) : undefined,
          restBetweenSets: exercise.restTime ? parseInt(exercise.restTime) : 60
        });
      });

      sessions.push({
        day,
        exercises: sessionExercises,
        totalDuration: this.calculateSessionDuration(sessionExercises),
        warmupIncluded: true,
        cooldownIncluded: true
      });
    });

    return {
      id: `program-${Date.now()}`,
      name: this.getProgramName(result.healthLevel),
      description: this.getProgramDescription(result.healthLevel),
      healthLevel: result.healthLevel,
      targetCategories: weakCategories,
      exercises: sessions,
      durationWeeks: 8,
      frequencyPerWeek,
      createdAt: new Date()
    };
  }

  /**
   * Sélectionne les exercices pour une session
   */
  private selectExercisesForSession(
    exercises: Exercise[],
    count: number,
    sessionIndex: number
  ): Exercise[] {
    // Rotation des exercices entre les sessions
    const startIndex = (sessionIndex * 2) % exercises.length;
    const selected: Exercise[] = [];

    // Toujours inclure un exercice de respiration/relaxation
    const breathingExercise = exercises.find(e => e.category === 'breathing' || e.category === 'relaxation');
    if (breathingExercise) {
      selected.push(breathingExercise);
    }

    // Ajouter les autres exercices
    for (let i = 0; selected.length < count && i < exercises.length; i++) {
      const exercise = exercises[(startIndex + i) % exercises.length];
      if (!selected.includes(exercise)) {
        selected.push(exercise);
      }
    }

    return selected;
  }

  /**
   * Parse la durée en secondes
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)/);
    if (match) {
      const value = parseInt(match[1]);
      if (duration.includes('min')) {
        return value * 60;
      }
      return value;
    }
    return 60;
  }

  /**
   * Calcule la durée totale d'une session
   */
  private calculateSessionDuration(exercises: SessionExercise[]): number {
    let total = 5; // 5 minutes d'échauffement

    exercises.forEach(ex => {
      if (ex.duration) {
        total += (ex.duration / 60) * (ex.sets || 1);
      } else if (ex.reps) {
        // Estimer 3 secondes par répétition
        total += ((ex.reps * 3) / 60) * (ex.sets || 1);
      }
      // Ajouter le temps de repos
      if (ex.restBetweenSets && ex.sets && ex.sets > 1) {
        total += ((ex.restBetweenSets * (ex.sets - 1)) / 60);
      }
    });

    total += 5; // 5 minutes de retour au calme
    return Math.round(total);
  }

  /**
   * Génère le nom du programme
   */
  private getProgramName(healthLevel: HealthLevel): string {
    const names: Record<HealthLevel, string> = {
      'at-risk': 'Programme Santé Première',
      'needs-improvement': 'Programme Progression Douce',
      'moderate': 'Programme Équilibre Actif',
      'good': 'Programme Forme Optimale',
      'excellent': 'Programme Performance'
    };
    return names[healthLevel];
  }

  /**
   * Génère la description du programme
   */
  private getProgramDescription(healthLevel: HealthLevel): string {
    const descriptions: Record<HealthLevel, string> = {
      'at-risk': 'Programme très progressif conçu pour vous accompagner en toute sécurité vers une meilleure forme physique',
      'needs-improvement': 'Programme adapté pour retrouver une condition physique satisfaisante à votre rythme',
      'moderate': 'Programme équilibré combinant différents types d\'exercices pour une progression constante',
      'good': 'Programme complet pour maintenir et améliorer votre bonne condition physique',
      'excellent': 'Programme avancé pour optimiser vos performances et relever de nouveaux défis'
    };
    return descriptions[healthLevel];
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
   * Obtient tous les exercices de la base de données
   */
  getAllExercises(): Exercise[] {
    return EXERCISE_DATABASE;
  }

  /**
   * Obtient les exercices par difficulté
   */
  getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Exercise[] {
    return EXERCISE_DATABASE.filter(e => e.difficulty === difficulty);
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
