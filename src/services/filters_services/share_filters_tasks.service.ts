import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

//Intercambio de filtros 
export class ShareFiltersTasks {
    /*Propiedades */
    private filterDataSource = new BehaviorSubject<any>(null);
    currentFilterDataTasks = this.filterDataSource.asObservable();
    constructor() { }

    /*Métodos */
    updateFilterData(filterData: any) {
        // console.log('Actualizando filtros en ShareFilterTasks:', filterData); // Esto debería imprimir los filtros
        this.filterDataSource.next(filterData);
    }
}