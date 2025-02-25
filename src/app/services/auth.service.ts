import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, user, UserCredential } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fireauth = inject(Auth)

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

  logOutConnectedUser() : Promise<void> {
    return signOut(this.fireauth);
  }

  sendForgotPasswordEmail(email : string) : Promise<void> {
    return sendPasswordResetEmail(this.fireauth, email)
  }

  logInUser(email: string, password: string) : Promise<UserCredential> {
    return signInWithEmailAndPassword(this.fireauth, email, password);
  }

  registerNewUser(email: string, password: string) : Promise<UserCredential>{
    return createUserWithEmailAndPassword(this.fireauth, email, password);
  }
}
