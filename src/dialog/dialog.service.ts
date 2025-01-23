import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../app/dialog/dialog.component";
import { WarningDialogData } from "./dialog_interface";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class WarningDialogService {
    constructor(private dialog: MatDialog) { } openWarningDialog(data: WarningDialogData): Observable<any> {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px', data
        });
        return dialogRef.afterClosed(); // Devuelve el Observable del método afterClosed 
    }
}
