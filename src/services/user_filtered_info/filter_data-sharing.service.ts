//Obtenemos la respuesta con filtros aplicados

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilteredDataSharing {
  /*Propiedades */

  private responseDataSource = new BehaviorSubject<any>(null);
  currentResponseData = this.responseDataSource.asObservable();

  constructor() {}

  /*Métodos */

  updateResponseData(data: any): void {

    this.responseDataSource.next(data);
    // console.log('Datos de respuesta actualizados en FilteredDataSharing:', data);
    
  }

  resetResponseData():void{
    this.responseDataSource.next(null);
  }
}
