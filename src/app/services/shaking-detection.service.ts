import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { Motion } from '@capacitor/motion';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class ShakeDetectionService {
  private alertController = inject(AlertController);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private shakeThreshold = 40; // default : 40
  private lastUpdate = 0;
  private isShaking = false;
  private disableRoute = ['/error-report'];

  constructor() {
    this.startShakeDetection();
  }

  private async deviceShaked() {
    this.isShaking = true;
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.translate
      .get(['HELP_TITLE', 'HELP_MESSAGE', 'YES', 'NO'])
      .subscribe(async (translations) => {
        const alert = await this.alertController.create({
          header: translations.HELP_TITLE || 'HELP_TITLE',
          message: translations.HELP_MESSAGE || 'HELP_MESSAGE',
          buttons: [
            {
              text: translations.NO || 'NO',
              role: 'cancel',
              handler: () => (this.isShaking = false),
            },
            {
              text: translations.YES || 'YES',
              handler: () => {
                this.router.navigate(['/error-report']);
                this.isShaking = false;
              },
            },
          ],
        });

        await alert.present();
      });
  }

  private startShakeDetection() {
    Motion.addListener('accel', (event) => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastUpdate > 100) {
        // Vérifier toutes les 100ms
        this.lastUpdate = currentTime;

        const { x, y, z } = event.acceleration!;
        const deltaX = Math.abs(x);
        const deltaY = Math.abs(y);
        const deltaZ = Math.abs(z);
        // Détecter un pic soudain d'accélération (secousse)
        if (
          deltaX + deltaY + deltaZ > this.shakeThreshold &&
          !this.isShaking &&
          !this.disableRoute.includes(this.router.url)
        ) {
          this.deviceShaked();
        }
      }
    });
  }
}
