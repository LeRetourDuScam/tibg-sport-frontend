import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent {
  analysisParameters = [
    { icon: '👤', key: 'PHYSICAL', count: 7 },
    { icon: '💪', key: 'HEALTH', count: 8 },
    { icon: '🎯', key: 'GOALS', count: 4 },
    { icon: '⏰', key: 'LIFESTYLE', count: 7 },
    { icon: '⚙️', key: 'PREFERENCES', count: 12 },
    { icon: '🧠', key: 'PSYCHOLOGY', count: 6 }
  ];

  sportProfiles = [
    { name: 'Natation', icon: '🏊' },
    { name: 'Course à pied', icon: '🏃' },
    { name: 'Cyclisme', icon: '🚴' },
    { name: 'Yoga', icon: '🧘' },
    { name: 'HIIT', icon: '⚡' },
    { name: 'Musculation', icon: '🏋️' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Danse', icon: '💃' },
    { name: 'Boxe', icon: '🥊' },
    { name: 'Escalade', icon: '🧗' },
    { name: 'Football', icon: '⚽' },
    { name: 'Basketball', icon: '🏀' }
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
