import { Component, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from 'node:stream';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/restriction_routes_services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Inject, OnDestroy } from '@angular/core';
import { ProfileDataService } from '../../services/user_data_service/profile.service';
import { DataLoginService } from '../../services/user_data_service/data_login.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',

})
export class NavbarComponent implements OnInit, OnDestroy {

  /*Propiedades */

  avatarUrl!: string;
  nombre_usuario = '';
  // Subscripciones 
  authStatusSubscription!: Subscription;
  userAvatarSubscription!: Subscription;
  usernameSubscription!: Subscription;
  //El link clickeado
  activeLink = '';
  //Variable para controlar visibilidad de sidebar 
  isVisible = false; // Inicialmente visible

  constructor(@Inject(PLATFORM_ID) private platformId: object,
    private authservice: AuthService, private router: Router, private userLoggedInService: DataLoginService) { }

  isAuthenticated = false;

  //Subscripcion en el navbar

  ngOnInit() {

    // Obtener el user_id del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.nombre_usuario = user.user_name; // Obtenemos el user_id
      this.avatarUrl = this.getAvatarPath(user.avatar);
      // Actualizar DataLoginService con los datos del usuario desde localStorage
      this.userLoggedInService.changeUserLoggedInData(user);

    }

    if (isPlatformBrowser(this.platformId)) {
      this.authStatusSubscription = this.authservice.authStatus$.subscribe(status => {
        this.isAuthenticated = status;
        // console.log('Navbar - Authentication status:', this.isAuthenticated);
      });

      this.userAvatarSubscription = this.userLoggedInService.currentUserLoggedInAvatar.subscribe({
        next: (data) => {
          if (data) {
            // console.log('Respuesta del dataloginService en el navbar',data);
            this.avatarUrl = this.getAvatarPath(data);
            // console.log('Avatar URL recibida en Navbar desde DataLoginService:', this.avatarUrl);
          } else {
            // console.log('No se ha recibido avatar.');
            this.avatarUrl = ''; // Vacio en caso de que no se haya recibido nada desde DataLoginService
          }
        }, error: (err) => {
          // console.error('Error al suscribirse a DataLoginService:', err);
        }
      });

      this.usernameSubscription = this.userLoggedInService.currentUserLoggedInData.subscribe({
        next: (data) => {
          if (data) {
            // console.log('Respuesta del dataloginService en el navbar',data);
            this.nombre_usuario = data.user_name;

          } else {
            // console.log('No se ha recibido respuesta.');

          }
        }, error: (err) => {
          // console.error('Error al suscribirse a DataLoginService:', err);
        }
      });

    }

  }
  /*Funciones de habilitacion */

  setActive(link: string) {
    this.activeLink = link; // Asigna valor a la clase 'Active'


  }

  // Función para alternar la visibilidad de un elemento
  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  /*Métodos */


  getAvatarPath(avatar: string): string {
    return 'https://web-production-3570.up.railway.app' + avatar;

  }


  logout() {

    if (isPlatformBrowser(this.platformId)) {
      this.authservice.logout().subscribe(
        response => {
          this.avatarUrl = '';
          this.nombre_usuario = '';
          // console.log('Logout response in component:', response);
        }, error => {
          // console.error('Error during logout:', error);
        }
      );

    }

  }

  ngOnDestroy() { // Cancelar suscripciones para evitar fugas de memoria 
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    } if (this.userAvatarSubscription) {
      this.userAvatarSubscription.unsubscribe();
    }

    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }

    this.userLoggedInService.resetProfileavatar();

  }

}