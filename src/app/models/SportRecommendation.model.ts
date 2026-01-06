import { SportAlternative } from "./TrainingPlan.model";

export interface SportRecommendation {
  sport: string;
  score: number;
  reason: string;
  alternatives?: SportAlternative[];
}
