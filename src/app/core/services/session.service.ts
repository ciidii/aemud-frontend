import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'aemud_auth_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private router = inject(Router);

  /**
   * Starts a new session by storing the token.
   *
   * @param token The session token to store.
   */
  startSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  /**
   * Clears the current session.
   */
  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem("user");
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl("auth/login");
  }

  /**
   * Retrieves the current session token.
   *
   * @returns The token or null if it doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Checks if a session token exists.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
