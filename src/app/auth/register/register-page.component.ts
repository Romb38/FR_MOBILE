import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  IonContent,
  IonLabel,
  IonItem,
  IonText,
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonInput,
    IonButton,
    IonText,
    IonItem,
    IonLabel,
    IonContent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TopBarComponent,
    TranslateModule,
  ],
})
export class RegisterPageComponent {
  constructor() {
    addIcons({ eyeOffOutline, eyeOutline });
  }

  private navCtrl = inject(Router);
  private fb = inject(FormBuilder);
  private authController = inject(AuthService);
  private translate = inject(TranslateService);
  protected loginForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );
  protected hasRegister: boolean = false;
  protected errorMessage: string = '';
  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authController
      .registerNewUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .then(() => {
        this.hasRegister = true;
        this.authController.sendVerifyEmailLink();
        this.authController.logOutConnectedUser('Please verify your email !');
      })
      .catch((reason) => {
        if (reason instanceof FirebaseError) {
          const error = reason as FirebaseError;
          switch (error.code) {
            case 'auth/invalid-email':
              this.translate.get('ERROR_INVALID_EMAIL').subscribe((translation: string) => {
                this.errorMessage = translation;
              });
              break;
            case 'auth/invalid-password':
              this.translate.get('ERROR_INVALID_PASSWORD').subscribe((translation: string) => {
                this.errorMessage = translation;
              });
              break;
            case 'auth/email-already-in-use':
              this.translate.get('ERROR_EMAIL_ALREADY_IN_USE').subscribe((translation: string) => {
                this.errorMessage = translation;
              });
              break;
            default:
              this.translate.get('ERROR_GENERAL').subscribe((translation: string) => {
                this.errorMessage = translation;
              });
              break;
          }
        } else {
          this.translate.get('ERROR_GENERAL').subscribe((translation: string) => {
            this.errorMessage = translation;
          });
        }
      });
  }

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

      if (!password || strongPasswordRegex.test(password)) {
        return null;
      }

      return { weakPassword: true };
    };
  }

  goToLogIn() {
    this.navCtrl.navigateByUrl('/login');
  }
}
