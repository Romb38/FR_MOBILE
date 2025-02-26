import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonText, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInput, IonText, IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  ngOnInit() {}

  private navCtrl = inject(Router)
  private fb = inject(FormBuilder)
  private authController = inject(AuthService)
  protected loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  protected errorMessage = ""

  constructor() {}

  onLogin() {
    this.errorMessage = ""
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    this.authController.logInUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
    .then( () => {this.navCtrl.navigateByUrl('/');})
    .catch( (reason : any) => {
      if (reason instanceof FirebaseError){
        let error = reason as FirebaseError;
        switch (error.code) {
          case "auth/invalid-credential" :
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
}
