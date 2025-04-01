import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Motion } from '@capacitor/motion';

@Injectable({
  providedIn: 'root',
})
export class ShakeDetectionService {
  private toastController = inject(ToastController);
  private shakeThreshold = 40; // Seuil pour détecter une secousse
  private lastUpdate = 0;

  constructor() {
    this.startShakeDetection();
  }

  private async deviceShaked() {
    const toast = await this.toastController.create({
      message: "Vous avez demandé de l'aide ?",
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
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
