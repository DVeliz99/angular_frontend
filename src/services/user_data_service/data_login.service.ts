import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataLoginService {

    /*Propiedades */
    private userLoggedInDataSource = new BehaviorSubject<any>(null);
    currentUserLoggedInData = this.userLoggedInDataSource.asObservable();

    private avatarLoginDataSource = new BehaviorSubject<any>(null);
    currentUserLoggedInAvatar = this.avatarLoginDataSource.asObservable();


    constructor() { }


    /*Métodos */

    changeUserLoggedInData(userData: any) {
        this.userLoggedInDataSource.next(userData);
        // console.log('Datos de respuesta Login actualizados en DataLoginService:', userData);
    }

    changeAvatarUserLoggedIn(avatar: any){
        this.avatarLoginDataSource.next(avatar);
        // console.log('Avatar actualizado en DataLoginService', avatar);
        
    }
    
    resetProfileavatar():void{
        this.avatarLoginDataSource.next(null);
        // console.log('Avatar eliminado en DataLoginService');
    }

    resetProfileData():void{
        // console.log('Data eliminada en DataLoginService');
    }

}
