// src/app/core/services/auth-http.service.ts
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs'; // 'map' n'est pas strictement nécessaire ici si on émet directement un booléen, mais peut être gardé.
import {delay, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    console.log('good here');
    const isValidCredentials = (email === 'test@gmail.com' && password === 'passer');

    return of(isValidCredentials).pipe( // <-- CORRECTION ICI : of(true) ou of(false)
      delay(1000), // Simule un délai réseau
      tap(success => {
        console.log('Now reached: tap operator is executing!');
        if (success) { // La logique est désormais basée sur la valeur émise par of()
          const fakeToken = 'fake_jwt_token_12345';
          localStorage.setItem('access_token', fakeToken);
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/orders']);
          console.log('Login successful in AuthHttpService');
        } else {
          this.isAuthenticatedSubject.next(false);
          console.error('Invalid credentials in AuthHttpService: Provided email/password do not match expected values.');
          // Si l'authentification échoue, il est préférable de lancer une erreur ici
          // pour que le 'error' callback de subscribe soit déclenché.
          throw new Error('Invalid credentials');
        }
      })
      // Pas besoin de map si la logique de tap gère déjà la redirection et le throwError.
      // Le 'of(isValidCredentials)' fait que l'observable émettra 'true' ou 'false' à la fin du pipe.
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
