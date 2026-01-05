import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { SportAlternative } from '../../models/TrainingPlan.model';

@Component({
  selector: 'app-sport-comparison',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './sport-comparison.component.html',
  styleUrls: ['./sport-comparison.component.css']
})
export class SportComparisonComponent {
  @Input() alternatives: SportAlternative[] = [];

  get allSports() {
    return this.alternatives;
  }
}
