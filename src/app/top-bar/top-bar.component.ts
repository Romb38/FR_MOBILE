import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { TranslateConfigServiceService } from 'src/app/services/translate-config-service.service';

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
  protected isAuth$ = this.auth.isAuth();
  protected isHomePage : boolean;
  private language: any;
  protected icon: string;

  constructor() {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
    this.icon = "../../assets/icon/"+this.language+".svg"
    this.isHomePage = this.homePage.includes(this.router.url);
  }

  ngOnInit() {
    if (this.title){
      this.butonId = this.title.trim().split(/\s+/)[0] || '';
    }
  }

  goTo(){
    if (this.auth.isAuth()){
      this.router.navigate([this.backRoute])
    } else {
      this.router.navigate(['/login'])
    }
  }

  logout(){
    this.auth.logOutConnectedUser()
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
    this.icon="../../assets/icon/"+this.language+".svg"
  }
}
