import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SportRecommendation } from '../../models/SportRecommendation.model';
import { UserProfile } from '../../models/UserProfile.model';
import { SportComparisonComponent } from '../sport-comparison/sport-comparison.component';
import { TrainingPlanComponent } from '../training-plan/training-plan.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { ResultsStorageService } from '../../services/results-storage.service';
import { PdfExportService } from '../../services/pdf-export-enhanced.service';
import { SnackbarService } from '../../services/snackbar.service';

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
    ChatbotComponent,
    RouterLink
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

  constructor(
    private router: Router,
    private translate: TranslateService,
    private resultsStorageService: ResultsStorageService,
    private pdfExportService: PdfExportService,
    private snackbar: SnackbarService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.recommendation = navigation.extras.state['data'];
      this.userProfile = navigation.extras.state['userProfile'];
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

    const text = `Je viens de découvrir mon sport idéal avec FytAI !\n\nSport recommandé : ${this.recommendation.sport}\nScore de compatibilité : ${this.recommendation.score}%\n\nEssayez gratuitement`;
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

}
