import { Component } from '@angular/core';
import { Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; //  MatIconModule para usar iconos


interface DialogData {
  title: string;
  message: string;
  type: string;

}

@Component({
  selector: 'app-confirm-error-modal',
  imports: [MatIconModule],
  templateUrl: './confirm-error-modal.component.html',
  styleUrl: './confirm-error-modal.component.css'
})


export class ConfirmErrorModalComponent {

  @Input() title!: string;
  @Input() message!: string;
  @Input() type!: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }



  //Métodos de obtención de color y de icono según el tipo de mensaje
  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  getIconColor(): string {
    switch (this.data.type) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'warning': return 'orange';
      default: return 'blue';
    }
  }

  /*Métodos de los botones del modal */

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({ confirmed: true }); // Retorna verdadero si se confirma 
  }
  onCancel(): void {
    this.dialogRef.close({ confirmed: false }); // Retorna falso si se cancela
  }

}



