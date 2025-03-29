import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-account-infos',
  templateUrl: './account-infos.component.html',
  styleUrls: ['./account-infos.component.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonText,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    TopBarComponent,
    TranslateModule,
  ],
})
export class AccountInfosComponent implements OnInit {
  private router: Router = inject(Router);
  protected auth: AuthService = inject(AuthService);
  protected userEmail: string = '';

  constructor() {}

  ngOnInit() {
    addIcons({ logOutOutline });
    this.auth.getUserEmail().subscribe((email) => {
      if (email) {
        this.userEmail = email;
      }
    });
  }

  logout() {
    this.auth.logOutConnectedUser();
    this.router.navigate(['/login']);
  }
}
