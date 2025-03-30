import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { TopBarService } from '../services/topbar.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, CommonModule],
})
export class TopBarComponent implements OnInit {
  @Input() title: string = '';
  @Input() backRoute: string = '';
  buttonId: string = '';
  private router: Router = inject(Router);
  protected auth: AuthService = inject(AuthService);
  protected topBarService: TopBarService = inject(TopBarService);
  private homePage: string[] = ['/', '/login'];
  private accountInfosPage: string[] = ['/me'];
  protected isAuth$ = this.auth.isAuthenticated();
  protected isHomePage: boolean;
  protected isAccountInfosPage: boolean;

  constructor() {
    addIcons({ personCircleOutline });
    this.isHomePage = this.homePage.includes(this.router.url);
    this.isAccountInfosPage = this.accountInfosPage.includes(this.router.url);
  }

  ngOnInit() {
    if (this.title) {
      this.buttonId = this.title.trim().split(/\s+/)[0] || '';
    }
  }

  goTo() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([this.backRoute]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToAccountInfos() {
    this.router.navigate(['/me']);
  }
}
