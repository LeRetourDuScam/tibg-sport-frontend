import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule,
  Heart, Activity, Brain, Leaf, Dumbbell, Wind, Sparkles,
  AlertTriangle, CheckCircle, ArrowRight, RotateCcw, Clock,
  TrendingUp, Target, Flame, Download, Share2, ChevronDown, ChevronUp,
  Play, Info, Twitter, Save
} from 'lucide-angular';
import { HealthScoreService } from '../../services/health-score.service';
import { LanguageService } from '../../services/language.service';
import { ResultsStorageService } from '../../services/results-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import {
  HealthQuestionnaireResult,
  HealthCategory,
  HealthLevel,
  getCategoryLabel,
  getHealthLevelLabel
} from '../../models/HealthQuestionnaire.model';
import { Exercise, ExerciseProgram } from '../../models/Exercice.model';
import { HealthChatbotComponent } from '../health-chatbot/health-chatbot.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { FeedbackTarget } from '../../models/FeedbackTarget.model';

@Component({
  selector: 'app-health-results',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule, HealthChatbotComponent, FeedbackComponent],
  templateUrl: './health-results.component.html',
  styleUrls: ['./health-results.component.css']
})
export class HealthResultsComponent implements OnInit {
  // Icons
  readonly HeartIcon = Heart;
  readonly ActivityIcon = Activity;
  readonly BrainIcon = Brain;
  readonly LeafIcon = Leaf;
  readonly DumbbellIcon = Dumbbell;
  readonly WindIcon = Wind;
  readonly SparklesIcon = Sparkles;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CheckCircleIcon = CheckCircle;
  readonly ArrowRightIcon = ArrowRight;
  readonly RotateCcwIcon = RotateCcw;
  readonly ClockIcon = Clock;
  readonly TrendingUpIcon = TrendingUp;
  readonly TargetIcon = Target;
  readonly FlameIcon = Flame;
  readonly DownloadIcon = Download;
  readonly Share2Icon = Share2;
  readonly ChevronDownIcon = ChevronDown;
  readonly ChevronUpIcon = ChevronUp;
  readonly PlayIcon = Play;
  readonly InfoIcon = Info;
  readonly TwitterIcon = Twitter;
  readonly SaveIcon = Save;

  // Data
  result: HealthQuestionnaireResult | null = null;
  recommendedExercises: Exercise[] = [];
  exerciseProgram: ExerciseProgram | null = null;

  // UI State
  expandedExercises: Set<string> = new Set();
  showAllExercises = false;
  activeTab: 'overview' | 'exercises' = 'overview';
  showLanguageMenu = false;
  isSaved = false;

  constructor(
    private healthScoreService: HealthScoreService,
    private router: Router,
    public languageService: LanguageService,
    private resultsStorageService: ResultsStorageService,
    private snackbarService: SnackbarService,
    private translateService: TranslateService
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
    this.loadResults();
  }

  private loadResults(): void {
    this.result = this.healthScoreService.getSavedResult();

    if (!this.result) {
      // Pas de résultat, rediriger vers le questionnaire
      this.router.navigate(['/questionnaire-sante']);
      return;
    }

    this.recommendedExercises = this.healthScoreService.getRecommendedExercises(this.result);
    this.exerciseProgram = this.healthScoreService.generateExerciseProgram(this.result);
  }

  // Helper methods
  getCategoryLabel(category: HealthCategory): string {
    return getCategoryLabel(category);
  }

  getHealthLevelLabel(level: HealthLevel): string {
    return getHealthLevelLabel(level);
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

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-amber-500';
    return 'text-red-500';
  }

  getScoreBgColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }

  getScoreGradient(percentage: number): string {
    if (percentage >= 80) return 'from-green-400 to-emerald-500';
    if (percentage >= 60) return 'from-blue-400 to-blue-600';
    if (percentage >= 40) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-red-600';
  }

  getHealthLevelColor(level: HealthLevel): string {
    const colors: Record<HealthLevel, string> = {
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'moderate': 'bg-amber-100 text-amber-700',
      'needs-improvement': 'bg-orange-100 text-orange-700',
      'at-risk': 'bg-red-100 text-red-700'
    };
    return colors[level];
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      'beginner': 'HEALTH.DIFFICULTY_BEGINNER',
      'intermediate': 'HEALTH.DIFFICULTY_INTERMEDIATE',
      'advanced': 'HEALTH.DIFFICULTY_ADVANCED'
    };
    return labels[difficulty] || difficulty;
  }

  getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-700',
      'intermediate': 'bg-amber-100 text-amber-700',
      'advanced': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || '';
  }

  getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'cardio': 'HEALTH.EXERCISE_CATEGORY.cardio',
      'strength': 'HEALTH.EXERCISE_CATEGORY.strength',
      'flexibility': 'HEALTH.EXERCISE_CATEGORY.flexibility',
      'balance': 'HEALTH.EXERCISE_CATEGORY.balance',
      'breathing': 'HEALTH.EXERCISE_CATEGORY.breathing',
      'relaxation': 'HEALTH.EXERCISE_CATEGORY.relaxation',
      'core': 'HEALTH.EXERCISE_CATEGORY.core',
      'mobility': 'HEALTH.EXERCISE_CATEGORY.mobility'
    };
    return names[category] || category;
  }

  getExerciseBenefitKey(exerciseId: string, index: number): string {
    return `HEALTH.EXERCISES.${exerciseId}.BENEFITS.${index}`;
  }

  getExerciseInstructionKey(exerciseId: string, index: number): string {
    return `HEALTH.EXERCISES.${exerciseId}.INSTRUCTIONS.${index}`;
  }

  getExerciseContraKey(exerciseId: string, index: number): string {
    return `HEALTH.EXERCISES.${exerciseId}.CONTRAINDICATIONS.${index}`;
  }

  getExerciseEquipmentKey(exerciseId: string, index: number): string {
    return `HEALTH.EXERCISES.${exerciseId}.EQUIPMENT.${index}`;
  }

  toggleExercise(exerciseId: string): void {
    if (this.expandedExercises.has(exerciseId)) {
      this.expandedExercises.delete(exerciseId);
    } else {
      this.expandedExercises.add(exerciseId);
    }
  }

  isExerciseExpanded(exerciseId: string): boolean {
    return this.expandedExercises.has(exerciseId);
  }

  get displayedExercises(): Exercise[] {
    if (this.showAllExercises) {
      return this.recommendedExercises;
    }
    return this.recommendedExercises.slice(0, 6);
  }

  get weakCategories(): string[] {
    if (!this.result) return [];
    return this.result.categoryScores
      .filter(cs => cs.percentage < 60)
      .map(cs => this.getCategoryLabel(cs.category));
  }

  get feedbackTarget(): FeedbackTarget | null {
    if (!this.result) return null;
    return {
      sport: 'health-questionnaire',
      score: this.result.scorePercentage,
      context: 'health-questionnaire-result'
    };
  }

  retakeQuestionnaire(): void {
    this.healthScoreService.clearSavedResult();
    this.router.navigate(['/questionnaire-sante']);
  }

  setActiveTab(tab: 'overview' | 'exercises'): void {
    this.activeTab = tab;
  }

  saveResults(): void {
    if (!this.result) return;

    const healthResult = {
      id: `health-${Date.now()}`,
      type: 'health' as const,
      healthResult: this.result,
      exercises: this.recommendedExercises,
      savedAt: new Date()
    };

    this.resultsStorageService.saveHealthResult(healthResult);
    this.isSaved = true;
    this.snackbarService.show(
      this.translateService.instant('SNACKBAR.SAVE_SUCCESS'),
      'success'
    );
  }

  shareOnTwitter(): void {
    if (!this.result) return;

    const healthLevelLabel = this.translateService.instant(this.getHealthLevelLabel(this.result.healthLevel));
    const text = encodeURIComponent(
      this.translateService.instant('HEALTH.SHARE_TWEET_TEXT', {
        score: this.result.scorePercentage,
        level: healthLevelLabel
      })
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }

  getDayName(day: number): string {
    const dayKeys = [
      '',
      'HEALTH.DAYS.monday',
      'HEALTH.DAYS.tuesday',
      'HEALTH.DAYS.wednesday',
      'HEALTH.DAYS.thursday',
      'HEALTH.DAYS.friday',
      'HEALTH.DAYS.saturday',
      'HEALTH.DAYS.sunday'
    ];

    const key = dayKeys[day];
    if (key) return key;
    return this.translateService.instant('HEALTH.DAY_FALLBACK', { day });
  }
}
