import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';
import { ResultsComponent } from './components/results/results.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { ExamplesComponent } from './components/examples/examples.component';
import { FaqComponent } from './components/faq/faq.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'form', component: FormComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'examples', component: ExamplesComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
