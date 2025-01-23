import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /*Métodos */

  canActivate(): Observable<boolean> {
    return this.authService.authStatus$.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // Si el usuario no está autenticado, lo redirigimos a la autenticación
          
          return true;
        }
        // Si está autenticado, permitimos el acceso a la ruta
        this.router.navigate(['/profile']);
        return false;
      })
    );
  }
}
