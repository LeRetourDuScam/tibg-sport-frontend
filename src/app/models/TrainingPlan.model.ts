export interface TrainingWeek {
  weekNumber: number;
  focus: string;
  sessions: TrainingSession[];
  milestone?: string;
}

export interface TrainingSession {
  day: number; // 1-7 (Monday-Sunday)
  title: string;
  duration: string;
  exercises: string[];
  notes?: string;
}

export interface SportAlternative {
  sport: string;
  score: number;
  reason: string;
  benefits: string[];
  precautions: string[];
}

export interface TrainingPlan {
  duration: string; // "4 weeks", "8 weeks"
  goal: string;
  weeks: TrainingWeek[];
  equipment: string[];
  progressionTips: string[];
}
