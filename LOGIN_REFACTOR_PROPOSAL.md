# Proposition de Refactoring : Page de Connexion

Ce document détaille les modifications nécessaires pour aligner la page de connexion et les services associés avec le `FRONTEND_MIGRATION_GUIDE.md`.

---

## 1. Refactoring de `session.service.ts`

**Objectif :** Supprimer toute gestion du token JWT côté client, conformément à la nouvelle stratégie de cookie `HttpOnly`. Le service ne gérera plus que l'état de connexion (`isLoggedIn$`) et le nettoyage des données utilisateur.

### Fichier : `src/app/core/services/session.service.ts`

#### Code Actuel :
```typescript
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

  startSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem("user");
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl("auth/login");
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
```

#### Proposition de Code :
Le service est simplifié. La méthode `startSession` prend maintenant un `UserModel` et `isLoggedIn$` est basé sur la présence de l'utilisateur dans le `localStorage`. La manipulation de token est entièrement supprimée.

```typescript
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";
import {UserModel} from "../../core/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUser());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private router = inject(Router);

  /**
   * Démarre une session en stockant l'utilisateur et en notifiant l'état de connexion.
   */
  startSession(user: UserModel): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  /**
   * Efface les données de session du client (appelé après le logout API).
   */
  clearSession(): void {
    localStorage.removeItem("user");
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl("auth/login");
  }

  /**
   * Vérifie si un utilisateur est stocké localement.
   */
  private hasUser(): boolean {
    return !!localStorage.getItem("user");
  }
}
```

---

## 2. Refactoring de `auth.interceptor.ts`

**Objectif :** Supprimer l'injection du header `Authorization`, car le navigateur gère désormais le cookie `HttpOnly` automatiquement. L'intercepteur peut être simplifié pour gérer les erreurs globales comme une session expirée (`401 Unauthorized`).

### Fichier : `src/app/core/interceptors/auth.interceptor.ts`

#### Code Actuel :
```typescript
// ... imports
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toaster = inject(ToastrService);
  const authToken = localStorage.getItem('aemud_auth_token');
  
  // ... logique des endpoints publics
  
  const authReq = authToken && req.url.includes('api/') && !isPublic
    ? req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    })
    : req;

  return next(authReq).pipe(
    // ...
    catchError((error: HttpErrorResponse) => {
      if (error?.error?.error?.code === "JWT_TOKEN_EXPIRED") {
        toaster.warning("Votre session a expiré, veuillez vous reconnecter !");
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
```

#### Proposition de Code :
La logique d'ajout de header est supprimée. La gestion d'erreur est mise à jour pour réagir à un statut `401 Unauthorized`, ce qui est plus standard pour une session expirée.

```typescript
import {inject} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../../features/auth/services/auth.service";
import {ToastrService} from "ngx-toastr"; // Ou NotificationService

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const toaster = inject(ToastrService); // Remplacer par NotificationService si standardisé

  // Le header 'Authorization' n'est plus nécessaire.
  // On ajoute 'withCredentials: true' pour que le navigateur envoie les cookies.
  const apiReq = req.clone({ withCredentials: true });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gérer les sessions expirées de manière standard
      if (error.status === 401) {
        toaster.warning("Votre session a expiré, veuillez vous reconnecter !");
        // Utiliser le nouveau logout qui appelle l'API
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
```

---

## 3. Refactoring de `auth.service.ts`

**Objectif :** Adapter le service à la nouvelle API : le `login` ne reçoit plus de token et le `logout` doit appeler un nouvel endpoint.

### Fichier : `src/app/features/auth/services/auth.service.ts`

#### Logique Actuelle (extraits) :
```typescript
// login()
return this.http.post<any>(/*...* /).pipe(
  tap(response => {
    this.sessionService.startSession(response.data.jwt);
    this.fetchJwt(response.data.jwt);
  })
);

// fetchJwt(jwt: string)
// ... décode le jwt, stocke le token, appelle getUserByUsername...

// logout()
this.sessionService.clearSession();
```

#### Proposition de Code :
`fetchJwt` est supprimé. Le `login` gère directement la réponse (qui contiendrait les infos utilisateur). Le `logout` appelle le nouvel endpoint.

```typescript
import {inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
// ... autres imports

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private sessionService = inject(SessionService);
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Plus de stockage de token ici
  private currentUser: UserModel | null = null;

  constructor() {
    // Initialise l'utilisateur depuis le localStorage au démarrage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }
  
  // ... getUserByUsername, hasRole, etc.

  login(credentials: UserCredential): Observable<ResponseEntityApi<UserModel>> {
    return this.http.post<ResponseEntityApi<UserModel>>(`${this.apiUrl}/auth/authenticate`, credentials)
      .pipe(
        tap(response => {
          // La réponse contient maintenant directement l'objet utilisateur
          const user = response.data;
          this.currentUser = user;
          // On utilise le nouveau SessionService
          this.sessionService.startSession(user);
          // La redirection se fait ici
          this.redirectToTheRightPage(user);
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => this.sessionService.clearSession(),
      error: () => this.sessionService.clearSession() // Toujours déconnecter le client même si l'API échoue
    });
  }

  redirectToTheRightPage(userFromApi: UserModel): void {
    if (userFromApi.forcePasswordChange) {
      this.router.navigateByUrl('auth/first-connection-password');
    } else if (userFromApi.locked) {
      this.router.navigateByUrl('auth/login');
    } else {
      this.router.navigateByUrl('members/list-members');
    }
  }

  // La méthode fetchJwt() est à supprimer.
}
```

