import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, MessageCircle, Bot, X, Send } from 'lucide-angular';
import { ChatService } from '../../services/chat.service';
import { UserProfile } from '../../models/UserProfile.model';
import { SportRecommendation } from '../../models/SportRecommendation.model';
import { ChatMessage } from '../../models/ChatMessage.model';

/**
 * Floating chatbot component for user questions about their sport recommendation
 */
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @Input() recommendation!: SportRecommendation;
  @Input() userProfile!: UserProfile;

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];
  showSuggestedQuestions = true;
  showBadge = true;

  private readonly STORAGE_KEY = 'fytai_chat_history';
  private readonly BADGE_KEY = 'fytai_chat_badge_seen';

  suggestedQuestions = [
    'chatbot.suggestedQuestions.beginner',
    'chatbot.suggestedQuestions.healthIssues',
    'chatbot.suggestedQuestions.frequency',
    'chatbot.suggestedQuestions.equipment'
  ];

  // Lucide icons
  readonly MessageCircle = MessageCircle;
  readonly Bot = Bot;
  readonly X = X;
  readonly Send = Send;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const badgeSeen = sessionStorage.getItem(this.BADGE_KEY);
    this.showBadge = !badgeSeen;

    this.loadConversationHistory();
  }

  ngOnDestroy(): void {
    this.saveConversationHistory();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.showBadge) {
      this.showBadge = false;
      sessionStorage.setItem(this.BADGE_KEY, 'true');
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

    this.chatService.sendMessage(
      this.userProfile,
      this.recommendation,
      this.messages,
      messageToSend
    ).subscribe({
      next: (response) => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        };
        this.messages.push(assistantMessage);
        this.isLoading = false;

        this.scrollToBottom();
      },
      error: (error) => {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'chatbot.error',
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isLoading = false;
        console.error('Chatbot error:', error);
      }
    });

    setTimeout(() => this.scrollToBottom(), 100);
  }

  selectSuggestedQuestion(question: string): void {
    this.sendMessage(question);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chatbot-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 50);
  }

  private loadConversationHistory(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.messages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
        }));

        if (this.messages.length > 0) {
          this.showSuggestedQuestions = false;
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  private saveConversationHistory(): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
}
