import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = 'fr';
  private initialized = false;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  async initializeLanguage(): Promise<void> {
    if (this.initialized) return;

    const savedLang = localStorage.getItem('language');
    const lang = savedLang && ['fr', 'en', 'pt'].includes(savedLang) ? savedLang : 'fr';

    await this.setLanguage(lang);
    this.initialized = true;
  }

  async setLanguage(lang: string): Promise<void> {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);

    await firstValueFrom(this.translate.use(lang));
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' }
    ];
  }
}
