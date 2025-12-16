import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'L\'équipe FytAI',
      role: 'ABOUT.ROLE_DEVELOPERS',
      avatar: '👨‍💻',
      description: 'ABOUT.TEAM_DESC'
    }
  ];

  techStack = [
    { name: 'Angular', icon: '🅰️', description: 'ABOUT.TECH_ANGULAR' },
    { name: '.NET Core', icon: '🔷', description: 'ABOUT.TECH_DOTNET' },
    { name: 'Groq AI', icon: '🤖', description: 'ABOUT.TECH_AI' },
    { name: 'Groq', icon: '🤗', description: 'ABOUT.TECH_GROQ' }
  ];

  values = [
    { icon: '🔒', titleKey: 'ABOUT.VALUE_PRIVACY_TITLE', descKey: 'ABOUT.VALUE_PRIVACY_DESC' },
    { icon: '🎯', titleKey: 'ABOUT.VALUE_ACCURACY_TITLE', descKey: 'ABOUT.VALUE_ACCURACY_DESC' },
    { icon: '💬', titleKey: 'ABOUT.VALUE_TRANSPARENCY_TITLE', descKey: 'ABOUT.VALUE_TRANSPARENCY_DESC' },
    { icon: '🆓', titleKey: 'ABOUT.VALUE_FREE_TITLE', descKey: 'ABOUT.VALUE_FREE_DESC' }
  ];
}
