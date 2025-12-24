export interface UserProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  legLength: number;
  armLength: number;
  waistSize: number;

  fitnessLevel: string;
  exerciseFrequency: string;
  healthConditions: string;
  jointProblems: boolean;
  kneeProblems: boolean;
  backProblems: boolean;
  heartProblems: boolean;
  otherHealthIssues: string;
  injuries: string;
  allergies: string;

  mainGoal: string;
  specificGoals: string;
  motivations: string;
  fears: string;

  availableTime: string;
  preferredTime: string;
  availableDays: number;
  workType: string;
  sleepQuality: string;
  stressLevel: string;

  exercisePreferences: string;
  exerciseAversions: string;
  locationPreference: string;
  equipmentAvailable: string;
  musicPreference: string;
  socialPreference: string;
  teamPreference: string;

  practisedSports: string;
  favoriteActivity: string;
  pastExperienceWithFitness: string;
  successFactors: string;

  primaryChallenges: string;
  lifestyle: string;
  supportSystem: string;

  language: string;
  preferredTone: string;
  learningStyle: string;
}
