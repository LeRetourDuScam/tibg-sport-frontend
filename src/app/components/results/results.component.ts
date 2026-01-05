import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, MapPin, Youtube, ShoppingBag, Check, TriangleAlert, Target, ChevronDown, Download, FileText, RefreshCw, Twitter } from 'lucide-angular';
import { SportRecommendation } from '../../models/SportRecommendation.model';
import { UserProfile } from '../../models/UserProfile.model';
import { SportComparisonComponent } from '../sport-comparison/sport-comparison.component';
import { TrainingPlanComponent } from '../training-plan/training-plan.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { ResultsStorageService } from '../../services/results-storage.service';
import { PdfExportService } from '../../services/pdf-export-enhanced.service';
import { SnackbarService } from '../../services/snackbar.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SportComparisonComponent,
    TrainingPlanComponent,
    ChatbotComponent,
    FeedbackComponent,
    RouterLink,
    LucideAngularModule,
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  recommendation: SportRecommendation | null = null;
  userProfile: UserProfile | null = null;
  showComparison = false;
  showNextSteps = true;
  isSaved = false;
  savedResultId: string | null = null;
  isExportingPdf = false;

  readonly MapPin = MapPin;
  readonly Youtube = Youtube;
  readonly ShoppingBag = ShoppingBag;
  readonly Check = Check;
  readonly warning = TriangleAlert;
  readonly Target = Target;
  readonly ChevronDown = ChevronDown;
  readonly Download = Download;
  readonly FileText = FileText;
  readonly RefreshCw = RefreshCw;
  readonly Twitter = Twitter;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private resultsStorageService: ResultsStorageService,
    private pdfExportService: PdfExportService,
    private snackbar: SnackbarService,
    private stateService: StateService
  ) {
    // Try to get from navigation state first
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.recommendation = navigation.extras.state['data'];
      this.userProfile = navigation.extras.state['userProfile'];

      // Save to state service
      if (this.recommendation && this.userProfile) {
        this.stateService.setRecommendation(this.recommendation, this.userProfile);
      }
    } else {
      // Fall back to state service
      this.recommendation = this.stateService.getRecommendation();
      this.userProfile = this.stateService.getProfile();
    }
  }

  ngOnInit() {
    if (!this.recommendation) {
      this.router.navigate(['/form']);
      return;
    }
  }

  backToForm() {
    this.router.navigate(['/form']);
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  toggleComparison() {
    this.showComparison = !this.showComparison;
  }

  toggleNextSteps() {
    this.showNextSteps = !this.showNextSteps;
  }

  printResults() {
    window.print();
  }

  shareOnTwitter() {
    if (!this.recommendation) return;

    const text = this.translate.instant('RESULTS.SHARE_TEXT', {
      sport: this.recommendation.sport,
      score: this.recommendation.score
    });
    const url = window.location.origin;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }

  saveResults() {
    if (!this.recommendation || !this.userProfile) return;

    try {
      this.savedResultId = this.resultsStorageService.saveResults(this.recommendation, this.userProfile);
      this.isSaved = true;
      this.snackbar.success(this.translate.instant('SNACKBAR.SAVE_SUCCESS'));
    } catch (error) {
      console.error('Save error:', error);
      this.snackbar.error(this.translate.instant('SNACKBAR.SAVE_ERROR'));
    }
  }

  hasSavedResults(): boolean {
    return this.resultsStorageService.hasSavedResults();
  }

  async exportToPDF() {
    if (!this.recommendation || !this.userProfile) return;

    this.isExportingPdf = true;

    try {
      await this.pdfExportService.exportEnhancedPDF(this.recommendation, this.userProfile);
      this.snackbar.success(this.translate.instant('SNACKBAR.PDF_SUCCESS'));
    } catch (error) {
      console.error('PDF export error:', error);
      this.snackbar.error(this.translate.instant('SNACKBAR.PDF_ERROR'));
    } finally {
      this.isExportingPdf = false;
    }
  }

  getGoogleMapsSearch(): string {
    if (!this.recommendation) return '';
    const searchQuery = this.translate.instant('RESULTS.MAPS_SEARCH_QUERY');
    const query = `${this.recommendation.sport} ${searchQuery}`;
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  }

  getYouTubeSearch(): string {
    if (!this.recommendation) return '';
    const searchQuery = this.translate.instant('RESULTS.YOUTUBE_SEARCH_QUERY');
    const query = `${this.recommendation.sport} ${searchQuery}`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }

  getEquipmentSearch(): string {
    if (!this.recommendation) return '';
    const query = this.translate.instant('RESULTS.EQUIPMENT_SEARCH_QUERY', { sport: this.recommendation.sport });
    return `https://www.amazon.fr/s?k=${encodeURIComponent(query)}`;
  }

}
