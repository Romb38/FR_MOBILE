import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonContent, IonTextarea, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { ErrorReportService } from '../services/error-report.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss'],
  imports: [IonButton, IonTextarea, IonContent, TopBarComponent, TranslateModule, FormsModule],
})
export class ErrorReportComponent implements OnInit {
  constructor() {}
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private toastController = inject(ToastController);
  private errorReportService = inject(ErrorReportService);
  private email: string = 'anonymUser';
  reportText: string = '';

  ngOnInit() {
    this.authService.getUserEmail().subscribe((email: string) => {
      if (email) {
        this.email = email;
      }
    });
  }

  submitReport() {
    console.log(this.reportText);
    if (this.reportText.length === 0) {
      this.translate.get('EMPTY_MESSAGE').subscribe(async (translation: string) => {
        const toast = await this.toastController.create({
          message: translation,
          duration: 1500,
          position: 'bottom',
        });
        await toast.present();
      });
      return;
    }

    this.errorReportService
      .sendReport(this.email, this.reportText)
      .then(() => {
        this.translate.get('ERROR_REPORT_SUCESS').subscribe(async (translation: string) => {
          const toast = await this.toastController.create({
            message: translation,
            duration: 1500,
            position: 'bottom',
          });
          await toast.present();
        });
        this.reportText = '';
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.debug(error);
        this.translate.get('ERROR_GENERAL').subscribe(async (translation: string) => {
          const toast = await this.toastController.create({
            message: translation,
            duration: 1500,
            position: 'bottom',
          });
          await toast.present();
        });
      });
  }

  cancel() {
    this.reportText = '';
    this.router.navigate(['/']);
  }
}
