import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { has } from 'cypress/types/lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonText, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  private navCtrl = inject(Router)
  private fb = inject(FormBuilder)
  private authController = inject(AuthService)
  protected loginForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );
  protected hasRegister : boolean = false;
  
  onRegister() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    this.hasRegister=true;
    this.authController.registerNewUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
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
  

  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }
}
