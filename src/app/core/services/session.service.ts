import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly USER_KEY = 'user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private router = inject(Router);

  /**
   * Creates a new session by storing the user object.
   *
   * @param user The user object to store.
   */
  create(user: UserModel): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  /**
   * Clears the current session.
   */
  clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl("auth/login");
  }

  /**
   * Checks if a user object exists in storage.
   */
  private hasUser(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }
}

