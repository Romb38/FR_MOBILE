import { inject, Injectable } from '@angular/core';
import { TranslateConfigService } from './translate-config.service';

@Injectable({
  providedIn: 'root',
})
export class TopBarService {
  private language = 'fr';
  private isDarkMode = false;
  private translateConfigService: TranslateConfigService = inject(TranslateConfigService);
  private readonly ASSETS_PATH: string = '../../assets/icon/';

  constructor() {
    // Init and set language
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();

    // Set dark mode
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  getLanguageIconPath(): string {
    console.debug(this.ASSETS_PATH + this.language + '.svg');
    return this.ASSETS_PATH + this.language + '.svg';
  }

  public getLightOrDarkModeIconPath() {
    const icon = this.isDarkMode ? 'sunny' : 'moon';
    return `${this.ASSETS_PATH}${icon}-outline.svg`;
  }

  switchLang() {
    switch (this.language) {
      case 'en':
        this.translateConfigService.setLanguage('fr');
        this.language = 'fr';
        break;
      case 'fr':
        this.translateConfigService.setLanguage('en');
        this.language = 'en';
        break;
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('ion-palette-dark', !this.isDarkMode);
  }
}
