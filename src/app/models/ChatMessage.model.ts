
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface HealthChatRequest {
  scorePercentage: number;
  healthLevel: string;
  weakCategories: string[];
  riskFactors: string[];
  recommendedExercises: string[];
  recommendations: string[];
  conversationHistory: ChatMessage[];
  userMessage: string;
  language?: string;
}

export interface ChatResponse {
  message: string;
}

export interface UserHealthProfile {
  hasHeartCondition: boolean;
  hasHighBloodPressure: string;
  chestPainFrequency: string;
  breathlessnessFrequency: string;

  hasJointProblems: boolean;
  backPainFrequency: string;
  jointPainFrequency: string;
  mobilityLevel: string;

  hasRespiratoryCondition: boolean;
  breathingDifficulty: string;

  diabetesStatus: string;
  weightCategory: string;

  smokingStatus: string;
  sleepHours: string;
  alcoholConsumption: string;
  dietQuality: string;

  weeklyExerciseFrequency: string;
  stairsCapacity: string;
  lastRegularExercise: string;
  dailySittingHours: string;

  stressLevel: string;
  anxietyFrequency: string;
  motivationLevel: string;
}

export interface CategoryScoreDetail {
  category: string;
  categoryLabel: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface ExercisesRequest {
  scorePercentage: number;
  healthLevel: string;
  weakCategories: string[];
  riskFactors: string[];
  recommendations: string[];

  categoryScores: CategoryScoreDetail[];

  userProfile: UserHealthProfile;

  language?: string;
}

export interface ExerciseAi {
  name: string;
  description: string;
  duration?: string;
  repetitions?: string;
  sets?: number;
  category: string;
  difficulty: string;
  benefits: string[];
  instructions: string[];
  equipment?: string[];
}

export interface ExercisesResponse {
  exercises: ExerciseAi[];
}
