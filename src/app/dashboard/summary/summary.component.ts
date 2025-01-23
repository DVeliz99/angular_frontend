import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ProfileDataService } from '../../../services/user_data_service/profile.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/restriction_routes_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from '../../confirm-error-modal/confirm-error-modal.component';
import { DataLoginService } from '../../../services/user_data_service/data_login.service';
import { HttpEvent } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';


declare var bootstrap: any;

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  //TotalGraphicComponent,


  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit, AfterViewInit {

  /*Propiedades */
  usuario_id!: string;
  userData: any; // Aquí almacenaremos los datos que recibimos
  userDataSubscription!: Subscription; // Para manejar la suscripción
  userAvatarSubscription!: Subscription;
  userAvatarchangeSubscription!: Subscription;
  loginDate: string = '';
  avatarUrl!: string;
  avatar!: string;
  newAvatar!: File;
  newAvatarUrl!: string;
  imageErrorMessage!: string;
  successMessage!: string;
  errorMessage!: string;


  constructor(private currentUserLoggedInAvatar: DataLoginService, private profileDataService: ProfileDataService, private authService: AuthService, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {

    // Obtener el user_id del localStorage
    const storedUser = localStorage.getItem('user');

    //Verificar si esta almacenado en localStorage
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.usuario_id = user.user_id; // Obtenemos el user_id
      this.loginDate = user.login_date;

    }

    // Suscripción al servicio para recibir los datos del perfil
    this.userDataSubscription = this.profileDataService.currentUserProfileData.subscribe({
      next: (response) => {
        if (response) {
          this.userData = response;
          // console.log('Datos recibidos desde ProfileDataService en Summary:', this.userData);
        } else {
          // console.log('No se han recibido datos válidos del servicio');
        }
      }, error: (err) => {
        // console.error('Error al suscribirse a currentUserData:', err);
      }
    });

    // Suscripción al servicio para recibir los datos del avatar
    this.currentUserLoggedInAvatar.currentUserLoggedInAvatar.subscribe(response => {
      this.avatarUrl = this.getAvatarPath(response);
      // console.log('Avatar obtenido en summary component desde DataLoginService', this.avatarUrl);  
    })

  }

  /*Abrir modal y mostrar alertas */

  openModal(type: string, title: string, message: string): void {
    this.dialog.open(ConfirmErrorModalComponent, {
      width: '300px', data: { type, title, message }
    });
  }

  showalert(type: string, title: string, message: string) {
    this.openModal(type, title, message);
  }

  /*Otros métodos */


  formatValidator(event: any): void {
    const input = event.target.files[0];
    const file = input ? input : null;

    if (file) {
      // Validar que el archivo sea una imagen y tenga la extensión correcta
      console.log(file);
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos
      if (!validTypes.includes(file.type)) {
        this.imageErrorMessage = 'Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG, GIF).';
        this.showalert('error', 'Error', this.imageErrorMessage);

      } else {
        this.imageErrorMessage = "";
        // Si el archivo es válido, almacenarlo en la variable
        this.newAvatar = file;
        // console.log('Nombre de archivo', this.newAvatar);
        //Llamado del metodo que cambiara la imagen
        this.changePhotoProfile(this.newAvatar);
      }
    }

  }

  preprareDatatoSend(id: string, photo: File): FormData {
    const formData = new FormData();
    formData.append('user_id', id);
    formData.append('new_avatar', photo);
    return formData;

  }



  changePhotoProfile(photo: File): void {
    const formData = this.preprareDatatoSend(this.usuario_id, photo);

    this.http.post<any>(`${environment.apiUrl}profile/changePhoto.php`, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe({
        next: (event: HttpEvent<any>) => {

          if (event.type === HttpEventType.Response) {
            const response = event as HttpResponse<any>;
            // console.log('Respuesta completa:', response);

            if (response.body.status === 'success') { // Aca llamaremos al modal de exito 
              this.avatar = response.body.avatarPath; // Actualizamos el servicio que cambia el avatar del usuario logueado
              this.currentUserLoggedInAvatar.changeAvatarUserLoggedIn(this.avatar);
              this.newAvatarUrl = this.getAvatarPath(this.avatar);
              this.profileDataService.changeProfileAvatar(this.avatar);
              this.avatarUrl = this.newAvatarUrl;
              // console.log('Nuevo valor de avatarUrl',this.avatarUrl);

              this.showalert('success', 'Éxito', 'Imagen actualizada exitosamente');
            } else {
              this.showalert('Error', 'Error', 'Error al actualizar la imagen');
            }
          }
        }
      })
      ,
      (err: any) => {
        // console.error('Error en la solicitud HTTP', err);
      }

  }

  //Usando JS
  triggerFileInput(): void {
    const fileInput = document.getElementById('newAvatar') as HTMLInputElement;
    if (fileInput) {
      //Se activa el click en el input oculto
      fileInput.click();
    }

  }

  getAvatarPath(avatar: string): string {
    return 'http://localhost/mi-proyecto' + avatar;

  }


  ngAfterViewInit() {
    //Cuando la vista se cargue, iniciar el tooltip
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')) as HTMLElement[];
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      tooltipTriggerEl.addEventListener('mouseenter', () => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl) || new bootstrap.Tooltip(tooltipTriggerEl);
        tooltipInstance.show();
      }); tooltipTriggerEl.addEventListener('mouseleave', () => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltipInstance) {
          tooltipInstance.dispose();
        }
      });

      //  Se destruye cuando se le da click al elemento
      tooltipTriggerEl.addEventListener('click', () => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltipInstance) {
          tooltipInstance.dispose();
        }
      });

    });
  }

}