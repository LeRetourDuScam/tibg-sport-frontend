import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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

  constructor(private router: Router) {
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
}
