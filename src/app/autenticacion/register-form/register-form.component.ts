import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from '../../confirm-error-modal/confirm-error-modal.component';


export interface ResponseMessage {
  status: string;
  message: string;

}

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  /*Propiedades */
  responseMessages: ResponseMessage | null = null;

  //Para manejar los campos de los formularios de forma jerarquica
  registerForm!: FormGroup;
  imageErrorMessage: string = '';
  //Angular no permite manipular el valor de un campo tipo file
  selectedImage: File | null = null;

  responseSuccessMessage!: string;
  responseErrorMessage!: string;
  responseStatus!: any;
  hidePassword: boolean = true;


  constructor(private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog) { }


  openModal(type: string, title: string, message: string): void {
    this.dialog.open(ConfirmErrorModalComponent, {
      width: '300px', data: { type, title, message }
    });
  }

  //El control de formControlName necesita estar dentro de formGroup
  ngOnInit(): void {
    // Creamos el formulario reactivo con los campos y validaciones
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      user_name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9_]*$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9_]*$')]),
      image: new FormControl('', [Validators.nullValidator])

    });
  }




  formatValidator(event: any): void {
    const input = event.target.files[0];
    const file = input ? input : null;

    if (file) {
      // Validar que el archivo sea una imagen y tenga la extensión correcta
      // console.log(file);
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos
      if (!validTypes.includes(file.type)) {
        this.imageErrorMessage = 'Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG, GIF).';
        this.registerForm.get('image')?.setErrors({ invalidFileType: true });
      } else {
        this.imageErrorMessage = "";

        // Si el archivo es válido, almacenarlo en la variable
        this.selectedImage = file;
      }
    }
  }


  // Método para preparar el FormData con los datos del formulario y el archivo
  prepareFormData(): FormData {
    const formData = new FormData();

    // se guardan los datos en formato
    formData.append('name', this.registerForm.get('name')?.value);
    formData.append('user_name', this.registerForm.get('user_name')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);

    // Si hay un archivo seleccionado, agregarlo a FormData
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    return formData;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // console.log(this.registerForm.value);  // Procesar los datos del formulario si es válido

      // Preparar el FormData
      const formDataToSend = this.prepareFormData();

      // Enviar la solicitud HTTP POST
      this.http.post<any>(`${environment.apiUrl}registration/`, formDataToSend, {
        reportProgress: true,
        observe: 'events'
      })
        .subscribe({
          next: (event: any) => {
            // console.log('Evento HTTP:', event); // Muestra todo el evento, incluyendo progreso
            if (event.type === HttpEventType.Response) {
              // console.log('Respuesta completa:', event.body);

              if (event.body.status == 'success') {
                this.responseSuccessMessage = event.body.message;
                this.showSuccessMessage(this.responseSuccessMessage);
                this.registerForm.reset();

              } else {
                this.responseErrorMessage = event.body.message;
                this.responseStatus = event.body.status;
                this.showErrorMessage(this.responseErrorMessage);

              }

            }
          }

        })
        ,
        (err: any) => {
          // console.error('Error en la solicitud HTTP', err);

        }
        ;
    } else {
      // console.log('Formulario inválido');

    }
  }

  //Métodos para mostrar mensajes en los modals
  showSuccessMessage(message: string) {
    this.openModal('success', 'Éxito', message);
  }

  showErrorMessage(message: string) {
    this.openModal('error', 'Éxito', message);

  }

    //Ocultar la contraseña 

    togglePasswordVisibility() {
      this.hidePassword = false;
      setTimeout(() => {
        this.hidePassword = true;
      }, 1000);
    }

}


