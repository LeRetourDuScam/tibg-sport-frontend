import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tibg-sport-frontend';

  constructor(private languageService: LanguageService) {}

  async ngOnInit() {
    // Initialise les traductions au démarrage de l'application
    await this.languageService.initializeLanguage();
  }
}
