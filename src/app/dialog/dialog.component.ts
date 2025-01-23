import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { WarningDialogData } from '../../dialog/dialog_interface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para utilizar ngModel
import { MatIconModule } from '@angular/material/icon'; //  MatIconModule para usar iconos




@Component({
  selector: 'app-dialog',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>, //El componente se comportara como un modal
    @Inject(MAT_DIALOG_DATA) public data: WarningDialogData) { }

    
  //Métodos para habilitar la confirmacion o cerrar el modal
  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({ confirmed: true });
  }

  //Métodos para obtener color de icono e icono según tipo de alerta
  getIcon(): string {
    switch (this.data.type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }

  getIconColor(): string {
    switch (this.data.type) {
      case 'error': return 'red';
      case 'warning': return 'orange';
      case 'success': return 'green';
      default: return 'blue';
    }
  }

}
