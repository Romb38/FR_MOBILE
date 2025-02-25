import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonInput, 
    IonButton, 
    IonText, 
    IonLabel, 
    IonItem, 
    IonContent, 
    IonHeader, 
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class ForgotPasswordPage implements OnInit {

constructor() { }

  ngOnInit() { }
  protected hasEntered : Boolean = false;
  private navCtrl = inject(Router)
  private fb = inject(FormBuilder)
  private authController = inject(AuthService)
  protected forgotloginForm : FormGroup = this.fb.group({
    forgot_email: ['', [Validators.required, Validators.email]]
  });
  
  onForgotPassword() {
    if (this.forgotloginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    this.hasEntered = true;
    this.authController.sendForgotPasswordEmail(this.forgotloginForm.get('forgot_email')?.value)
  }

  isInvalid(field: string): boolean {
    return this.forgotloginForm.controls[field].invalid && this.forgotloginForm.controls[field].touched;
  }

  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }


}
