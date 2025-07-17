import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'aemud_auth_token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() { }

  /**
   * Checks if a session token exists.
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

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
    this.isLoggedInSubject.next(false);
  }

  /**
   * Retrieves the current session token.
   *
   * @returns The token or null if it doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
