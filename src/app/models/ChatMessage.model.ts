import { UserProfile } from './UserProfile.model';
import { SportRecommendation } from './SportRecommendation.model';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  userProfile: UserProfile;
  recommendation: SportRecommendation;
  conversationHistory: ChatMessage[];
  userMessage: string;
}

export interface ChatResponse {
  message: string;
}
