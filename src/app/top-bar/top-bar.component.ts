import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

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

  constructor() { }

  ngOnInit() {
    if (this.title){
      this.butonId = this.title.trim().split(/\s+/)[0] || '';
    }
    console.log(this.butonId)
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
}
