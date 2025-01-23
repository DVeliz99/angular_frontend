
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaksDetail {

    private taskDataSource = new BehaviorSubject<any>(null);
    currentTaskDetails = this.taskDataSource.asObservable();

    /*Métodos */

    changeTaskDetail(task: any) {
        this.taskDataSource.next(task);
        // console.log('Datos actualizados en TaskDetail:', task);
    }

    resetTaskDetail():void{
        this.taskDataSource.next(null);
    }

}
