
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { modalMessageInterface } from '../../modal_interface/modalMessage_interface';


@Injectable({
    providedIn: 'root'
})
export class MessageModalService {

    private MessageData = new BehaviorSubject<any>(null);
    currentMessage = this.MessageData.asObservable();

    /*Métodos */

    changeMessage(message: modalMessageInterface) {
        this.MessageData.next(message);
        console.log('Mensaje actualizado en  MessageModalService:', message);
    }

    resetMessage():void{
        this.MessageData.next(null);
        console.log('Mensaje borrado en  MessageModalService');
    }

}