import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private readonly STORAGE_KEY = 'fytai_last_test_date';
  private readonly REMINDER_DAYS = 30;

  shouldShowReminder = signal(false);

  constructor() {
    this.checkReminder();
  }

  recordTestCompletion(): void {
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
    this.shouldShowReminder.set(false);
  }

  private checkReminder(): void {
    const lastTestDate = localStorage.getItem(this.STORAGE_KEY);
    if (!lastTestDate) {
      // No previous test, no reminder needed
      this.shouldShowReminder.set(false);
      return;
    }

    const lastDate = parseInt(lastTestDate, 10);
    const daysSinceTest = (Date.now() - lastDate) / (1000 * 60 * 60 * 24);

    this.shouldShowReminder.set(daysSinceTest >= this.REMINDER_DAYS);
  }

  getDaysSinceLastTest(): number | null {
    const lastTestDate = localStorage.getItem(this.STORAGE_KEY);
    if (!lastTestDate) return null;

    const lastDate = parseInt(lastTestDate, 10);
    return Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
  }

  dismissReminder(): void {
    this.shouldShowReminder.set(false);
  }
}
