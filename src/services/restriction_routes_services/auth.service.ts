import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileDataService } from '../user_data_service/profile.service';
import { Inject } from '@angular/core';
import { DataLoginService } from '../user_data_service/data_login.service';
import { ExpireTasksService } from '../Validate_tasks_service/expire_tasks.service';
import { ConfirmErrorModalComponent } from '../../app/confirm-error-modal/confirm-error-modal.component';
import { MatDialog } from '@angular/material/dialog';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Crear un BehaviorSubject para el estado de autenticación
  private authSubject: BehaviorSubject<boolean>; // Estado inicial basado en localStorage
  private userSubject: BehaviorSubject<any>; // Información del usuario


  userData: any[] = [];
  avatar!: string;
  user_id!: any;



  //Emite su valor a todos los subscriptores 
  authStatus$: Observable<boolean>;
  user$!: Observable<any>; // Observable para la información del usuario

  apiUrl = environment.apiUrl;

  // Temporizador para manejar la inactividad
  private inactivityTimer: any;
  private inactivityTimeLimit: number = 1800 * 1000; // 30 minutos en milisegundos

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private router: Router,
    private UserLoggedInData: DataLoginService, private profileDatService: ProfileDataService, private expireTasks: ExpireTasksService, private modalInfo: MatDialog) {


    this.authSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
    this.userSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
    this.authStatus$ = this.authSubject.asObservable();
    this.user$ = this.userSubject.asObservable();

    // Inicia el temporizador de inactividad 
    if (isPlatformBrowser(this.platformId)) {
      this.startInactivityTimer();
      window.addEventListener('mousemove', () => this.resetInactivityTimer());
      window.addEventListener('keydown', () => this.resetInactivityTimer());
    }
  }


  //Mostar modal de inactividad

  openModal(type: string, title: string, message: string): void {
    this.modalInfo.open(ConfirmErrorModalComponent, {
      width: '300px', data: { type, title, message }
    });
  }

  showInfo() {
    this.openModal('info', 'Cierre de sesión', 'La sesión ha sido cerrada debido a inactividad.');

  }



  // Iniciar sesión
  login(credentials: { user_name: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, credentials).pipe(

      /*pipe:  permite encadenar operadores para transformar,
       filtrar o manipular los datos emitidos por un Observable. */

      /*transforma datos de un observable */
      tap(response => {
        // console.log('Respuesta recibida desde login.php', response);

        if (response.status === 'success') {
          if (isPlatformBrowser(this.platformId)) {
            const user = localStorage.getItem('user');
            if (user) {
              this.userSubject.next(JSON.parse(user));
            } else {
              this.userSubject.next(null);

            }
          }

          this.authSubject.next(true);  // Cambia el estado de autenticación a 'true'
          this.userData = response.user;
          this.avatar = response.user.avatar;
          this.user_id = response.user.user_id;

          if (this.userData) {
            this.UserLoggedInData.changeUserLoggedInData(this.userData);
            // console.log('Informacion en DataLoginService actualizado al iniciar sesion', this.userData);

            this.UserLoggedInData.changeAvatarUserLoggedIn(this.avatar)
            // console.log('Avatar en DataLoginService actualizado al iniciar sesion', this.avatar);
          }


          this.expireTasks.validateStatus(this.user_id).subscribe(response => {
            // console.log('Obteniendo la respuesta en login component desde expire_tasks.php', response);
          })


        }
        this.resetInactivityTimer(); // Reiniciar temporizador al iniciar sesión
        this.router.navigate(['/']);

      })
    );

  }

  // Cerrar sesión
  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}logout/`).pipe(

      // En este caso, después de cerrar sesión, actualizamos el estado de autenticación
      tap(response => { //El tap no  modifica el flujo de datos del observable

        if (response.status === 'success') {

          // console.log(response.message);

          this.clearSession();
          this.authSubject.next(false); // Cambiar el estado a no autenticado 
          this.userSubject.next(null); // Emitir null para borrar la información del usuario
          this.router.navigate(['/authentication']);
          this.UserLoggedInData.resetProfileavatar();
          this.UserLoggedInData.resetProfileData();
          this.profileDatService.resetProfileUserData()
          this.profileDatService.resetProfileavatar();

        } else {
          // console.log('Error al cerrar sesion');

        }

      }));
  }

  // Verificar si el usuario está autenticado (puedes verificar la sesión o localStorage)
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');  // Obtén el objeto completo
      // console.log('usuario en el localStorage:', user);

      return !!user;  // Verifica si hay datos en localStorage y retorna true

    }
    return false;  // Retorna false si no estamos en el navegador
  }

  private getUserFromLocalStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        try { return JSON.parse(user); } catch (e) {
          // console.error('Error parsing JSON from localStorage', e);
          return null;
        }
      }
    }
    return null;
  }

  // Guardar sesión en el almacenamiento local
  saveSession(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.authSubject.next(true); // Actualiza el estado de autenticación a true
    }
  }

  // Temporizador de inactividad 
  startInactivityTimer() {
    this.inactivityTimer = setTimeout(() => {
      this.logout().subscribe(); // Cerrar sesión por inactividad 
      // console.log('Sesión cerrada por inactividad');
    },
      this.inactivityTimeLimit);
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }

  // Eliminar sesión
  clearSession() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');

    }
  }

}
