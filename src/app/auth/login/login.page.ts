import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonText, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

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
  protected loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor() {}

  onLogin() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    console.log('Connexion avec:', this.loginForm.value);
    this.navCtrl.navigateByUrl('/');
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
