import { Exercise } from "./Exercice.model";
import { SportAlternative, TrainingPlan } from "./TrainingPlan.model";

export interface SportRecommendation {
  sport: string;
  score: number;
  reason: string;
  alternatives?: SportAlternative[];
  // trainingPlan?: TrainingPlan;
}
