import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'L\'équipe FytAI',
      role: 'ABOUT.ROLE_DEVELOPERS',
      avatarIcon: 'laptop',
      description: 'ABOUT.TEAM_DESC'
    }
  ];

  techStack = [
    { name: 'Angular', iconName: 'code-2', description: 'ABOUT.TECH_ANGULAR' },
    { name: '.NET Core', iconName: 'circle-dot', description: 'ABOUT.TECH_DOTNET' },
    { name: 'Groq AI', iconName: 'bot', description: 'ABOUT.TECH_AI' },
    { name: 'Groq', iconName: 'sparkles', description: 'ABOUT.TECH_GROQ' }
  ];

  values = [
    { iconName: 'shield', titleKey: 'ABOUT.VALUE_PRIVACY_TITLE', descKey: 'ABOUT.VALUE_PRIVACY_DESC' },
    { iconName: 'target', titleKey: 'ABOUT.VALUE_ACCURACY_TITLE', descKey: 'ABOUT.VALUE_ACCURACY_DESC' },
    { iconName: 'message-square', titleKey: 'ABOUT.VALUE_TRANSPARENCY_TITLE', descKey: 'ABOUT.VALUE_TRANSPARENCY_DESC' },
    { iconName: 'gift', titleKey: 'ABOUT.VALUE_FREE_TITLE', descKey: 'ABOUT.VALUE_FREE_DESC' }
  ];
}
