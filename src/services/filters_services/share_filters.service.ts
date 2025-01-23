import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

//Intercambio de filtros 
export class ShareFilters {
    /*Propiedades */
    private filterDataSource = new BehaviorSubject<any>(null);
    currentFilterData = this.filterDataSource.asObservable();

    constructor() { }

      /*Métodos */

    updateFilterData(filterData: any) {
        // console.log('Actualizando filtros en ShareFilters:', filterData); // Esto debería imprimir los filtros
        this.filterDataSource.next(filterData);
    }

    resetFilterData():void{
        this.filterDataSource.next(null);
    }

}
