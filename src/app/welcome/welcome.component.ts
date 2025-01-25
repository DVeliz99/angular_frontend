import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormTaskManagerComponent } from '../form-task-manager/form-task-manager.component';
import { Subscription } from 'rxjs';
import { DataLoginService } from '../../services/user_data_service/data_login.service';


@Component({
  selector: 'app-welcome',
  imports: [FormTaskManagerComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  username!:string;
  userLoggedInDataSubscription!:Subscription;

  constructor(private userDataLoginservice:DataLoginService,){}

  ngOnInit(): void {
    //    // Suscripción al servicio para recibir los datos del perfil
    this.userLoggedInDataSubscription=this.userDataLoginservice.currentUserLoggedInData.subscribe({
      next: (response) => {
        if(response){
          this.username=response.user_name;
          // console.log('Usuario obtenido en welcome component',this.username);
        }
      }

    })

  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción para evitar fugas de memoria
    if (this.userLoggedInDataSubscription) {
      this.userLoggedInDataSubscription.unsubscribe();
    }

  }

}
