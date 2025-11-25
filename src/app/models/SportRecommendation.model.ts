import { Exercise } from "./Exercice.model";
import { SportAlternative, TrainingPlan } from "./TrainingPlan.model";

export interface SportRecommendation {
  sport: string;
  score: number;
  reason: string;
  explanation: string;
  benefits: string[];
  precautions: string[];
  exercises: Exercise[];
  alternatives?: SportAlternative[];
  trainingPlan?: TrainingPlan;
}