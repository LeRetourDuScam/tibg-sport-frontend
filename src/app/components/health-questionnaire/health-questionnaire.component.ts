import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Heart, Activity, Brain, Leaf, Dumbbell, Wind, Sparkles } from 'lucide-angular';
import { HealthScoreService } from '../../services/health-score.service';
import { LanguageService } from '../../services/language.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import {
  HealthQuestion,
  HealthAnswer,
  HealthCategory,
  getQuestionsByCategory,
  getCategoryLabel
} from '../../models/HealthQuestionnaire.model';

@Component({
  selector: 'app-health-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, RouterLink],
  templateUrl: './health-questionnaire.component.html',
  styleUrls: ['./health-questionnaire.component.css']
})
export class HealthQuestionnaireComponent implements OnInit {
  // Icons
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly AlertCircleIcon = AlertCircle;
  readonly CheckCircleIcon = CheckCircle;
  readonly HeartIcon = Heart;
  readonly ActivityIcon = Activity;
  readonly BrainIcon = Brain;
  readonly LeafIcon = Leaf;
  readonly DumbbellIcon = Dumbbell;
  readonly WindIcon = Wind;
  readonly SparklesIcon = Sparkles;

  // Questions data
  categories: HealthCategory[] = [];
  questionsByCategory: Map<HealthCategory, HealthQuestion[]> = new Map();

  // Navigation
  currentCategoryIndex = 0;
  currentQuestionIndex = 0;

  // Answers
  answers: Map<string, HealthAnswer> = new Map();

  // UI State
  isSubmitting = false;
  showValidationError = false;
  showLanguageMenu = false;

  constructor(
    private healthScoreService: HealthScoreService,
    private router: Router,
    public languageService: LanguageService,
    private translate: TranslateService,
    private snackbarService: SnackbarService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  get languages() {
    return this.languageService.getAvailableLanguages();
  }

  async changeLanguage(lang: string) {
    await this.languageService.setLanguage(lang);
    this.showLanguageMenu = false;
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadSavedProgress();
  }

  private loadQuestions(): void {
    this.questionsByCategory = this.healthScoreService.getQuestionsByCategory();
    this.categories = Array.from(this.questionsByCategory.keys());
  }

  private loadSavedProgress(): void {
    const savedAnswers = localStorage.getItem('health_questionnaire_progress');
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        this.answers = new Map(parsed.answers);
        this.currentCategoryIndex = parsed.categoryIndex || 0;
        this.currentQuestionIndex = parsed.questionIndex || 0;
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }
  }

  private saveProgress(): void {
    const progress = {
      answers: Array.from(this.answers.entries()),
      categoryIndex: this.currentCategoryIndex,
      questionIndex: this.currentQuestionIndex
    };
    localStorage.setItem('health_questionnaire_progress', JSON.stringify(progress));
  }

  // Getters
  get currentCategory(): HealthCategory {
    return this.categories[this.currentCategoryIndex];
  }

  get currentCategoryQuestions(): HealthQuestion[] {
    return this.questionsByCategory.get(this.currentCategory) || [];
  }

  get currentQuestion(): HealthQuestion | null {
    return this.currentCategoryQuestions[this.currentQuestionIndex] || null;
  }

  get totalQuestions(): number {
    let total = 0;
    this.questionsByCategory.forEach(questions => total += questions.length);
    return total;
  }

  get answeredQuestions(): number {
    return this.answers.size;
  }

  get progressPercentage(): number {
    return Math.round((this.answeredQuestions / this.totalQuestions) * 100);
  }

  get isFirstQuestion(): boolean {
    return this.currentCategoryIndex === 0 && this.currentQuestionIndex === 0;
  }

  get isLastQuestion(): boolean {
    return this.currentCategoryIndex === this.categories.length - 1 &&
           this.currentQuestionIndex === this.currentCategoryQuestions.length - 1;
  }

  get currentQuestionNumber(): number {
    let number = 0;
    for (let i = 0; i < this.currentCategoryIndex; i++) {
      number += (this.questionsByCategory.get(this.categories[i])?.length || 0);
    }
    return number + this.currentQuestionIndex + 1;
  }

  get currentAnswer(): any {
    const answer = this.answers.get(this.currentQuestion?.id || '');
    return answer?.value;
  }

  // Methods
  getCategoryLabel(category: HealthCategory): string {
    return getCategoryLabel(category);
  }

