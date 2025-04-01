import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  private shakeThreshold = 40; // Seuil pour détecter une secousse
  private lastUpdate = 0;

  constructor() {
    this.startShakeDetection();
  }

  private async deviceShaked() {
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.translate
      .get(['HELP_TITLE', 'HELP_MESSAGE', 'YES', 'NO'])
      .subscribe(async (translations) => {
        const alert = await this.alertController.create({
          header: translations.HELP_TITLE, // 'Aide'
          message: translations.HELP_MESSAGE, // "Vous avez demandé de l'aide ?"
          buttons: [
            {
              text: translations.NO, // 'Non'
              role: 'cancel',
            },
            {
              text: translations.YES, // 'Oui'
              handler: () => {
                this.router.navigate(['/error-report']);
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
        if (deltaX + deltaY + deltaZ > this.shakeThreshold) {
          this.deviceShaked();
        }
      }
    });
  }
}
