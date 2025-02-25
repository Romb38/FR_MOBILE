import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { has } from 'cypress/types/lodash';

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
  protected loginForm : FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  },
{ validators: this.passwordMatchValidator, updateOn: 'blur' });
  protected hasRegister : boolean = false;
  
  onLogin() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    this.hasRegister=true;
    console.log('Register with :', this.loginForm.value);
  }

  isInvalid(field: string): boolean {
    return this.loginForm.controls[field].invalid && this.loginForm.controls[field].touched;
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }
}
