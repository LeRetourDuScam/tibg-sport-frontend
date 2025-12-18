import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent {
  analysisParameters = [
    { iconName: 'user-round', key: 'PHYSICAL', count: 7 },
    { iconName: 'heart-pulse', key: 'HEALTH', count: 8 },
    { iconName: 'target', key: 'GOALS', count: 4 },
    { iconName: 'clock', key: 'LIFESTYLE', count: 7 },
    { iconName: 'settings', key: 'PREFERENCES', count: 12 },
    { iconName: 'brain', key: 'PSYCHOLOGY', count: 6 }
  ];

  sportProfiles = [
    { name: 'Natation', iconName: 'waves' },
    { name: 'Course à pied', iconName: 'activity' },
    { name: 'Cyclisme', iconName: 'bike' },
    { name: 'Yoga', iconName: 'leaf' },
    { name: 'HIIT', iconName: 'zap' },
    { name: 'Musculation', iconName: 'dumbbell' },
    { name: 'Tennis', iconName: 'trophy' },
    { name: 'Danse', iconName: 'music' },
    { name: 'Boxe', iconName: 'shield' },
    { name: 'Escalade', iconName: 'mountain' },
    { name: 'Football', iconName: 'flag' },
    { name: 'Basketball', iconName: 'circle-dot' }
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
