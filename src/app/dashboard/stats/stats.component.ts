import { Component, OnInit, OnDestroy } from '@angular/core';
import { TotalGraphicComponent } from '../../total-graphic/total-graphic.component';
import { CommonModule } from '@angular/common';
import { ProfileDataService } from '../../../services/user_data_service/profile.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-stats',
  imports: [TotalGraphicComponent, CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, OnDestroy {
  /*Propiedades */
  userData: any;
  userDataSubscription!: Subscription; // Para manejar la suscripción

  constructor(private profileDataService: ProfileDataService) {}

  ngOnInit(): void {

    //Metodos proporcionados en la subscripcion next, error, complete
    //Next se llamada cada vez que el observable emite un nuevo valor 

    // console.log('Inicializando StatsComponent...');

    this.userDataSubscription = this.profileDataService.currentUserProfileData.subscribe({
      next: (response) => {
        if (response) {
          this.userData = response;
          // console.log('Datos obtenidos en stats', this.userData);

        } else {
          // console.log('No se han recibido datos válidos del servicio en stats');
        }

      }, error: (err) => {
        // console.error('Error al obtener los datos del perfil:', err);

      }, complete: () => {
        // console.log('Solicitud completada.');
      }

    })

  }

  ngOnDestroy() {
    // Para evitar fugas de memoria
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();

    }
  }

}
