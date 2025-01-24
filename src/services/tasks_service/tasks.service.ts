//Obtenemos informacion filtrada de la tabla tareas 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ShareFilters } from '../filters_services/share_filters.service';
import { ShareFiltersTasks } from '../filters_services/share_filters_tasks.service';
import { environment } from '../../environment/environment';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
    providedIn: 'root'
})
export class SharedHttpService {

    /*Propiedades */
    private tasksSubject = new BehaviorSubject<any[]>([]);
    tasks$: Observable<any[]> = this.tasksSubject.asObservable();//Observable de tasksSubject

    private dashboardTasksSubject = new BehaviorSubject<any[]>([]);//se utiliza para mantener y emitir el estado actual de las tareas obtenidas desde el backend
    dashboardTasks$: Observable<any[]> = this.dashboardTasksSubject.asObservable(); //asObservable() proporciona  la capacidad de suscribirse a los valores emitidos por el BehaviorSubject
    //fuente de datos que puede emitir múltiples valores a lo largo del tiempo.
    
    constructor(
        private http: HttpClient,
        private dashboardFilters: ShareFilters,
        private tasksFilters: ShareFiltersTasks
    ) {
        this.init(); //Inicializador del servicio
        this.logFilters();

    }
    //No se muestra el log de los filtros que se envian a la peticion http
    private init() {
        // Suscribirse a los cambios de filtros del servicio ShareFilters
        //Se aseguran de que ningun filtro obtenido desde el servicio de filtros no sea nulo, si lo son. Filters no permite seguir con los siguientes operadores

        //Swicthmap mapea emision de los observables en los servicios de filtros, se suscribe, cancela la subscripcion y se resubscribe a los nuevos valores en los servicios de filtros 
        this.dashboardFilters.currentFilterData.pipe(filter(filters => filters !== null),
            switchMap(filters => this.fetchTasks(filters)))
            .subscribe(response => {
                // console.log('nueva informacion obtenida en tasks.service desde la peticion http para dashboard component', response);
                this.dashboardTasksSubject.next(response); // Suscribirse a los cambios de filtros del servicio ShareFiltersTasks 

            });

        this.tasksFilters.currentFilterDataTasks.pipe(filter(filters => filters !== null),
            switchMap(filters => this.fetchTasks(filters)

            ))
            .subscribe(response => {

                // console.log('nueva informacion obtenida en tasks.service desde la peticion http para tasks component', response);
                this.tasksSubject.next(response);

            });

    }

    // Método para registrar los filtros en la consola private 
    logFilters() {
        this.dashboardFilters.currentFilterData.pipe(filter(filters => filters !== null)).subscribe(filters => {
            // console.log('Filtros recibidos desde dashboardFilters en http compartido:', filters);
        });
        this.tasksFilters.currentFilterDataTasks.pipe(filter(filters => filters !== null)).subscribe(filters => {
            // console.log('Filtros recibidos desde tasksFilters  http compartido:', filters);
        });
    }

    // Método para obtener el user_id desde el localStorage
    private obtenerUserId(): string {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            return user.user_id; // Retorna el user_id
        }
        return ''; // Devuelve una cadena vacía si no se encuentra el user_id
    }

    private fetchTasks(filters: any): Observable<any[]> {
        const { startDate, endDate, categoria, estado } = filters;
        const userId = this.obtenerUserId();

        let params = new HttpParams()
            .set('start_date', startDate)
            .set('end_date', endDate)
            .set('category', categoria)
            .set('user_id', userId);

        if (estado) {
            params = params.set('status', estado);
        }

        const apiUrl = `${environment.apiUrl}tasks/tasks/`;

        // console.log('Filtros enviados en la solicitud HTTP desde tasks.service:', params.toString()); //para confirmar que filtros se envian en la peticion http 
        return this.http.get<any>(apiUrl, { params }).pipe(

            //map=>se utiliza para transformar los valores emitidos por un observable en un nuevo valor.
            map(response => {
                if (response && response.status === 'success' && Array.isArray(response.data)) { //Validamos que response.data sea un array 
                //    console.log('respuesta en el task service',response.data);
                   
                    return response.data; //devuelve solamente el arreglo data en la respuesta 
                } else {
                    return []; //devuelve un arreglo vacio en caso de no obtener una respuesta valida
                }
            }),
            catchError((error: any) => {
                // console.error('Error en la solicitud HTTP:', error);
                return of([]);
            })
        );
    }


    resetdashboardTasksSubject():void{
        this.dashboardTasksSubject.next([]);
    }

    resetTasksSubject():void{
        this.tasksSubject.next([]);
    }


}