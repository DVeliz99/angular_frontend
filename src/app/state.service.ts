//Un servicio para manejar la comunicacion entre componentes y evitar problemas de tipado

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class StateService {
    /*Si la opcion de dashboard esta seleccionada */
    private estadoFilterEnabled = new BehaviorSubject<boolean>(true);
    estadoFilterEnabled$ = this.estadoFilterEnabled.asObservable();

    setCategoryFilterState(state: boolean) {
        this.estadoFilterEnabled.next(state);
    }

    /*Titulo dinamico para dashboard-stats */

    /*Observable es una subscripcion a un objeto que emite valores segun su cambio a lo largo de la aplicacion */

    private startDate = new BehaviorSubject<string>('');
    private endDate = new BehaviorSubject<string>('');
    private category = new BehaviorSubject<string>('');

    /*Se definen los observables y se setean */

    startDate$ = this.startDate.asObservable();
    endDate$ = this.endDate.asObservable();
    category$ = this.category.asObservable();

    setStartDate(date: string) {
        this.startDate.next(date);

    }
    setEndDate(date: string) {
        this.endDate.next(date);
    }
    setCategory(category: string) {
        this.category.next(category);
    }
}


