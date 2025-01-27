import { Component } from '@angular/core';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-autenticacion',
  imports: [RegisterFormComponent, LoginFormComponent,CommonModule],
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.css'
})
export class AutenticacionComponent {

  isLoginVisible: boolean = true;
  isRegisterVisible: boolean = false;

  constructor(){

  }


//   toggleVisibility(): void {
//     this.isLoginVisible = !this.isLoginVisible;
//     this.isRegisterVisible = false;

// }

// toggleVisibilityOnRegister(): void {
//   this.isRegisterVisible = !this.isRegisterVisible;
//   this.isLoginVisible = false;

// }






}
