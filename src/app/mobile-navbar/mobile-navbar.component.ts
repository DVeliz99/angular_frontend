import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../state.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/restriction_routes_services/auth.service';
import { Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataLoginService } from '../../services/user_data_service/data_login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.css'
})
export class MobileNavbarComponent implements OnInit, OnDestroy {

  constructor(@Inject(PLATFORM_ID) private platformId: object,
    private authservice: AuthService,
    private stateService: StateService,
    private userLoggedInService: DataLoginService) { }

  /*Propiedades */
  activeLink = '';
  avatarUrl!: string;
  nombre_usuario!: string;
  isAuthenticated = false;
  private useravatarSusbscription!: Subscription;
  //Variable para controlar visibilidad de sidebar 
  isVisible = false; // Inicialmente no visible
  /*Estilos dinamicos para cada navItem */
  navItemStyles: Record<string, any> = {
    transition: 'transform 0.3s ease',
  };

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

    if (isPlatformBrowser(this.platformId)) { //Es para asegurarse de que se está ejecutando en el navegador
      this.authservice.authStatus$.subscribe(status => {
        this.isAuthenticated = status;
        // console.log('MobileNavbar - Authentication status:', status);
      });

      this.useravatarSusbscription = this.userLoggedInService.currentUserLoggedInAvatar.subscribe({
        next: (data) => {
          if (data) {
            // console.log('Respuesta del dataloginService en el mobile navbar', data);

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
    }

  }
  /*Funciones  */

  // setActive(link: string, enableEstadoFilter: boolean) {
  //   this.activeLink = link; // Asigna valor a la clase 'Active'
  //   console.log('Valor de active',this.activeLink);
    
  //   this.stateService.setCategoryFilterState(enableEstadoFilter);

  // }

  // Función para alternar la visibilidad de un elemento
  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  /*Otros métodos */

  getAvatarPath(avatar: string): string {
    return 'https://web-production-3570.up.railway.app' + avatar;

  }

  logout() {

    if (isPlatformBrowser(this.platformId)) { //Es para asegurarse de que se está ejecutando en el navegador
      this.authservice.logout().subscribe(
        response => {
          // console.log('Logout response in component:', response);
        }, error => {
          // console.error('Error during logout:', error);
        }
      );

    }

  }

  ngOnDestroy(): void {
    this.userLoggedInService.resetProfileavatar();
  }

}
