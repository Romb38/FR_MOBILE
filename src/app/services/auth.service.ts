import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, user, UserCredential } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular/standalone"
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireauth = inject(Auth)
  private toastController = inject(ToastController)

  getConnectedUser() : Observable<User | null> {
    return user(this.fireauth)
  }

  isAuth() :  Observable<boolean> {
    const _authService = inject(AuthService)
    const _router = inject(Router)
    return _authService.getConnectedUser().pipe(
      map(user => {
        if (!user) _router.navigateByUrl('/login');
        return !!user;
      })
    )
  }

  sendVerifyEmailLink() {
    this.getConnectedUser().pipe(take(1)).subscribe(user => {
      if(user) {
        return sendEmailVerification(user)
      }
      return null
    })
  }

  async logOutConnectedUser(toastMessage : string = "") : Promise<void> {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
    
    return signOut(this.fireauth);
  }

  async sendForgotPasswordEmail(email : string) : Promise<void> {
    return sendPasswordResetEmail(this.fireauth, email)
  }

  async logInUser(email: string, password: string) : Promise<UserCredential> {
    return signInWithEmailAndPassword(this.fireauth, email, password);
  }

  async registerNewUser(email: string, password: string) : Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.fireauth, email, password);
  }
}
