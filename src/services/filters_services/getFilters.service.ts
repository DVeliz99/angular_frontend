//Obtiene las categorias y estados de las tareas desde la base de datos 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  /*Propiedades */
  private apiUrlCategorias = `${environment.apiUrl}filter/get_category/`;
  private apiUrlEstados = `${environment.apiUrl}filter/get_state/`;

  constructor(private http: HttpClient) { }

    /*Métodos */

  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(this.apiUrlCategorias);
  }

  obtenerEstados(): Observable<any> {
    return this.http.get<any>(this.apiUrlEstados);
  }
}
