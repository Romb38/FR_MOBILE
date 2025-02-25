import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  protected forgotloginForm : FormGroup = this.fb.group({
    forgot_email: ['', [Validators.required, Validators.email]],
  });
  
  onLogin() {
    if (this.forgotloginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    this.hasEntered = true;
    console.log(' Forgot password with :', this.forgotloginForm.value);
  }

  isInvalid(field: string): boolean {
    return this.forgotloginForm.controls[field].invalid && this.forgotloginForm.controls[field].touched;
  }

  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }


}
