import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'FytAI - Home'
  },
  {
    path: 'form',
    loadComponent: () => import('./components/form/form.component')
      .then(m => m.FormComponent),
    title: 'FytAI - Quiz'
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results.component')
      .then(m => m.ResultsComponent),
    title: 'FytAI - Results'
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
    path: 'examples',
    loadComponent: () => import('./components/examples/examples.component')
      .then(m => m.ExamplesComponent),
    title: 'FytAI - Examples'
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
