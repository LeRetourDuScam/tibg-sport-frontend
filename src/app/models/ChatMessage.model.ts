
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
