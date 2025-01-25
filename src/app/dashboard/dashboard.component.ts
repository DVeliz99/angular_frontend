import { Component, OnDestroy, OnInit } from '@angular/core';
import { SummaryComponent } from './summary/summary.component';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats/stats.component';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ProfileDataService } from '../../services/user_data_service/profile.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-dashboard',
  imports: [SummaryComponent, CommonModule, StatsComponent],
  templateUrl: './dashboard.component.html',
  animations: [trigger('fadeIn', [state('void', style({ opacity: 0 })), transition('void => *', [animate('1.0s ease-in')])])],
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  /*Propiedades */

  userData: any = {}; //Se inicializa como un objeto 
  username!:any;
  fadeIn = 'fadeIn';
  parent_userDataSubscription!: Subscription;
  apiUrl = environment.apiUrl;
  loginDate = '';



  constructor(private http: HttpClient, private profileDataService: ProfileDataService) { }

  ngOnInit() {

    // Obtener el user_id del localStorage
    const storedUser = localStorage.getItem('user');
    let usuario_id!: string;

    //Verificar si esta almacenado en localStorage
    if (storedUser) {
      const user = JSON.parse(storedUser);
      usuario_id = user.user_id; // Obtenemos el user_id
      this.loginDate = user.login_date;

    }

    //Obtencion de datos por el padre para enviarlos al servicio del perfil
    this.parent_userDataSubscription = this.http.get<any>(`${environment.apiUrl}profile/profile`,{ params: { user_id: usuario_id } }).subscribe(response => {
      if (response.status === 'success') {
        this.userData = response.user;
        // this.username=response.user.user_name;
        // console.log('el nombre del usuario en la respuesta',this.username);
        // console.log('Respuesta desde profile.php obtenida en dashboard', this.userData);
        this.profileDataService.changeProfileUserData(this.userData);
        //  console.log('Informacion del usuario enviada desde dashboard al ProfileDataService', this.userData);

      } else {
        // console.error('Error en la respuesta de profile.php en dashboard:', response.message);
      }
    })

  }

  ngOnDestroy() {

    if (this.parent_userDataSubscription) {
      this.parent_userDataSubscription.unsubscribe();
    }

  }

}
