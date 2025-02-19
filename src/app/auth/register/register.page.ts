import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

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
  protected email = new FormControl('', [Validators.required, Validators.email])
  
  onLogin() {
    if (this.email.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    console.log('Register with:', this.email.value);
    this.navCtrl.navigateByUrl('/');
  }

  // Fonction utilitaire pour savoir si un champ est invalide
  isInvalid(): boolean {
    return this.email.invalid && this.email.touched;
  }

  goToLogIn(){
    this.navCtrl.navigateByUrl("/login");
  }

  

}