---

## 4. Améliorations du `login.component.ts`

**Objectif :** Gérer la nouvelle structure d'erreur de l'API pour afficher des messages par champ.

### Fichier : `src/app/features/auth/pages/login/login.component.ts`

#### Proposition de Code :
On ajoute un objet `formErrors` pour stocker les erreurs par champ et on met à jour la logique de `handleLogin`.

```typescript
// ... imports

@Component({ /* ... */ })
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  // Gérer les erreurs par champ et les erreurs globales
  formErrors: { [key: string]: string } = {};
  globalError: string | null = null;

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]], // Suggestion: valider comme un email si c'est le cas
      password: ['', [Validators.required]]
    });
  }

  handleLogin(): void {
    if (this.formGroup.invalid) {
      return;
    }
    // Réinitialiser les erreurs
    this.globalError = null;
    this.formErrors = {};
    this._loading.next(true);

    this.authService.login(this.formGroup.value)
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe({
        // La redirection est maintenant gérée dans le service
        error: (err: HttpErrorResponse) => {
          if (err.error && err.error.errors) {
            // C'est une erreur structurée
            this.globalError = err.error.message;
            err.error.errors.forEach((fieldError: any) => {
              this.formErrors[fieldError.field] = fieldError.message;
            });
          } else {
            // Erreur générique
            this.globalError = "Une erreur inattendue est survenue. Veuillez réessayer.";
          }
        }
      });
  }
}
```

---

## 5. Améliorations de `login.component.html`

**Objectif :** Moderniser le formulaire et afficher les erreurs par champ.

### Fichier : `src/app/features/auth/pages/login/login.component.html`

#### Proposition de Code :
Utilisation des `form-floating` de Bootstrap pour un look plus moderne et ajout des blocs pour afficher les erreurs de `formErrors`.

```html
<div class="card">
  <div class="card-header text-center">Veuillez entrer vos coordonnées</div>
  <div class="card-body">
    
    <!-- Erreur globale -->
    <div *ngIf="globalError && !formErrors['username'] && !formErrors['password']" class="alert alert-danger">
      {{ globalError }}
    </div>

    <form (ngSubmit)="handleLogin()" [formGroup]="formGroup" novalidate>
      
      <!-- Champ Username -->
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="username" placeholder="Nom d'utilisateur" formControlName="username" [class.is-invalid]="formErrors['username']">
        <label for="username">Nom d'utilisateur</label>
        <div *ngIf="formErrors['username']" class="invalid-feedback">
          {{ formErrors['username'] }}
        </div>
      </div>

      <!-- Champ Password -->
      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="password" placeholder="Mot de passe" formControlName="password" [class.is-invalid]="formErrors['password']">
        <label for="password">Mot de passe</label>
        <div *ngIf="formErrors['password']" class="invalid-feedback">
          {{ formErrors['password'] }}
        </div>
      </div>

      <div class="mt-2 text-end">
        <a [routerLink]="['/auth', 'password-forgotten']">Mot de passe oublié ?</a>
      </div>

      <div>
        <button [disabled]="formGroup.invalid || (loading$ | async)"
                class="btn-connexion mt-3 w-100 btn btn-primary btn-lg"
                type="submit">
          <span *ngIf="loading$ | async" aria-hidden="true" class="spinner-border spinner-border-sm" role="status"></span>
          Connexion
        </button>
      </div>

    </form>
  </div>
</div>

```
---

## 6. Nettoyage de `login.component.scss`

**Objectif :** Assurer la cohérence avec le design system.

### Fichier : `src/app/features/auth/pages/login/login.component.scss`

-   **Action :** Supprimer les déclarations `font-family` hardcodées (`police-lieu`, `police-titre`, `police-autre`).
-   **Justification :** Le fichier global `styles.scss` et les mixins de `_typography.scss` sont déjà en place pour définir la typographie. Les balises `<h2>` utiliseront automatiquement la bonne police. Si un style spécifique est requis, il faut créer un mixin ou une classe utilitaire basée sur les variables du design system.

**Exemple de nettoyage :**

```scss
// À SUPPRIMER
.mosque-ucad {
  font-family: police-lieu, sans-serif; // Doit être géré par le style global du body
  // ...
}

// À SUPPRIMER
.h2 {
  color: $white;
  font-family: police-titre, serif; // La balise h2 a déjà son style
}

// À SUPPRIMER
.row-1 {
  font-family: police-autre, sans-serif; // Utiliser une classe sémantique si besoin
}
```
