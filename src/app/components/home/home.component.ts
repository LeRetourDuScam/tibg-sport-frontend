import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { LucideAngularModule } from 'lucide-angular';
import { PwaInstallBannerComponent } from '../pwa-install-banner/pwa-install-banner.component';
import { ReminderBannerComponent } from '../reminder-banner/reminder-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, LucideAngularModule, PwaInstallBannerComponent, ReminderBannerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLanguageMenu = false;

  constructor(public languageService: LanguageService) {}

  get languages() {
    return this.languageService.getAvailableLanguages();
  }

  async changeLanguage(lang: string) {
    await this.languageService.setLanguage(lang);
    this.showLanguageMenu = false;
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }
}
