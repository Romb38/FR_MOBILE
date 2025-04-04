import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonLabel,
  IonItem,
  IonButton,
  IonText,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';
import { take } from 'rxjs';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonInput,
    IonText,
    IonButton,
    IonItem,
    IonLabel,
    IonContent,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TopBarComponent,
  ],
})
export class LoginPageComponent {
  @Input() protected logOutMessage = '';
  private navCtrl = inject(Router);
  private fb = inject(FormBuilder);
  private authController = inject(AuthService);
  private translate = inject(TranslateService);
  protected loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  protected errorMessage = '';

  constructor() {
    addIcons({ eyeOffOutline, eyeOutline });
  }

  protected showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    this.authController
      .logInUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .then(() => {
        this.authController
          .getConnectedUser()
          .pipe(take(1))
          .subscribe((user) => {
            if (!user) {
              this.translate.get('DEFAULT_ERRERROR_GENERALOR').subscribe((translated: string) => {
                this.authController.logOutConnectedUser(translated).then(() => {
                  this.navCtrl.navigate(['/'], { replaceUrl: true });
                });
              });
            } else {
              if (!user.emailVerified) {
                this.translate.get('EMAIL_VERIFICATION').subscribe((translated: string) => {
                  this.authController.sendVerifyEmailLink();
                  this.authController.logOutConnectedUser(translated).then(() => {
                    this.navCtrl.navigate(['/'], { replaceUrl: true });
                  });
                });
              } else {
                this.navCtrl.navigate(['/'], { replaceUrl: true });
              }
            }
          });
      })
      .catch((reason) => {
        if (reason instanceof FirebaseError) {
          const error = reason as FirebaseError;
          switch (error.code) {
            case 'auth/invalid-credential':
              this.translate.get('INVALID_EMAIL_PASSWORD').subscribe((translated: string) => {
                this.errorMessage = translated;
              });
              break;
            case 'auth/invalid-email':
              this.translate.get('INVALID_EMAIL_PASSWORD').subscribe((translated: string) => {
                this.errorMessage = translated;
              });
              break;
            default:
              this.translate.get('ERROR_GENERAL').subscribe((translated: string) => {
                this.errorMessage = translated;
              });
              break;
          }
        } else {
          this.translate.get('ERROR_GENERAL').subscribe((translated: string) => {
            this.errorMessage = translated;
          });
        }
      });
  }

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  goToRegister() {
    this.navCtrl.navigateByUrl('/register');
  }

  goToForgotPassword() {
    this.navCtrl.navigateByUrl('/forgot-password');
  }

  async signInWithGoogle() {
    try {
      // Handle the result (e.g., send token to your backend, navigate, etc.)
      await FirebaseAuthentication.signInWithGoogle();
      this.navCtrl.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  }
}
