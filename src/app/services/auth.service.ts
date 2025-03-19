import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, user, UserCredential } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { ToastController } from "@ionic/angular/standalone"
import { map, Observable, of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireauth = inject(Auth)
  private router = inject(Router)
  private toastController = inject(ToastController)

  getConnectedUser() : Observable<User | null> {
    return user(this.fireauth)
  }

  isAuth() :  Observable<boolean> {
    return this.getConnectedUser().pipe(
      map(user => {
        if (!user) this.router.navigateByUrl('/login');
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

  getUserEmail(): Observable<string> {
    return this.isAuth().pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.getConnectedUser().pipe(
            map(user => user?.email ?? '')
          );
        } else {
          return of('');
        }
      })
    );
  }
  
}
