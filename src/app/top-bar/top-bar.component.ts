import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { TranslateConfigServiceService } from 'src/app/services/translate-config-service.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],imports: [
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButton,
      IonButtons,
      IonIcon,
  ],
})
export class TopBarComponent  implements OnInit {

  @Input() title : String = "";
  @Input() backRoute : String = ""
  butonId : String =""
  private router: Router = inject(Router)
  protected auth : AuthService = inject(AuthService)
  private translateConfigService = inject(TranslateConfigServiceService)
  protected isHomePage : boolean;
  private language: any;
  protected icon: string;

  constructor() {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
    this.icon = "../../assets/icon/"+this.language+".svg"
    this.isHomePage = (this.router.url === '/')
   }

  ngOnInit() {
    if (this.title){
      this.butonId = this.title.trim().split(/\s+/)[0] || '';
    }
  }

  goTo(){
    this.router.navigate([this.backRoute])
  }

  logout(){
    this.auth.logOutConnectedUser()
    this.router.navigate(["login"]).then(() => {
      window.location.reload();
    });
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
    console.log(this.icon)
  }
}
