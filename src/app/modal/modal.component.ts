import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { WarningDialogService } from '../../dialog/dialog.service';
import { WarningDialogData } from '../../dialog/dialog_interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [MatButtonModule, MatInputModule, MatDialogModule, FormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {


  constructor(private warningDialogService: WarningDialogService) { }



  openDeleteWarning(): void {
    const data: WarningDialogData = {
      title: 'Eliminar Tarea',
      message: '¿Estás seguro de que quieres eliminar la tarea?',
      type: 'error'
    };
    this.warningDialogService.openWarningDialog(data);
  }
  openEditWarning(): void {
    const data: WarningDialogData = {
      title: 'Editar Tarea',
      message: '¿Estás seguro de que quieres editar la tarea?',
      type: 'warning'
    };
    this.warningDialogService.openWarningDialog(data);
  }

  openSuccessMessage(): void {
    const data: WarningDialogData = {
      title: 'Tarea Completada',
      message: '¡La tarea se completó con éxito!',
      type: 'success'
    };
    this.warningDialogService.openWarningDialog(data);
  }

}
