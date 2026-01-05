import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'form',
    loadComponent: () => import('./components/form/form.component').then(m => m.FormComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'saved-results',
    loadComponent: () => import('./components/saved-results/saved-results.component').then(m => m.SavedResultsComponent)
  },
  {
    path: 'feedbacks',
    loadComponent: () => import('./components/feedbacks-list/feedbacks-list.component').then(m => m.FeedbacksListComponent)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./components/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  {
    path: 'examples',
    loadComponent: () => import('./components/examples/examples.component').then(m => m.ExamplesComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./components/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  { path: '**', redirectTo: '' }
];
