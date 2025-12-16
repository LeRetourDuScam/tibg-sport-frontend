import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SportRecommendation } from '../../models/SportRecommendation.model';
import { SportComparisonComponent } from '../sport-comparison/sport-comparison.component';
import { TrainingPlanComponent } from '../training-plan/training-plan.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    SportComparisonComponent,
    TrainingPlanComponent
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  recommendation: SportRecommendation | null = null;
  showComparison = false;
  showNextSteps = true;

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.recommendation = navigation.extras.state['data'];
    }
  }

  ngOnInit() {
    if (!this.recommendation) {
      this.router.navigate(['/formulaire']);
    }
  }

  backToForm() {
    this.router.navigate(['/formulaire']);
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

  // Generate PDF-like printable version
  printResults() {
    window.print();
  }

  // Share results
  shareResults() {
    if (navigator.share && this.recommendation) {
      navigator.share({
        title: 'FytAI - Mon sport recommandé',
        text: `FytAI m'a recommandé ${this.recommendation.sport} avec un score de ${this.recommendation.score}%!`,
        url: window.location.origin
      });
    }
  }
}
