import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonText, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, RouterLink]
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
  protected errorMessage : String = ""
  
  onRegister() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    
    
    this.authController.registerNewUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
    .then(() => {
      this.hasRegister=true;
      this.authController.sendVerifyEmailLink()
      this.authController.logOutConnectedUser("Please verify your email !")
    })
    .catch( (reason : any) => {
      if (reason instanceof FirebaseError){
              let error = reason as FirebaseError;
              switch (error.code) {
                case "auth/invalid-email" :
                  this.errorMessage = "Invalid e-mail, please provide a valid email"
                  break;
                case "auth/invalid-password" : 
                  this.errorMessage = "Invalid password, it must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                  break;
                case "auth/email-already-in-use" :
                  this.errorMessage = `This e-mail is already taken, if it's your account you can try to`
                  break
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
