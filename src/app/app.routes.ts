import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'FytAI - Home'
  },
  {
    path: 'questionnaire-sante',
    loadComponent: () => import('./components/health-questionnaire/health-questionnaire.component')
      .then(m => m.HealthQuestionnaireComponent),
    title: 'FytAI - Questionnaire Santé'
  },
  {
    path: 'resultats-sante',
    loadComponent: () => import('./components/health-results/health-results.component')
      .then(m => m.HealthResultsComponent),
    title: 'FytAI - Résultats Santé'
  },
  {
    path: 'saved-results',
    loadComponent: () => import('./components/saved-results/saved-results.component')
      .then(m => m.SavedResultsComponent),
    title: 'FytAI - Saved Results'
  },
  {
    path: 'feedbacks',
    loadComponent: () => import('./components/feedbacks-list/feedbacks-list.component')
      .then(m => m.FeedbacksListComponent),
    title: 'FytAI - Feedbacks List'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent),
    title: 'FytAI - About'
  },
  {
    path: 'faq',
    loadComponent: () => import('./components/faq/faq.component')
      .then(m => m.FaqComponent),
    title: 'FytAI - FAQ'
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./components/how-it-works/how-it-works.component')
      .then(m => m.HowItWorksComponent),
    title: 'FytAI - How It Works'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
