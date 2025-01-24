import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';


@Injectable({
    providedIn: 'root'
})
export class ExpireTasksService {
    constructor(private http: HttpClient) { }

    validateStatus(user_id: string): Observable<any> {
        // console.log('User_id obtenido en ExpireTasksService desde login component',user_id);

        return this.http.get<any>(`${environment.apiUrl}tasks/expire_tasks/`, { params: { user_id: user_id } });
    }
}
