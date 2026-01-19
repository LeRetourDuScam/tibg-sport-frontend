import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent, ConfirmationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tibg-sport-frontend';

  constructor(private languageService: LanguageService) {}

  async ngOnInit() {
    await this.languageService.initializeLanguage();
  }
}
