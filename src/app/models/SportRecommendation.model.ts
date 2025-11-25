import { Exercise } from "./Exercice.model";

export interface SportRecommendation {
  sport: string;
  score: number;
  reason: string;
  explanation: string;
  benefits: string[];
  precautions: string[];
  exercises: Exercise[];
}