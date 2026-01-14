import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Activity, Brain, Dumbbell, Heart, Leaf, LucideAngularModule, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent {
  readonly HeartIcon = Heart;
  readonly ActivityIcon = Activity;
  readonly BrainIcon = Brain;
  readonly LeafIcon = Leaf;
  readonly DumbbellIcon = Dumbbell;
  readonly SparklesIcon = Sparkles;

  analysisParameters = [
    { iconName: Heart, key: 'CARDIOVASCULAR' },
    { iconName: Dumbbell, key: 'MUSCULOSKELETAL' },
    { iconName: Sparkles, key: 'METABOLIC' },
    { iconName: Leaf, key: 'LIFESTYLE' },
    { iconName: Activity, key: 'PHYSICAL_ACTIVITY' },
    { iconName: Brain, key: 'MENTAL_HEALTH' }
  ];


  exerciseProfiles = [
    { nameKey: 'EXERCISE_WALKING', iconName: 'activity' },
    { nameKey: 'EXERCISE_CYCLING', iconName: 'bike' },
    { nameKey: 'EXERCISE_SWIMMING', iconName: 'waves' },
    { nameKey: 'EXERCISE_STRETCHING', iconName: 'leaf' },
    { nameKey: 'EXERCISE_STRENGTH', iconName: 'dumbbell' },
    { nameKey: 'EXERCISE_BREATHING', iconName: 'zap' },
    { nameKey: 'EXERCISE_BALANCE', iconName: 'target' },
    { nameKey: 'EXERCISE_RELAXATION', iconName: 'brain' }
  ];

  limitations = [
    'LIMITATION_1',
    'LIMITATION_2',
    'LIMITATION_3',
    'LIMITATION_4'
  ];

  capabilities = [
    'CAPABILITY_1',
    'CAPABILITY_2',
    'CAPABILITY_3',
    'CAPABILITY_4'
  ];
}
