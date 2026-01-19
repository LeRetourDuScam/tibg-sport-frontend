import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Clock, X, ArrowRight } from 'lucide-angular';
import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminder-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
  template: `
    @if (reminderService.shouldShowReminder()) {
      <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center shrink-0">
            <lucide-angular [img]="ClockIcon" class="w-5 h-5 text-blue-600 dark:text-blue-400"></lucide-angular>
          </div>
          <div class="grow">
            <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">{{ 'REMINDER.TITLE' | translate }}</h4>
            <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
              {{ 'REMINDER.DESC' | translate:{ days: daysSinceLastTest } }}
            </p>
            <div class="flex gap-2">
              <a
                routerLink="/questionnaire-sante"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {{ 'REMINDER.CTA' | translate }}
                <lucide-angular [img]="ArrowRightIcon" class="w-3 h-3"></lucide-angular>
              </a>
              <button
                (click)="dismiss()"
                class="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md transition-colors cursor-pointer">
                {{ 'REMINDER.DISMISS' | translate }}
              </button>
            </div>
          </div>
          <button
            (click)="dismiss()"
            class="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 transition-colors cursor-pointer">
            <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    }
  `
})
export class ReminderBannerComponent {
  readonly ClockIcon = Clock;
  readonly CloseIcon = X;
  readonly ArrowRightIcon = ArrowRight;

  reminderService = inject(ReminderService);

  get daysSinceLastTest(): number {
    return this.reminderService.getDaysSinceLastTest() || 30;
  }

  dismiss(): void {
    this.reminderService.dismissReminder();
  }
}
