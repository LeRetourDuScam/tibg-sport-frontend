import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, MessageCircle, Bot, X, Send, Maximize2, Minimize2, Trash2 } from 'lucide-angular';
import { ChatService } from '../../services/chat.service';
import { HealthQuestionnaireResult, getCategoryLabel } from '../../models/HealthQuestionnaire.model';
import { ChatMessage, HealthChatRequest, ExerciseAi } from '../../models/ChatMessage.model';

@Component({
  selector: 'app-health-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './health-chatbot.component.html',
  styleUrls: ['./health-chatbot.component.css']
})
export class HealthChatbotComponent implements OnInit, OnDestroy, OnChanges {
  @Input() result!: HealthQuestionnaireResult;
  @Input() exercises: ExerciseAi[] = [];

  isOpen = false;
  isFullscreen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];
  showSuggestedQuestions = true;
  showBadge = true;

  private readonly STORAGE_KEY_PREFIX = 'fytai_health_chat_';
  private readonly BADGE_KEY = 'fytai_health_chat_badge_seen';
  private currentResultId: string = '';

  suggestedQuestions = [
    'Comment améliorer mon score de santé ?',
    'Quels exercices sont adaptés à mon niveau ?',
    'Comment débuter les exercices recommandés ?',
    'Des conseils pour mes catégories faibles ?'
  ];

  // Lucide icons
  readonly MessageCircle = MessageCircle;
  readonly Bot = Bot;
  readonly X = X;
  readonly Send = Send;
  readonly Maximize2 = Maximize2;
  readonly Minimize2 = Minimize2;
  readonly Trash2 = Trash2;

  constructor(
    private chatService: ChatService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const badgeSeen = sessionStorage.getItem(this.BADGE_KEY);
    this.showBadge = !badgeSeen;
    this.initializeForResult();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && !changes['result'].firstChange) {
      this.initializeForResult();
    }
  }

  private initializeForResult(): void {
    if (this.result) {
      const resultId = this.result.completedAt
        ? new Date(this.result.completedAt).getTime().toString()
        : 'default';

      if (this.currentResultId !== resultId) {
        this.currentResultId = resultId;
        this.loadConversationHistory();
      }
    }
  }

  private getStorageKey(): string {
    return `${this.STORAGE_KEY_PREFIX}${this.currentResultId}`;
  }

  ngOnDestroy(): void {
    this.saveConversationHistory();
    if (this.isFullscreen) {
      document.body.classList.remove('chatbot-fullscreen-open');
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.showBadge) {
      this.showBadge = false;
      sessionStorage.setItem(this.BADGE_KEY, 'true');
    }

    if (!this.isOpen && this.isFullscreen) {
      this.toggleFullscreen();
    }
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      document.body.classList.add('chatbot-fullscreen-open');
    } else {
      document.body.classList.remove('chatbot-fullscreen-open');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(message?: string): void {
    const messageToSend = message || this.userInput.trim();

    if (!messageToSend || this.isLoading) {
      return;
    }

    this.showSuggestedQuestions = false;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.userInput = '';
    this.isLoading = true;

    const weakCategories = this.result.categoryScores
      .filter(cs => cs.percentage < 60)
      .map(cs => this.translate.instant(getCategoryLabel(cs.category)));

    const request: HealthChatRequest = {
      scorePercentage: this.result.scorePercentage,
      healthLevel: this.result.healthLevel,
      weakCategories: weakCategories,
      riskFactors: this.result.riskFactors.map(r => this.translate.instant(r.description)),
      recommendedExercises: this.exercises.slice(0, 4).map(e => e.name),
      recommendations: this.result.recommendations.slice(0, 5).map(r => this.translate.instant(r)),
      conversationHistory: this.messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      userMessage: messageToSend,
      language: this.translate.currentLang || 'fr'
    };

    this.chatService.sendHealthMessage(request).subscribe({
      next: (response) => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        this.messages.push(assistantMessage);
        this.isLoading = false;
        this.saveConversationHistory();
      },
      error: (error) => {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Désolé, je n\'ai pas pu traiter votre question. Veuillez réessayer.',
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
      }
    });
  }

  private loadConversationHistory(): void {
    try {
      const storageKey = this.getStorageKey();
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        this.messages = JSON.parse(stored);
        if (this.messages.length > 0) {
          this.showSuggestedQuestions = false;
        }
      } else {
        this.messages = [];
        this.showSuggestedQuestions = true;
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.messages = [];
      this.showSuggestedQuestions = true;
    }
  }

  private saveConversationHistory(): void {
    try {
      const storageKey = this.getStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  clearHistory(): void {
    this.messages = [];
    this.showSuggestedQuestions = true;
    const storageKey = this.getStorageKey();
    sessionStorage.removeItem(storageKey);
  }
}
