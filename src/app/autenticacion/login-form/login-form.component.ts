import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/restriction_routes_services/auth.service';
import { ProfileDataService } from '../../../services/user_data_service/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmErrorModalComponent } from '../../confirm-error-modal/confirm-error-modal.component';
import { ExpireTasksService } from '../../../services/Validate_tasks_service/expire_tasks.service';







@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})



export class LoginFormComponent implements OnInit {

  /*Propiedades */
  loginForm!: FormGroup;
  errorMessage: string = '';
  user_id!: any;
  hidePassword: boolean = true;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userDataProfile: ProfileDataService,
    private errorLogin: MatDialog,
    private expireTasks: ExpireTasksService

  ) { }

  ngOnInit(): void {

    // Creamos el formulario reactivo con los campos y validaciones
    this.loginForm = this.formbuilder.group({
      user_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9_]*$')]]

    });

  }



  onSubmit() {
    if (this.loginForm.valid) {
      // console.log("Formulario enviado:", this.loginForm.value); // Crear una instancia de FormData y agregar los campos del formulario
      // Obtener los valores del formulario
      const formData = {
        user_name: this.loginForm.value.user_name,
        password: this.loginForm.value.password
      };



      // Llamar al servicio de autenticación
      this.authService.login(formData).subscribe(
        response => {
          // console.log(response); // Para depuración: ver la respuesta completa en la consola
          if (response.status === 'success') {
            if (response.user && response.user.user_id && response.user.user_name) {

              localStorage.setItem('user', JSON.stringify(response.user));
              // Verificar si 'response.user' tiene los datos necesarios
              this.authService.saveSession(response.user);

              //Obtener el user_id
              this.user_id = response.user.user_id;

              const avatar = response.user.avatar;
              if (avatar) {
                // console.log('Avatar del usuario:', avatar);
              } else {
                // console.error('Falta la propiedad avatar.');
              }

              this.router.navigate(['/']);  // Redirigir a welcome

            } else {
              // console.error('Respuesta inesperada del servidor: falta información del usuario.');
              this.errorMessage = 'Error en la autenticación. Datos inválidos.';
            }
          } else {
            this.errorMessage = response.message || 'Credenciales incorrectas';  // Si la autenticación falla
            this.showErrorLogin();
          }
        },
        error => {
          // console.error('Error en el servidor:', error); // Para depuración: ver el error completo en la consola
          this.errorMessage = 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.';
        }
      );
    } else {
      // console.log("Formulario no válido"); this.loginForm.markAllAsTouched(); // Esto marcará todos los campos como tocados, lo que hará que los mensajes de error sean visibles
    }

  }

  //Métodos para mostrar erro y abrir el modal

  showErrorLogin(): void {
    if (this.errorMessage) {
      this.openModal('error', 'Error', this.errorMessage);

    }
  }

  openModal(type: string, title: string, message: string): void {
    this.errorLogin.open(ConfirmErrorModalComponent, {
      width: '300px', data: { type, title, message }
    });
  }

  //Ocultar la contraseña 

  togglePasswordVisibility() {
    this.hidePassword = false;
    setTimeout(() => {
      this.hidePassword = true;
    }, 1000);
  }

}


