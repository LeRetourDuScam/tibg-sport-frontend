import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'formulaire', component: FormComponent },
  { path: 'resultats', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
