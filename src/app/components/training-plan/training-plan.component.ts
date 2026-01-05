import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { TrainingPlan, WeekPlan, SessionPlan } from '../../models/TrainingPlan.model';

@Component({
  selector: 'app-training-plan',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.css']
})
export class TrainingPlanComponent {
  @Input() trainingPlan!: TrainingPlan;

  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  getSessionForDay(week: WeekPlan, day: string): SessionPlan | null {
    return week.sessions.find(session => session.day === day) || null;
  }
}
