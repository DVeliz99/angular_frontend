import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileDataService {

    /*Propiedades */
    private userProfileDataSource = new BehaviorSubject<any>(null);
    currentUserProfileData = this.userProfileDataSource.asObservable();

    private avatarProfileDataSource = new BehaviorSubject<any>(null);
    currentUserProfileAvatar = this.avatarProfileDataSource.asObservable();



    constructor() { }

    /*Métodos */

    changeProfileUserData(userData: any) {
        this.userProfileDataSource.next(userData);
        // console.log('Datos de respuesta actualizados en ProfileDataService:', userData);
    }

    changeProfileAvatar(avatar:any){
        this.avatarProfileDataSource.next(avatar);
        // console.log('Avatar recibido en profileDataService',avatar);
        
    }

    resetProfileUserData():void{
        this.userProfileDataSource.next(null);
        // console.log('Data eliminada en profileDataService');
    }

    resetProfileavatar():void{
        this.avatarProfileDataSource.next(null);
        // console.log('Avatar eliminado en profileDataService');
    }

}
