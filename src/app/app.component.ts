import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { MobileNavbarComponent } from './mobile-navbar/mobile-navbar.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/restriction_routes_services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileDataService } from '../services/user_data_service/profile.service';
import { Subscription, tap } from 'rxjs';
import { DataLoginService } from '../services/user_data_service/data_login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from './confirm-error-modal/confirm-error-modal.component';
import { MessageModalService } from '../services/message_modal_services/message_modal.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommonModule, NavbarComponent, RouterModule, MobileNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

  /*RouterOutlet */
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  /*Propiedades */
  title = 'task_manager';
  isAuthenticated!: boolean;
  userdataProfile!: any;
  avatar!: any;
  messageModalSubscription!: Subscription;

  constructor(
    private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformID: Object,
    private cdRef: ChangeDetectorRef, private userDataProfile: ProfileDataService, private http: HttpClient,
    private userLoggedId: DataLoginService, private testModal: MatDialog, private messageModalService: MessageModalService) {

  }

  ngOnInit() {

    // Manejar el evento de cambio de orientación
    if (isPlatformBrowser(this.platformID)) {
      this.isAuthenticated = this.authService.isLoggedIn(); // Inicializar isAuthenticated en el componente

      // console.log('Initial isAuthenticated:', this.isAuthenticated);

      if (this.isAuthenticated === true) {
        //Refresca el avatar en caso de que la app se refresque
        this.fetchUserData();
      }

      window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
      // console.log('Accesso al browser');

      try {
        localStorage.setItem('App_name', 'Seo-Demo');
        // console.log('App Name stored:', localStorage.getItem('App_name'));

      } catch (e) {
        // console.error('Error saving to localStorage', e);
      }
    }

    this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status; // Actualiza isAuthenticated cuando cambie el estado de autenticación
      this.cdRef.detectChanges();  // Fuerza la detección de cambios después de la asignación
      // console.log('AppComponent - Authentication status:', status);
      // console.log('Authentication status:', status);

    });

    this.messageModalSubscription = this.messageModalService.currentMessage.subscribe(responseMessage => {
      // console.log('Mensaje para modal obtenida en app component',responseMessage);
      if (responseMessage) {
       if(responseMessage.type==='error'){
        this.showModalError(responseMessage.type,responseMessage.title,responseMessage.message);
        this.messageModalService.resetMessage();
       }else{
        this.showModalError(responseMessage.type,responseMessage.title,responseMessage.message);
        this.messageModalService.resetMessage();
       }    
      }
      

    })



  }

  openModal(type: string, title: string, message: string): void {
    this.testModal.open(ConfirmErrorModalComponent, {
      width: '300px', data: { type, title, message }
    });
  }


  showModalError(type:string,title:string,message:string) {
    this.openModal(type, title, message);
  }


  showlError() {
    this.openModal('error', 'mensaje', 'message');
  }



  


  ngOnChanges(): void {
    this.fetchUserData();
  }


  fetchUserData() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const apiUrl = `${environment.apiUrl}profile/profile`;
      const params = new HttpParams().set('user_id', user.user_id);
      this.http.get<any>(apiUrl,{ params }).pipe(

        //tap permite añadir la informacion de la respuesta sin interferir con el flujo principal de datos de la solicitud 
        tap(userData => {
          this.userdataProfile = userData;
          // console.log('informacion obtenida desde profile.php al inicializar app component', this.userdataProfile);

          if (userData.status === 'success') {
            this.avatar = userData.user.avatar;
            // console.log('Path del avatar actual obtenido en el app component', this.avatar);
            this.userDataProfile.changeProfileAvatar(this.avatar);
            // console.log('Avatar actual enviado al ProfileDataService al inicializar el app component');
            this.userLoggedId.changeAvatarUserLoggedIn(this.avatar);
            // console.log('Avatar actual enviado al DataLoginService al inicializar el app component');

          }

        })
      ).subscribe();
    }
  }

  // Método para manejar el cambio de orientación
  // Método para manejar el cambio de orientación
  handleOrientationChange(event: Event) {
    console.log('Orientation changed', event);
  }

  // Método de logout (cuando el usuario se desloguea)
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/authentication']); // Redirigir al login 
    });
  }

  ngOnDestroy(): void {
    

  }


}
