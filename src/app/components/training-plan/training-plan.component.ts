import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingPlan } from '../../models/TrainingPlan.model';

@Component({
  selector: 'app-training-plan',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.css']
})
export class TrainingPlanComponent {
  @Input() trainingPlan!: TrainingPlan;
}
