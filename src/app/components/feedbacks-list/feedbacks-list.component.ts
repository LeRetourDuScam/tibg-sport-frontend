import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, MessageSquare, TrendingUp, BarChart3, ArrowLeft } from 'lucide-angular';
import { FeedbackService, Feedback } from '../../services/feedback.service';

@Component({
  selector: 'app-feedbacks-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, LucideAngularModule],
  templateUrl: './feedbacks-list.component.html',
  styleUrls: ['./feedbacks-list.component.css']
})
export class FeedbacksListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  isLoading = true;
  stats = {
    total: 0,
    perfect: 0,
    good: 0,
    meh: 0,
    bad: 0,
    satisfaction: 0
  };

  readonly MessageSquareIcon = MessageSquare;
  readonly TrendingUpIcon = TrendingUp;
  readonly BarChart3Icon = BarChart3;
  readonly ArrowLeftIcon = ArrowLeft;

  constructor(private feedbackService: FeedbackService) {}

  async ngOnInit() {
    await this.loadFeedbacks();
  }

  async loadFeedbacks() {
    try {
      this.isLoading = true;
      this.feedbacks = await this.feedbackService.getAllFeedbacks();
      this.calculateStats();
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  calculateStats() {
    this.stats.total = this.feedbacks.length;
    this.stats.perfect = this.feedbacks.filter(f => f.rating === 'perfect').length;
    this.stats.good = this.feedbacks.filter(f => f.rating === 'good').length;
    this.stats.meh = this.feedbacks.filter(f => f.rating === 'meh').length;
    this.stats.bad = this.feedbacks.filter(f => f.rating === 'bad').length;

    const ratingValues = { perfect: 4, good: 3, meh: 2, bad: 1 };
    if (this.stats.total > 0) {
      const totalScore = this.feedbacks.reduce((sum, f) => sum + ratingValues[f.rating], 0);
      this.stats.satisfaction = Math.round((totalScore / (this.stats.total * 4)) * 100);
    }
  }

  getRatingLabel(rating: string): string {
    const labels: Record<string, string> = {
      perfect: 'FEEDBACK.PERFECT',
      good: 'FEEDBACK.GOOD',
      meh: 'FEEDBACK.MEH',
      bad: 'FEEDBACK.BAD'
    };
    return labels[rating] || rating;
  }

  getRatingClass(rating: string): string {
    const classes: Record<string, string> = {
      perfect: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      meh: 'bg-yellow-100 text-yellow-800',
      bad: 'bg-red-100 text-red-800'
    };
    return classes[rating] || 'bg-neutral-100 text-neutral-800';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
