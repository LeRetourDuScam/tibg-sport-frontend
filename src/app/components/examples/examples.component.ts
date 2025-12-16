import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface ExampleProfile {
  id: number;
  name: string;
  age: number;
  situation: string;
  challenges: string[];
  recommendedSport: string;
  sportIcon: string;
  score: number;
  keyBenefits: string[];
  whyThisSport: string;
}

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent {
  selectedProfile: ExampleProfile | null = null;

  profiles: ExampleProfile[] = [
    {
      id: 1,
      name: 'Marie',
      age: 34,
      situation: 'MARIE_SITUATION',
      challenges: ['MARIE_CHALLENGE_1', 'MARIE_CHALLENGE_2', 'MARIE_CHALLENGE_3'],
      recommendedSport: 'Natation',
      sportIcon: '🏊',
      score: 92,
      keyBenefits: ['MARIE_BENEFIT_1', 'MARIE_BENEFIT_2', 'MARIE_BENEFIT_3'],
      whyThisSport: 'MARIE_WHY'
    },
    {
      id: 2,
      name: 'Thomas',
      age: 28,
      situation: 'THOMAS_SITUATION',
      challenges: ['THOMAS_CHALLENGE_1', 'THOMAS_CHALLENGE_2', 'THOMAS_CHALLENGE_3'],
      recommendedSport: 'HIIT',
      sportIcon: '⚡',
      score: 88,
      keyBenefits: ['THOMAS_BENEFIT_1', 'THOMAS_BENEFIT_2', 'THOMAS_BENEFIT_3'],
      whyThisSport: 'THOMAS_WHY'
    },
    {
      id: 3,
      name: 'Sophie',
      age: 45,
      situation: 'SOPHIE_SITUATION',
      challenges: ['SOPHIE_CHALLENGE_1', 'SOPHIE_CHALLENGE_2', 'SOPHIE_CHALLENGE_3'],
      recommendedSport: 'Vélo elliptique',
      sportIcon: '🚴',
      score: 85,
      keyBenefits: ['SOPHIE_BENEFIT_1', 'SOPHIE_BENEFIT_2', 'SOPHIE_BENEFIT_3'],
      whyThisSport: 'SOPHIE_WHY'
    },
    {
      id: 4,
      name: 'Lucas',
      age: 52,
      situation: 'LUCAS_SITUATION',
      challenges: ['LUCAS_CHALLENGE_1', 'LUCAS_CHALLENGE_2', 'LUCAS_CHALLENGE_3'],
      recommendedSport: 'Yoga',
      sportIcon: '🧘',
      score: 90,
      keyBenefits: ['LUCAS_BENEFIT_1', 'LUCAS_BENEFIT_2', 'LUCAS_BENEFIT_3'],
      whyThisSport: 'LUCAS_WHY'
    },
    {
      id: 5,
      name: 'Émilie',
      age: 22,
      situation: 'EMILIE_SITUATION',
      challenges: ['EMILIE_CHALLENGE_1', 'EMILIE_CHALLENGE_2', 'EMILIE_CHALLENGE_3'],
      recommendedSport: 'Danse fitness',
      sportIcon: '💃',
      score: 94,
      keyBenefits: ['EMILIE_BENEFIT_1', 'EMILIE_BENEFIT_2', 'EMILIE_BENEFIT_3'],
      whyThisSport: 'EMILIE_WHY'
    }
  ];

  selectProfile(profile: ExampleProfile) {
    this.selectedProfile = this.selectedProfile?.id === profile.id ? null : profile;
  }
}
