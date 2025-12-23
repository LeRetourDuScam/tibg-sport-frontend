import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SportRecommendation } from '../../models/SportRecommendation.model';
import { UserProfile } from '../../models/UserProfile.model';
import { SportComparisonComponent } from '../sport-comparison/sport-comparison.component';
import { TrainingPlanComponent } from '../training-plan/training-plan.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SportComparisonComponent,
    TrainingPlanComponent,
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

  constructor(
    private router: Router,
    private translate: TranslateService
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
}
