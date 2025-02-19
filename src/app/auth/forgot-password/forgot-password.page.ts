import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonButton, IonText, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordPage implements OnInit {

constructor() { }

  ngOnInit() {
  }

  private navCtrl = inject(Router)
  protected hasEntered : Boolean = false;
  
  private fb = inject(FormBuilder)
  protected loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  
  onLogin() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    this.hasEntered = true;
    console.log('Connexion avec:', this.loginForm.value);
  }

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }
  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }


}
