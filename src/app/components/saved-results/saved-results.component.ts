import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Archive, Trash2, FileText, ArrowLeft, Heart, Activity, Calendar, TrendingUp } from 'lucide-angular';
import { ResultsStorageService, SavedHealthResult } from '../../services/results-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { HealthScoreService } from '../../services/health-score.service';
import { getHealthLevelLabel } from '../../models/HealthQuestionnaire.model';

@Component({
  selector: 'app-saved-results',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, LucideAngularModule],
  templateUrl: './saved-results.component.html',
  styleUrls: ['./saved-results.component.css']
})
export class SavedResultsComponent implements OnInit {
  savedResults: SavedHealthResult[] = [];

  readonly ArchiveIcon = Archive;
  readonly Trash2Icon = Trash2;
  readonly FileTextIcon = FileText;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly HeartIcon = Heart;
  readonly ActivityIcon = Activity;
  readonly CalendarIcon = Calendar;
  readonly TrendingUpIcon = TrendingUp;

  constructor(
    private resultsStorageService: ResultsStorageService,
    private snackbar: SnackbarService,
    private router: Router,
    private healthScoreService: HealthScoreService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadSavedResults();
  }

  loadSavedResults() {
    this.savedResults = this.resultsStorageService.getSavedHealthResults();
  }

  viewResult(result: SavedHealthResult) {
    this.healthScoreService.saveResult(result.healthResult);
    this.router.navigate(['/resultats-sante']);
  }

  deleteResult(id: string, event: Event) {
    event.stopPropagation();
    const success = this.resultsStorageService.deleteHealthResult(id);
    if (success) {
      this.loadSavedResults();
      this.snackbar.success(this.translate.instant('SAVED_RESULTS.DELETE_SUCCESS'));
    }
  }

  clearAll() {
    this.resultsStorageService.clearAllHealthResults();
    this.loadSavedResults();
    this.snackbar.success(this.translate.instant('SAVED_RESULTS.CLEAR_SUCCESS'));
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString(this.translate.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeSince(date: Date | string): string {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = now - past;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (this.translate.currentLang === 'fr') {
      if (minutes < 60) {
        return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else if (hours < 24) {
        return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
      } else if (days < 7) {
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
      }
    } else {
      if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    }
    return this.formatDate(date);
  }

  getHealthLevelLabel(level: string): string {
    return getHealthLevelLabel(level as any);
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  }

  getScoreBgColor(percentage: number): string {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }

  getHealthLevelColor(level: string): string {
    const colors: Record<string, string> = {
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'moderate': 'bg-amber-100 text-amber-700',
      'needs-improvement': 'bg-orange-100 text-orange-700',
      'at-risk': 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-neutral-100 text-neutral-700';
  }

  getWeakCategoriesCount(result: SavedHealthResult): number {
    return result.healthResult.categoryScores.filter(cs => cs.percentage < 60).length;
  }
}
