export interface SportAlternative {
  sport: string;
  score: number;
  reason: string;
  benefits: string[];
  precautions: string[];
}

export interface TrainingPlan {
  goal: string;
  durationWeeks: number;
  weeks: WeekPlan[];
  equipment: string[];
  progressionTips: string[];
}

export interface WeekPlan {
  weekNumber: number;
  focus: string;
  sessions: SessionPlan[];
}

export interface SessionPlan {
  day: string;
  type: string;
  duration: number;
  intensity: string;
  exercises: string[];
  notes?: string;
}
