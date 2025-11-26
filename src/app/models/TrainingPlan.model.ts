export interface SportAlternative {
  sport: string;
  score: number;
  reason: string;
  benefits: string[];
  precautions: string[];
}

export interface TrainingPlan {
  goal: string;
  equipment: string[];
  progressionTips: string[];
}
