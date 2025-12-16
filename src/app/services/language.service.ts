import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = 'fr';
  
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    
    const savedLang = localStorage.getItem('language');
    if (savedLang && ['fr', 'en', 'pt'].includes(savedLang)) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('fr');
    }
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' }
    ];
  }
}
