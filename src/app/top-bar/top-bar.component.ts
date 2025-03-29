import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { TranslateConfigServiceService } from 'src/app/services/translate-config-service.service';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButton,
      IonButtons,
      IonIcon,
      CommonModule
  ],
})
export class TopBarComponent  implements OnInit {

  @Input() title : String = "";
  @Input() backRoute : String = ""
  butonId : String =""
  private router: Router = inject(Router)
  protected auth : AuthService = inject(AuthService)
  private translateConfigService = inject(TranslateConfigServiceService)
  private homePage : string[] = ['/','/login']
  private accountInfosPage : string[] = ["/me"]
  protected isAuth$ = this.auth.isAuthenticated();
  protected isHomePage : boolean;
  protected isAccountInfosPage : boolean;
  private language: any;
  protected icon: string;
  protected iconDarkMode: string;
  private ASSETS_PATH : string = "../../assets/icon/"

  constructor() {
    addIcons({personCircleOutline})

    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
    this.icon = this.ASSETS_PATH+this.language+".svg"
    this.isHomePage = this.homePage.includes(this.router.url);
    this.isAccountInfosPage = this.accountInfosPage.includes(this.router.url)
    const isDarkMode =  window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      this.iconDarkMode = this.ASSETS_PATH + "sunny-outline.svg"
    } else {
      this.iconDarkMode = this.ASSETS_PATH + "sunny-outline.svg"
    }
  }

  ngOnInit() {
    if (this.title){
      this.butonId = this.title.trim().split(/\s+/)[0] || '';
    }
  }

  goTo(){
    if (this.auth.isAuthenticated()){
      this.router.navigate([this.backRoute])
    } else {
      this.router.navigate(['/login'])
    }
  }

  goToAccountInfos(){
    this.router.navigate(['/me'])
  }

  switchLang(){
    switch (this.language){
      case "en":
        this.language = "fr"
        this.translateConfigService.setLanguage("fr")
        break
      case "fr":
        this.language = "en"
        this.translateConfigService.setLanguage("en")
        break
    }
    this.icon=this.ASSETS_PATH+this.language+".svg"
  }

  toggleDarkMode(){
    if (this.iconDarkMode.includes("sunny")) {
      this.iconDarkMode = this.ASSETS_PATH + "moon-outline.svg"
      document.documentElement.classList.toggle('ion-palette-dark', true);
    } else {
      this.iconDarkMode = this.ASSETS_PATH + "sunny-outline.svg"
      document.documentElement.classList.toggle('ion-palette-dark', false);

    }
  }

}
