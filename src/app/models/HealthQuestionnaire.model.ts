/**
 * Modèle du questionnaire de santé avec système de scoring
 * Basé sur des critères médicaux standard pour évaluer l'aptitude à l'activité physique
 */

export interface HealthQuestion {
  id: string;
  category: HealthCategory;
  text: string;
  type: 'boolean' | 'single-choice' | 'multiple-choice' | 'scale';
  options?: HealthOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  weight: number; // Importance de la question dans le score global
  required: boolean;
}

export interface HealthOption {
  value: string | number | boolean;
  label: string;
  points: number; // Points attribués pour cette réponse
  riskLevel?: 'low' | 'moderate' | 'high'; // Niveau de risque associé
}

export interface HealthAnswer {
  questionId: string;
  value: string | number | boolean | string[];
  points: number;
}

export interface HealthQuestionnaireResult {
  answers: HealthAnswer[];
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  healthLevel: HealthLevel;
  categoryScores: CategoryScore[];
  riskFactors: RiskFactor[];
  recommendations: string[];
  completedAt: Date;
}

export interface CategoryScore {
  category: HealthCategory;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface RiskFactor {
  id: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
  relatedQuestionId: string;
}

export type HealthCategory =
  | 'cardiovascular'
  | 'musculoskeletal'
  | 'respiratory'
  | 'metabolic'
  | 'lifestyle'
  | 'physical-activity'
  | 'mental-health';

export type HealthLevel =
  | 'excellent'    // 90-100%
  | 'good'         // 75-89%
  | 'moderate'     // 60-74%
  | 'needs-improvement' // 40-59%
  | 'at-risk';     // 0-39%

/**
 * Questions du questionnaire de santé
 * Score: Plus le score est élevé, meilleur est l'état de santé
 */
export const HEALTH_QUESTIONS: HealthQuestion[] = [
  // === CATÉGORIE CARDIOVASCULAIRE ===
  {
    id: 'cardio-1',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.cardio-1.TEXT',
    type: 'boolean',
    options: [
      { value: false, label: 'HEALTH.QUESTIONS.cardio-1.OPTIONS.no', points: 10, riskLevel: 'low' },
      { value: true, label: 'HEALTH.QUESTIONS.cardio-1.OPTIONS.yes', points: 0, riskLevel: 'high' }
    ],
    weight: 3,
    required: true
  },
  {
    id: 'cardio-2',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.cardio-2.TEXT',
    type: 'boolean',
    options: [
      { value: false, label: 'HEALTH.QUESTIONS.cardio-2.OPTIONS.no', points: 10, riskLevel: 'low' },
      { value: true, label: 'HEALTH.QUESTIONS.cardio-2.OPTIONS.yes', points: 0, riskLevel: 'high' }
    ],
    weight: 3,
    required: true
  },
  {
    id: 'cardio-3',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.cardio-3.TEXT',
    type: 'single-choice',
    options: [
      { value: 'no', label: 'HEALTH.QUESTIONS.cardio-3.OPTIONS.no', points: 10, riskLevel: 'low' },
      { value: 'controlled', label: 'HEALTH.QUESTIONS.cardio-3.OPTIONS.controlled', points: 5, riskLevel: 'moderate' },
      { value: 'uncontrolled', label: 'HEALTH.QUESTIONS.cardio-3.OPTIONS.uncontrolled', points: 0, riskLevel: 'high' },
      { value: 'unknown', label: 'HEALTH.QUESTIONS.cardio-3.OPTIONS.unknown', points: 3, riskLevel: 'moderate' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'cardio-4',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.cardio-4.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.cardio-4.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'rarely', label: 'HEALTH.QUESTIONS.cardio-4.OPTIONS.rarely', points: 7, riskLevel: 'low' },
      { value: 'sometimes', label: 'HEALTH.QUESTIONS.cardio-4.OPTIONS.sometimes', points: 3, riskLevel: 'moderate' },
      { value: 'often', label: 'HEALTH.QUESTIONS.cardio-4.OPTIONS.often', points: 0, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'cardio-5',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.cardio-5.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.cardio-5.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'rarely', label: 'HEALTH.QUESTIONS.cardio-5.OPTIONS.rarely', points: 7, riskLevel: 'low' },
      { value: 'sometimes', label: 'HEALTH.QUESTIONS.cardio-5.OPTIONS.sometimes', points: 4, riskLevel: 'moderate' },
      { value: 'often', label: 'HEALTH.QUESTIONS.cardio-5.OPTIONS.often', points: 0, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },

  // === CATÉGORIE MUSCULO-SQUELETTIQUE ===
  {
    id: 'musculo-1',
    category: 'musculoskeletal',
    text: 'HEALTH.QUESTIONS.musculo-1.TEXT',
    type: 'boolean',
    options: [
      { value: false, label: 'HEALTH.QUESTIONS.musculo-1.OPTIONS.no', points: 10, riskLevel: 'low' },
      { value: true, label: 'HEALTH.QUESTIONS.musculo-1.OPTIONS.yes', points: 2, riskLevel: 'moderate' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'musculo-2',
    category: 'musculoskeletal',
    text: 'HEALTH.QUESTIONS.musculo-2.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.musculo-2.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'rarely', label: 'HEALTH.QUESTIONS.musculo-2.OPTIONS.rarely', points: 7, riskLevel: 'low' },
      { value: 'sometimes', label: 'HEALTH.QUESTIONS.musculo-2.OPTIONS.sometimes', points: 4, riskLevel: 'moderate' },
      { value: 'often', label: 'HEALTH.QUESTIONS.musculo-2.OPTIONS.often', points: 1, riskLevel: 'moderate' },
      { value: 'chronic', label: 'HEALTH.QUESTIONS.musculo-2.OPTIONS.chronic', points: 0, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'musculo-3',
    category: 'musculoskeletal',
    text: 'HEALTH.QUESTIONS.musculo-3.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.musculo-3.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'rarely', label: 'HEALTH.QUESTIONS.musculo-3.OPTIONS.rarely', points: 7, riskLevel: 'low' },
      { value: 'sometimes', label: 'HEALTH.QUESTIONS.musculo-3.OPTIONS.sometimes', points: 4, riskLevel: 'moderate' },
      { value: 'often', label: 'HEALTH.QUESTIONS.musculo-3.OPTIONS.often', points: 1, riskLevel: 'moderate' },
      { value: 'chronic', label: 'HEALTH.QUESTIONS.musculo-3.OPTIONS.chronic', points: 0, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'musculo-4',
    category: 'musculoskeletal',
    text: 'HEALTH.QUESTIONS.musculo-4.TEXT',
    type: 'single-choice',
    options: [
      { value: 'easily', label: 'HEALTH.QUESTIONS.musculo-4.OPTIONS.easily', points: 10, riskLevel: 'low' },
      { value: 'difficulty', label: 'HEALTH.QUESTIONS.musculo-4.OPTIONS.difficulty', points: 5, riskLevel: 'moderate' },
      { value: 'no', label: 'HEALTH.QUESTIONS.musculo-4.OPTIONS.no', points: 2, riskLevel: 'moderate' },
      { value: 'not-tried', label: 'HEALTH.QUESTIONS.musculo-4.OPTIONS.not-tried', points: 5, riskLevel: 'low' }
    ],
    weight: 1,
    required: true
  },

  // === CATÉGORIE MÉTABOLIQUE ===
  {
    id: 'metabolic-1',
    category: 'metabolic',
    text: 'HEALTH.QUESTIONS.metabolic-1.TEXT',
    type: 'single-choice',
    options: [
      { value: 'no', label: 'HEALTH.QUESTIONS.metabolic-1.OPTIONS.no', points: 10, riskLevel: 'low' },
      { value: 'prediabetes', label: 'HEALTH.QUESTIONS.metabolic-1.OPTIONS.prediabetes', points: 5, riskLevel: 'moderate' },
      { value: 'type2-controlled', label: 'HEALTH.QUESTIONS.metabolic-1.OPTIONS.type2-controlled', points: 4, riskLevel: 'moderate' },
      { value: 'type2-uncontrolled', label: 'HEALTH.QUESTIONS.metabolic-1.OPTIONS.type2-uncontrolled', points: 1, riskLevel: 'high' },
      { value: 'type1', label: 'HEALTH.QUESTIONS.metabolic-1.OPTIONS.type1', points: 3, riskLevel: 'moderate' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'metabolic-2',
    category: 'metabolic',
    text: 'HEALTH.QUESTIONS.metabolic-2.TEXT',
    type: 'single-choice',
    options: [
      { value: 'underweight', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.underweight', points: 5, riskLevel: 'moderate' },
      { value: 'normal', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.normal', points: 10, riskLevel: 'low' },
      { value: 'overweight', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.overweight', points: 6, riskLevel: 'moderate' },
      { value: 'obese1', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.obese1', points: 3, riskLevel: 'moderate' },
      { value: 'obese2', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.obese2', points: 1, riskLevel: 'high' },
      { value: 'unknown', label: 'HEALTH.QUESTIONS.metabolic-2.OPTIONS.unknown', points: 5, riskLevel: 'low' }
    ],
    weight: 2,
    required: true
  },

  // === CATÉGORIE STYLE DE VIE ===
  {
    id: 'lifestyle-1',
    category: 'lifestyle',
    text: 'HEALTH.QUESTIONS.lifestyle-1.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.lifestyle-1.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'former', label: 'HEALTH.QUESTIONS.lifestyle-1.OPTIONS.former', points: 8, riskLevel: 'low' },
      { value: 'recent-quit', label: 'HEALTH.QUESTIONS.lifestyle-1.OPTIONS.recent-quit', points: 5, riskLevel: 'moderate' },
      { value: 'occasional', label: 'HEALTH.QUESTIONS.lifestyle-1.OPTIONS.occasional', points: 3, riskLevel: 'moderate' },
      { value: 'regular', label: 'HEALTH.QUESTIONS.lifestyle-1.OPTIONS.regular', points: 0, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'lifestyle-2',
    category: 'lifestyle',
    text: 'HEALTH.QUESTIONS.lifestyle-2.TEXT',
    type: 'single-choice',
    options: [
      { value: 'less-5', label: 'HEALTH.QUESTIONS.lifestyle-2.OPTIONS.less-5', points: 2, riskLevel: 'high' },
      { value: '5-6', label: 'HEALTH.QUESTIONS.lifestyle-2.OPTIONS.5-6', points: 5, riskLevel: 'moderate' },
      { value: '7-8', label: 'HEALTH.QUESTIONS.lifestyle-2.OPTIONS.7-8', points: 10, riskLevel: 'low' },
      { value: '9-plus', label: 'HEALTH.QUESTIONS.lifestyle-2.OPTIONS.9-plus', points: 7, riskLevel: 'low' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'lifestyle-3',
    category: 'lifestyle',
    text: 'HEALTH.QUESTIONS.lifestyle-3.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.lifestyle-3.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'occasional', label: 'HEALTH.QUESTIONS.lifestyle-3.OPTIONS.occasional', points: 9, riskLevel: 'low' },
      { value: 'moderate', label: 'HEALTH.QUESTIONS.lifestyle-3.OPTIONS.moderate', points: 7, riskLevel: 'low' },
      { value: 'regular', label: 'HEALTH.QUESTIONS.lifestyle-3.OPTIONS.regular', points: 3, riskLevel: 'moderate' },
      { value: 'heavy', label: 'HEALTH.QUESTIONS.lifestyle-3.OPTIONS.heavy', points: 0, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'lifestyle-4',
    category: 'lifestyle',
    text: 'HEALTH.QUESTIONS.lifestyle-4.TEXT',
    type: 'single-choice',
    options: [
      { value: 'excellent', label: 'HEALTH.QUESTIONS.lifestyle-4.OPTIONS.excellent', points: 10, riskLevel: 'low' },
      { value: 'good', label: 'HEALTH.QUESTIONS.lifestyle-4.OPTIONS.good', points: 8, riskLevel: 'low' },
      { value: 'average', label: 'HEALTH.QUESTIONS.lifestyle-4.OPTIONS.average', points: 5, riskLevel: 'moderate' },
      { value: 'poor', label: 'HEALTH.QUESTIONS.lifestyle-4.OPTIONS.poor', points: 2, riskLevel: 'moderate' }
    ],
    weight: 1,
    required: true
  },

  // === CATÉGORIE ACTIVITÉ PHYSIQUE ===
  {
    id: 'activity-1',
    category: 'physical-activity',
    text: 'HEALTH.QUESTIONS.activity-1.TEXT',
    type: 'single-choice',
    options: [
      { value: '0', label: 'HEALTH.QUESTIONS.activity-1.OPTIONS.0', points: 0, riskLevel: 'high' },
      { value: '1-2', label: 'HEALTH.QUESTIONS.activity-1.OPTIONS.1-2', points: 4, riskLevel: 'moderate' },
      { value: '3-4', label: 'HEALTH.QUESTIONS.activity-1.OPTIONS.3-4', points: 7, riskLevel: 'low' },
      { value: '5-plus', label: 'HEALTH.QUESTIONS.activity-1.OPTIONS.5-plus', points: 10, riskLevel: 'low' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'activity-2',
    category: 'physical-activity',
    text: 'HEALTH.QUESTIONS.activity-2.TEXT',
    type: 'single-choice',
    options: [
      { value: 'easily', label: 'HEALTH.QUESTIONS.activity-2.OPTIONS.easily', points: 10, riskLevel: 'low' },
      { value: 'moderate', label: 'HEALTH.QUESTIONS.activity-2.OPTIONS.moderate', points: 7, riskLevel: 'low' },
      { value: 'difficulty', label: 'HEALTH.QUESTIONS.activity-2.OPTIONS.difficulty', points: 4, riskLevel: 'moderate' },
      { value: 'no', label: 'HEALTH.QUESTIONS.activity-2.OPTIONS.no', points: 1, riskLevel: 'high' }
    ],
    weight: 2,
    required: true
  },
  {
    id: 'activity-3',
    category: 'physical-activity',
    text: 'HEALTH.QUESTIONS.activity-3.TEXT',
    type: 'single-choice',
    options: [
      { value: 'current', label: 'HEALTH.QUESTIONS.activity-3.OPTIONS.current', points: 10, riskLevel: 'low' },
      { value: 'less-month', label: 'HEALTH.QUESTIONS.activity-3.OPTIONS.less-month', points: 8, riskLevel: 'low' },
      { value: '1-6-months', label: 'HEALTH.QUESTIONS.activity-3.OPTIONS.1-6-months', points: 5, riskLevel: 'moderate' },
      { value: '6-12-months', label: 'HEALTH.QUESTIONS.activity-3.OPTIONS.6-12-months', points: 3, riskLevel: 'moderate' },
      { value: 'more-year', label: 'HEALTH.QUESTIONS.activity-3.OPTIONS.more-year', points: 1, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'activity-4',
    category: 'physical-activity',
    text: 'HEALTH.QUESTIONS.activity-4.TEXT',
    type: 'single-choice',
    options: [
      { value: 'less-4', label: 'HEALTH.QUESTIONS.activity-4.OPTIONS.less-4', points: 10, riskLevel: 'low' },
      { value: '4-6', label: 'HEALTH.QUESTIONS.activity-4.OPTIONS.4-6', points: 7, riskLevel: 'low' },
      { value: '6-8', label: 'HEALTH.QUESTIONS.activity-4.OPTIONS.6-8', points: 4, riskLevel: 'moderate' },
      { value: 'more-8', label: 'HEALTH.QUESTIONS.activity-4.OPTIONS.more-8', points: 1, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },

  // === CATÉGORIE SANTÉ MENTALE ===
  {
    id: 'mental-1',
    category: 'mental-health',
    text: 'HEALTH.QUESTIONS.mental-1.TEXT',
    type: 'single-choice',
    options: [
      { value: 'low', label: 'HEALTH.QUESTIONS.mental-1.OPTIONS.low', points: 10, riskLevel: 'low' },
      { value: 'moderate', label: 'HEALTH.QUESTIONS.mental-1.OPTIONS.moderate', points: 7, riskLevel: 'low' },
      { value: 'high', label: 'HEALTH.QUESTIONS.mental-1.OPTIONS.high', points: 3, riskLevel: 'moderate' },
      { value: 'very-high', label: 'HEALTH.QUESTIONS.mental-1.OPTIONS.very-high', points: 0, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'mental-2',
    category: 'mental-health',
    text: 'HEALTH.QUESTIONS.mental-2.TEXT',
    type: 'single-choice',
    options: [
      { value: 'never', label: 'HEALTH.QUESTIONS.mental-2.OPTIONS.never', points: 10, riskLevel: 'low' },
      { value: 'few-days', label: 'HEALTH.QUESTIONS.mental-2.OPTIONS.few-days', points: 6, riskLevel: 'moderate' },
      { value: 'more-half', label: 'HEALTH.QUESTIONS.mental-2.OPTIONS.more-half', points: 3, riskLevel: 'moderate' },
      { value: 'nearly-every', label: 'HEALTH.QUESTIONS.mental-2.OPTIONS.nearly-every', points: 0, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'mental-3',
    category: 'mental-health',
    text: 'HEALTH.QUESTIONS.mental-3.TEXT',
    type: 'single-choice',
    options: [
      { value: 'always', label: 'HEALTH.QUESTIONS.mental-3.OPTIONS.always', points: 10, riskLevel: 'low' },
      { value: 'usually', label: 'HEALTH.QUESTIONS.mental-3.OPTIONS.usually', points: 7, riskLevel: 'low' },
      { value: 'sometimes', label: 'HEALTH.QUESTIONS.mental-3.OPTIONS.sometimes', points: 4, riskLevel: 'moderate' },
      { value: 'rarely', label: 'HEALTH.QUESTIONS.mental-3.OPTIONS.rarely', points: 1, riskLevel: 'high' }
    ],
    weight: 1,
    required: true
  },

  // === INFORMATIONS DE BASE ===
  {
    id: 'info-age',
    category: 'cardiovascular', // L'âge impacte le risque cardiovasculaire
    text: 'HEALTH.QUESTIONS.info-age.TEXT',
    type: 'single-choice',
    options: [
      { value: '18-29', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.18-29', points: 10, riskLevel: 'low' },
      { value: '30-39', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.30-39', points: 9, riskLevel: 'low' },
      { value: '40-49', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.40-49', points: 7, riskLevel: 'low' },
      { value: '50-59', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.50-59', points: 5, riskLevel: 'moderate' },
      { value: '60-69', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.60-69', points: 3, riskLevel: 'moderate' },
      { value: '70-plus', label: 'HEALTH.QUESTIONS.info-age.OPTIONS.70-plus', points: 2, riskLevel: 'moderate' }
    ],
    weight: 1,
    required: true
  },
  {
    id: 'info-medications',
    category: 'cardiovascular',
    text: 'HEALTH.QUESTIONS.info-medications.TEXT',
    type: 'single-choice',
    options: [
      { value: 'none', label: 'HEALTH.QUESTIONS.info-medications.OPTIONS.none', points: 10, riskLevel: 'low' },
      { value: 'vitamins', label: 'HEALTH.QUESTIONS.info-medications.OPTIONS.vitamins', points: 9, riskLevel: 'low' },
      { value: 'one', label: 'HEALTH.QUESTIONS.info-medications.OPTIONS.one', points: 6, riskLevel: 'moderate' },
      { value: 'multiple', label: 'HEALTH.QUESTIONS.info-medications.OPTIONS.multiple', points: 3, riskLevel: 'moderate' }
    ],
    weight: 1,
    required: true
  }
];

/**
 * Retourne les questions groupées par catégorie
 */
export function getQuestionsByCategory(): Map<HealthCategory, HealthQuestion[]> {
  const grouped = new Map<HealthCategory, HealthQuestion[]>();

  HEALTH_QUESTIONS.forEach(question => {
    const existing = grouped.get(question.category) || [];
    existing.push(question);
    grouped.set(question.category, existing);
  });

  return grouped;
}

/**
 * Retourne le libellé d'une catégorie
 */
export function getCategoryLabel(category: HealthCategory): string {
  const labels: Record<HealthCategory, string> = {
    'cardiovascular': 'HEALTH.CATEGORY_CARDIOVASCULAR',
    'musculoskeletal': 'HEALTH.CATEGORY_MUSCULOSKELETAL',
    'respiratory': 'HEALTH.CATEGORY_RESPIRATORY',
    'metabolic': 'HEALTH.CATEGORY_METABOLIC',
    'lifestyle': 'HEALTH.CATEGORY_LIFESTYLE',
    'physical-activity': 'HEALTH.CATEGORY_PHYSICAL_ACTIVITY',
    'mental-health': 'HEALTH.CATEGORY_MENTAL_HEALTH'
  };
  return labels[category];
}

/**
 * Retourne le libellé d'un niveau de santé
 */
export function getHealthLevelLabel(level: HealthLevel): string {
  const labels: Record<HealthLevel, string> = {
    'excellent': 'HEALTH.SCORE_EXCELLENT',
    'good': 'HEALTH.SCORE_GOOD',
    'moderate': 'HEALTH.SCORE_MODERATE',
    'needs-improvement': 'HEALTH.SCORE_NEEDS_IMPROVEMENT',
    'at-risk': 'HEALTH.SCORE_AT_RISK'
  };
  return labels[level];
}