  getCategoryIcon(category: HealthCategory) {
    const icons: Record<HealthCategory, any> = {
      'cardiovascular': this.HeartIcon,
      'musculoskeletal': this.DumbbellIcon,
      'respiratory': this.WindIcon,
      'metabolic': this.SparklesIcon,
      'lifestyle': this.LeafIcon,
      'physical-activity': this.ActivityIcon,
      'mental-health': this.BrainIcon
    };
    return icons[category];
  }

  getCategoryProgress(category: HealthCategory): number {
    const questions = this.questionsByCategory.get(category) || [];
    const answered = questions.filter(q => this.answers.has(q.id)).length;
    return questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;
  }

  selectAnswer(value: any): void {
    if (!this.currentQuestion) return;

    const points = this.healthScoreService.getPointsForAnswer(this.currentQuestion.id, value);

    this.answers.set(this.currentQuestion.id, {
      questionId: this.currentQuestion.id,
      value,
      points
    });

    this.showValidationError = false;
    this.saveProgress();

    // Auto-advance après une courte pause
    setTimeout(() => {
      if (!this.isLastQuestion) {
        this.nextQuestion();
      }
    }, 300);
  }

  isOptionSelected(value: any): boolean {
    return this.currentAnswer === value;
  }

  nextQuestion(): void {
    if (!this.currentQuestion) return;

    // Validation
    if (this.currentQuestion.required && !this.answers.has(this.currentQuestion.id)) {
      this.showValidationError = true;
      return;
    }

    if (this.currentQuestionIndex < this.currentCategoryQuestions.length - 1) {
      this.currentQuestionIndex++;
    } else if (this.currentCategoryIndex < this.categories.length - 1) {
      this.currentCategoryIndex++;
      this.currentQuestionIndex = 0;
    }

    this.showValidationError = false;
    this.saveProgress();
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.currentCategoryIndex > 0) {
      this.currentCategoryIndex--;
      this.currentQuestionIndex = this.currentCategoryQuestions.length - 1;
    }

    this.showValidationError = false;
    this.saveProgress();
  }

  goToCategory(categoryIndex: number): void {
    this.currentCategoryIndex = categoryIndex;
    this.currentQuestionIndex = 0;
    this.saveProgress();
  }

  async submitQuestionnaire(): Promise<void> {
    // Vérifier que toutes les questions requises sont répondues
    const unansweredRequired = this.getUnansweredRequiredQuestions();
    if (unansweredRequired.length > 0) {
      this.snackbarService.warning(this.translate.instant('HEALTH.ALERT_UNANSWERED_REQUIRED', { count: unansweredRequired.length }));
      // Naviguer vers la première question non répondue
      this.navigateToQuestion(unansweredRequired[0]);
      return;
    }

    this.isSubmitting = true;

    try {
      const answersArray = Array.from(this.answers.values());
      const result = this.healthScoreService.calculateResults(answersArray);

      // Nettoyer la progression sauvegardée
      localStorage.removeItem('health_questionnaire_progress');

      // Naviguer vers les résultats
      this.router.navigate(['/resultats-sante']);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      this.snackbarService.error(this.translate.instant('HEALTH.SUBMIT_ERROR'));
    } finally {
      this.isSubmitting = false;
    }
  }

  private getUnansweredRequiredQuestions(): HealthQuestion[] {
    const unanswered: HealthQuestion[] = [];
    this.questionsByCategory.forEach(questions => {
      questions.forEach(q => {
        if (q.required && !this.answers.has(q.id)) {
          unanswered.push(q);
        }
      });
    });
    return unanswered;
  }

  private navigateToQuestion(question: HealthQuestion): void {
    for (let i = 0; i < this.categories.length; i++) {
      const questions = this.questionsByCategory.get(this.categories[i]) || [];
      const qIndex = questions.findIndex(q => q.id === question.id);
      if (qIndex !== -1) {
        this.currentCategoryIndex = i;
        this.currentQuestionIndex = qIndex;
        break;
      }
    }
  }

  resetQuestionnaire(): void {
    this.confirmationModalService.confirm({
      title: this.translate.instant('HEALTH.RESET_TITLE'),
      message: this.translate.instant('HEALTH.CONFIRM_RESET'),
      confirmText: this.translate.instant('COMMON.CONFIRM'),
      cancelText: this.translate.instant('COMMON.CANCEL'),
      confirmButtonClass: 'danger'
    }).subscribe(result => {
      if (result.confirmed) {
        this.answers.clear();
        this.currentCategoryIndex = 0;
        this.currentQuestionIndex = 0;
        localStorage.removeItem('health_questionnaire_progress');
        this.snackbarService.success(this.translate.instant('HEALTH.RESET_SUCCESS'));
      }
    });
  }
}
