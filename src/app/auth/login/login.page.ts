import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonItem, IonButton, IonText, IonInput, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';
import { take } from 'rxjs';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonInput, IonText, IonButton, IonItem, IonLabel, IonContent, CommonModule, ReactiveFormsModule, TranslateModule, TopBarComponent]
})
export class LoginPage implements OnInit {
  ngOnInit() {}

  @Input() protected logOutMessage = ""
  private navCtrl = inject(Router)
  private fb = inject(FormBuilder)
  private authController = inject(AuthService)
  protected loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  protected errorMessage = ""

  constructor() {
    addIcons({ eyeOffOutline,eyeOutline });
  }

  protected showPassword : boolean = false;
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onLogin() {
    this.errorMessage = ""
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    this.authController.logInUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
    .then( () => {

      this.authController.getConnectedUser().pipe(take(1)).subscribe((user) => {
        if (!user){
          this.authController.logOutConnectedUser("An error has occured !").then(() => {
            this.navCtrl.navigate(['/'],{ replaceUrl: true})
          })
        } else {
          if (!user.emailVerified){
            this.authController.sendVerifyEmailLink()
            this.authController.logOutConnectedUser("Please verify your email, we have sent you another link !").then(() => {
              this.navCtrl.navigate(['/'],{ replaceUrl: true})
            })
          } else {
            this.navCtrl.navigate(['/'],{ replaceUrl: true})
          }
        }

      })

    })
    .catch( (reason : any) => {
      if (reason instanceof FirebaseError){
        let error = reason as FirebaseError;
        switch (error.code) {
          case "auth/invalid-credential" :
            this.errorMessage = "Invalid e-mail or password"
            break;
          case "auth/invalid-email":
            this.errorMessage = "Invalid e-mail or password"
            break;
          default:
            this.errorMessage = "An error as occured, please retry or contact an administrator"
            break;
        }
      } else {
        this.errorMessage = "An error as occured, please retry or contact an administrator"
      }
    })
  }

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  goToRegister(){
    this.navCtrl.navigateByUrl('/register');
  }

  goToForgotPassword(){
    this.navCtrl.navigateByUrl('/forgot-password');
  }

  async signInWithGoogle() {
    try {
      // Handle the result (e.g., send token to your backend, navigate, etc.)
      const result = await FirebaseAuthentication.signInWithGoogle();
      this.navCtrl.navigate(['/'],{ replaceUrl: true});
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  }
}
