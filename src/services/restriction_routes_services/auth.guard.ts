import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /*Métodps */
  canActivate(): Observable<boolean> {
    return this.authService.authStatus$.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // Si el usuario no está autenticado, lo redirigimos a la autenticación
          this.router.navigate(['/authentication']);
          return false;
        }
        // Si está autenticado, permitimos el acceso a la ruta
        return true;
      })
    );
  }
}
