import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ThumbsUp, ThumbsDown, Meh, Frown } from 'lucide-angular';
import { FeedbackService, FeedbackRating } from '../../services/feedback.service';
import { FeedbackTarget } from '../../models/FeedbackTarget.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @Input() target!: FeedbackTarget;

  selectedRating: FeedbackRating | null = null;
  feedbackComment = '';
  isSubmitted = false;
  isSubmitting = false;

  readonly ratings: FeedbackRating[] = ['perfect', 'good', 'meh', 'bad'];
  readonly ThumbsUpIcon = ThumbsUp;
  readonly ThumbsDownIcon = ThumbsDown;
  readonly MehIcon = Meh;
  readonly FrownIcon = Frown;

  constructor(
    private feedbackService: FeedbackService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {}

  selectRating(rating: FeedbackRating) {
    this.selectedRating = rating;
  }

  async submitFeedback() {
    if (!this.selectedRating || this.isSubmitting || this.isCommentTooLong()) return;

    this.isSubmitting = true;

    try {
      await this.feedbackService.submitFeedback({
        rating: this.selectedRating,
        comment: this.feedbackComment,
        sport: this.target.sport,
        score: this.target.score,
        context: this.target.context || 'health-questionnaire-result'
      });

      this.isSubmitted = true;
    } catch (error) {
      console.error('Feedback submission error:', error);
      this.snackbar.error('FEEDBACK.ERROR');
    } finally {
      this.isSubmitting = false;
    }
  }

  isCommentTooLong(): boolean {
    return this.feedbackComment.length > 300;
  }

  get remainingCharacters(): number {
    return 300 - this.feedbackComment.length;
  }

  getRatingLabel(rating: FeedbackRating): string {
    const labels = {
      'perfect': 'FEEDBACK.PERFECT',
      'good': 'FEEDBACK.GOOD',
      'meh': 'FEEDBACK.MEH',
      'bad': 'FEEDBACK.BAD'
    };
    return labels[rating];
  }

  getRatingIcon(rating: FeedbackRating) {
    const icons = {
      'perfect': this.ThumbsUpIcon,
      'good': this.ThumbsUpIcon,
      'meh': this.MehIcon,
      'bad': this.FrownIcon
    };
    return icons[rating];
  }
}
